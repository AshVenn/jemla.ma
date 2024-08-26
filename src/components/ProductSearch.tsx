import connectMongoDb from '@/lib/backend/db/mongodb';
import { Product as ProductModel } from '@/lib/backend/models/models';

type Product = {
  productID: string;
  sellerID: string;
  name: string;
  description?: string;
  detailedDescription?: string;
  basePrice: number;
  categoryID: string;
  images: string[];
  attributes: { key: string; value: string }[];
  sku: string;
  brand?: string;
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  available: boolean;
  averageRating: number;
  numReviews: number;
  warranty?: string;
  returnPolicy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function ProductSearch({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string };
}) {
  await connectMongoDb();

  const { q, category, minPrice, maxPrice } = searchParams;

  // Only proceed if at least one search parameter is provided
  const shouldFetchProducts = q || category || minPrice || maxPrice;

  if (!shouldFetchProducts) {
    return (
      <div>
        <h1>Recherche de Produits</h1>
        <p>Veuillez saisir des critères de recherche pour afficher les produits.</p>
      </div>
    );
  }

  const query: any = {
    available: true,
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

  let products: Product[] = [];

  try {
    const docs = await ProductModel.find(query)
      .populate('categoryID')
      .populate('sellerID')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    products = docs.map((doc) => ({
      productID: doc.productID,
      sellerID: doc.sellerID,
      name: doc.name,
      description: doc.description,
      detailedDescription: doc.detailedDescription,
      basePrice: doc.basePrice,
      categoryID: doc.categoryID,
      images: doc.images,
      attributes: doc.attributes,
      sku: doc.sku,
      brand: doc.brand,
      tags: doc.tags,
      seo: doc.seo,
      available: doc.available,
      averageRating: doc.averageRating,
      numReviews: doc.numReviews,
      warranty: doc.warranty,
      returnPolicy: doc.returnPolicy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
  }

  return (
    <div>
      <h1>Recherche de Produits</h1>
      <div>
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Prix: {product.basePrice} €</p>
            </div>
          ))
        ) : (
          <p>Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}
