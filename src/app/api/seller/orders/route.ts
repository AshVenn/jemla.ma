// api/seller/orders/route.js
import { NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import { Order, OrderItem, User } from '../../../../lib/backend/models/models';

export async function GET(req) {
  try {
    await connectMongoDb();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ message: 'ID de vendeur requis' }, { status: 400 });
    }

    const userExists = await User.exists({ _id: sellerId });
    if (!userExists) {
      return NextResponse.json({ message: 'Vendeur non trouvé' }, { status: 404 });
    }

    // Récupérer les commandes du vendeur
    const orders = await Order.find({ sellerID: sellerId }).populate('clientID').exec();

    // Récupérer les OrderItems associés à chaque commande
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderID: order._id }).populate('productID').exec();
        return {
          ...order.toObject(),
          items: items.map(item => ({
            productID: item.productID,
            quantity: item.quantity,
            price: item.price,
          })),
        };
      })
    );

    return NextResponse.json(ordersWithItems, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
