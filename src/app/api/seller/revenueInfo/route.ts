import { NextRequest, NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import { Order } from '../../../../lib/backend/models/models';
import { Types } from 'mongoose';
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period');
    const sellerID = searchParams.get('sellerID');

    if (!sellerID) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }

    if (!period || (period !== 'month' && period !== 'year')) {
      return NextResponse.json({ error: 'Invalid period specified' }, { status: 400 });
    }

    await connectMongoDb();

    const now = new Date();
    let startDate: Date;
    let endDate = new Date();

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    console.log(`Matching orders from ${startDate} to ${endDate} for sellerID: ${sellerID}`);

    const revenue = await Order.aggregate([
      {
        $match: {
          sellerID: new Types.ObjectId(sellerID), // Convert sellerID to ObjectId
          status: 'Delivered',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    console.log('Revenue aggregation result:', revenue);

    const revenueAmount = revenue.length > 0 ? revenue[0].totalAmount : 0;

    return NextResponse.json({
      revenue: revenueAmount,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de revenu', error);
    return NextResponse.json({ error: 'Erreur du serveur interne' }, { status: 500 });
  }
}
