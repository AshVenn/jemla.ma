import { NextRequest, NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import { Order, OrderItem } from '../../../../lib/backend/models/models';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDb();

    const { searchParams } = new URL(req.url);
    const sellerID = searchParams.get('sellerID');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!sellerID) {
      return NextResponse.json({ message: 'Seller ID is required' }, { status: 400 });
    }

    // Fetch orders with populated payment details
    const orders = await Order.find({ sellerID, status: 'Shipped' })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('clientID')
      .populate({
        path: 'shipmentID',
        populate: { path: 'addressID' } // Populate address details
      })
      .populate('paymentID') // Populate payment details
      .exec();

    // Fetch and populate orderItems separately
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderID: order._id }).populate('productID').exec();
        return {
          ...order.toObject(),
          orderItems: items.map(item => ({
            _id: item._id,
            productID: item.productID, 
            quantity: item.quantity,
            price: item.price,
          })),
          payment: order.paymentID ? order.paymentID.toObject() : null, // Include the populated payment details
        };
      })
    );

    const totalOrders = await Order.countDocuments({ sellerID, status: 'Shipped' });

    return NextResponse.json({ orders: ordersWithItems, totalOrders }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching orders:', error.message);
      return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error fetching orders:', error);
      return NextResponse.json({ message: 'Unknown error fetching orders' }, { status: 500 });
    }
  }
}
