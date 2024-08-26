import ProductSearch from '@/components/ProductSearch';

export default function ProductSearchPage({ searchParams }: { searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string } }) {
  const { q = '', category = '', minPrice = '', maxPrice = '' } = searchParams;

  return (
    <div>
      <h1>Recherche de Produits</h1>
      <form action="/search" method="get" className="flex space-x-2 mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher des produits..."
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="category"
          defaultValue={category}
          placeholder="Catégorie"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="minPrice"
          defaultValue={minPrice}
          placeholder="Prix minimum"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder="Prix maximum"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Rechercher
        </button>
      </form>
      <ProductSearch searchParams={{ q, category, minPrice, maxPrice }} />
    </div>
  );
}
