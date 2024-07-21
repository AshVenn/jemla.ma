import { NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import { Product, User } from '../../../../lib/backend/models/models';

export async function GET(req: Request) {
  try {
    await connectMongoDb();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ message: 'Seller ID is required' }, {
        status: 400,
      });
    }

    const userExists = await User.exists({ _id: sellerId });
    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, {
        status: 404,
      });
    }

    const products = await Product.find({ sellerID: sellerId }).populate('categoryID').exec();

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, {
      status: 500,
    });
  }
}
