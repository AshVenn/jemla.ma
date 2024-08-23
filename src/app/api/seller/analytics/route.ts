import { NextResponse, NextRequest } from 'next/server';
import { Order, Product, Review } from '@/lib/backend/models/models';
import connectMongoDB from '@/lib/backend/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const sellerID = url.searchParams.get('sellerID');

    if (!sellerID) {
      return NextResponse.json({ error: 'sellerID manquant' }, { status: 400 });
    }

    const totalSales = await Order.aggregate([
      { $match: { status: 'Delivered', sellerID } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const totalProducts = await Product.countDocuments({ sellerID });
    const totalReviews = await Review.countDocuments({ sellerID });

    const averageRatingResult = await Review.aggregate([
      { $match: { sellerID } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    const averageRating = averageRatingResult[0]?.averageRating || 0;

    const totalReviewsByRating = await Review.aggregate([
      { $match: { sellerID } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const reviewsByRating = totalReviewsByRating.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Debugging output
    console.log(reviewsByRating);

    return NextResponse.json({
      totalSales,
      totalProducts,
      totalReviews,
      averageRating,
      totalReviewsByRating: reviewsByRating,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Échec de la récupération des données d\'analyse' }, { status: 500 });
  }
}

