import { NextRequest, NextResponse } from 'next/server';
import connectMongoDb from '@/lib/backend/db/mongodb'; 
import { Product } from '@/lib/backend/models/models';

export const dynamic = 'force-dynamic';  // This tells Next.js to render dynamically

export async function GET(req: NextRequest) {
  await connectMongoDb();

  const url = new URL(req.url);
  const q = url.searchParams.get('q');
  const category = url.searchParams.get('category');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');

  const query: any = {
    available: true, // Only fetch available products
  };

  if (q) {
    query['$text'] = { $search: q };
  }

  if (category) {
    query['categoryID'] = category;
  }

  if (minPrice) {
    query['basePrice'] = { $gte: Number(minPrice) };
  }

  if (maxPrice) {
    query['basePrice'] = {
      ...query['basePrice'],
      $lte: Number(maxPrice),
    };
  }

  try {
    const products = await Product.find(query)
      .populate('categoryID')
      .populate('sellerID')
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la récupération des produits" }, { status: 500 });
  }
}
