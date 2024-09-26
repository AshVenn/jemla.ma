import { NextRequest, NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import { Order } from '../../../../lib/backend/models/models';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
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
    let startDate: Date | undefined;
    let endDate = new Date();

    let prevStartDate: Date | undefined;
    let prevEndDate: Date | undefined;

    // Calculate start and end dates for current and previous periods
    if (period === 'month') {
      // Current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      // Previous month
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of the previous month
    } else if (period === 'year') {
      // Current year
      startDate = new Date(now.getFullYear(), 0, 1);

      // Previous year
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
      prevEndDate = new Date(now.getFullYear() - 1, 11, 31); // Last day of the previous year
    }

    // Ensure dates are defined before using them
    if (!startDate || !prevStartDate || !prevEndDate) {
      return NextResponse.json({ error: 'Failed to calculate date ranges' }, { status: 500 });
    }

    // Fetch current period revenue
    const currentRevenue = await Order.aggregate([
      {
        $match: {
          sellerID: new Types.ObjectId(sellerID),
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

    const currentRevenueAmount = currentRevenue.length > 0 ? currentRevenue[0].totalAmount : 0;

    // Fetch previous period revenue
    const previousRevenue = await Order.aggregate([
      {
        $match: {
          sellerID: new Types.ObjectId(sellerID),
          status: 'Delivered',
          createdAt: { $gte: prevStartDate, $lte: prevEndDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const previousRevenueAmount = previousRevenue.length > 0 ? previousRevenue[0].totalAmount : 0;

    // Calculate progress as percentage change
    const progress = previousRevenueAmount
      ? ((currentRevenueAmount - previousRevenueAmount) / previousRevenueAmount) * 100
      : currentRevenueAmount > 0
      ? 100
      : 0;

    return NextResponse.json({
      revenue: currentRevenueAmount,
      progress,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de revenu', error);
    return NextResponse.json({ error: 'Erreur du serveur interne' }, { status: 500 });
  }
}
