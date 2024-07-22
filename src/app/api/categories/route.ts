import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/backend/db/mongodb';
import { Category } from '@/lib/backend/models/models';

export async function GET(req: NextRequest) {
  await connectMongoDB();

  try {
    const categories = await Category.find().exec();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}
