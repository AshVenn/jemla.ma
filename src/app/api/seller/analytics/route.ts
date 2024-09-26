import { NextResponse, NextRequest } from 'next/server';
import { Order, Product, Review } from '@/lib/backend/models/models';
import connectMongoDB from '@/lib/backend/db/mongodb';
import mongoose from 'mongoose';


export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const sellerID = url.searchParams.get('sellerID');

    if (!sellerID) {
      return NextResponse.json({ error: 'sellerID manquant' }, { status: 400 });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerID);

    // Fetch all product documents that belong to the seller
    const products = await Product.find({ sellerID: sellerObjectId }).select('productID');
    const productIDs = products.map(({ productID }) => productID); // Use productID instead of _id

    if (productIDs.length === 0) {
      return NextResponse.json({ error: 'Aucun produit trouvé pour ce vendeur' }, { status: 404 });
    }

    // Fetch all reviews for products that belong to the seller
    const reviews = await Review.find({ productID: { $in: productIDs } });

    // Aggregate total sales for the seller's products
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const salesPipeline = [
      {
        $match: {
          status: 'Delivered',
          sellerID: sellerObjectId,
          createdAt: { $gte: startOfPreviousMonth },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { "_id.year": 1 as 1 | -1, "_id.month": 1 as 1 | -1 },
      },
    ];

    const salesData = await Order.aggregate(salesPipeline);

    // Calculate sales for the current and previous months
    const currentMonthSales = salesData.find(sale => sale._id.month === now.getMonth() + 1 && sale._id.year === now.getFullYear())?.totalAmount || 0;
    const previousMonthSales = salesData.find(sale => sale._id.month === now.getMonth() && sale._id.year === now.getFullYear())?.totalAmount || 0;

    // Count total products for the seller
    const totalProducts = await Product.countDocuments({ sellerID: sellerObjectId });

    // Calculate total reviews for the current and previous month
    const currentMonthReviews = await Review.countDocuments({
      productID: { $in: productIDs },
      createdAt: { $gte: startOfCurrentMonth },
    });

    const previousMonthReviews = await Review.countDocuments({
      productID: { $in: productIDs },
      createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth },
    });

    // Get total reviews by rating for the seller's products
    const reviewsByRating = reviews.reduce((acc, { rating }) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      salesData,
      totalProducts,
      totalReviews: reviews.length,
      totalReviewsByRating: reviewsByRating,
      currentMonthReviews,
      previousMonthReviews,
      currentMonthSales,
      previousMonthSales,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Échec de la récupération des données d\'analyse' }, { status: 500 });
  }
}
