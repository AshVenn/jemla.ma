import connectMongoDb from '@/lib/backend/db/mongodb';
import { Product as ProductModel, Category as CategoryModel } from '@/lib/backend/models/models';
import ProductCard from './ProductCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

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
  searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string; page?: string };
}) {
  await connectMongoDb();

  const { q, category, minPrice, maxPrice, page = '1' } = searchParams;
  const itemsPerPage = 12; // Number of items per page
  const currentPage = parseInt(page, 10);

  const query: any = {
    available: true,
  };

  // If no search criteria are provided, fetch all products
  if (q) {
    query['$text'] = { $search: q };
  }

  if (category) {
    // Fetch the category ID from the Category collection
    const categoryDoc = await CategoryModel.findOne({ name: category }).exec();
    if (categoryDoc) {
      query['categoryID'] = categoryDoc._id;
    }
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
  let totalItems = 0;

  try {
    totalItems = await ProductModel.countDocuments(query).exec();
    const docs = await ProductModel.find(query)
      .populate('categoryID')
      .populate('sellerID')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean()
      .exec();

    products = docs.map((doc) => ({
      productID: doc.productID.toString(),
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (<>
    <h1>Produits:</h1>
    <div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product,key:number) => (
            <ProductCard
              key={key}
              productID={product.productID}
              name={product.name}
              description={product.description}
              basePrice={product.basePrice}
              images={product.images}
              averageRating={product.averageRating}
              numReviews={product.numReviews}
              className="w-[200px] h-[200px]"
            />
          ))
        ) : (
          <p>Aucun produit trouvé.</p>
        )}
      </div>
      <Pagination className="mt-6">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationPrevious
              href={`?page=${currentPage - 1}`}
            />
          )}
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href={`?page=${i + 1}`}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationNext
              href={`?page=${currentPage + 1}`}
            />
          )}
        </PaginationContent>
      </Pagination>
    </div>
    </>
  );
}
