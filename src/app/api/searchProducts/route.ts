// src/app/api/searchProducts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/backend/db/mongodb';
import { Product } from '@/lib/backend/models/models'; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  try {
    await connectMongoDB();

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    };

    const products = await Product.find(searchQuery);

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error },
      { status: 500 }
    );
  }
}
