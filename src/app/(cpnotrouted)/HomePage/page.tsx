import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductSearch from '@/components/ProductSearch';

export default async function ProductSearchPage({ searchParams }: { searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string } }) {
  const { q = '', category = '', minPrice = '', maxPrice = '' } = searchParams;
  const categories = await fetch('api/categories');
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6">Recherche de Produits</h1>
      <form action="/search" method="get" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative">
          <Input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Rechercher des produits..."
            className="peer h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          />
          <label className="absolute left-3 -top-2.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-600">
            Rechercher
          </label>
        </div>
        <div className="relative">
          <Input
            type="text"
            name="category"
            defaultValue={category}
            placeholder="Catégorie"
            className="peer h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          />
          <label className="absolute left-3 -top-2.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-600">
            Catégorie
          </label>
        </div>
        <div className="relative">
          <Input
            type="number"
            name="minPrice"
            defaultValue={minPrice}
            placeholder="Prix minimum"
            className="peer h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          />
          <label className="absolute left-3 -top-2.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-600">
            Prix minimum
          </label>
        </div>
        <div className="relative">
          <Input
            type="number"
            name="maxPrice"
            defaultValue={maxPrice}
            placeholder="Prix maximum"
            className="peer h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          />
          <label className="absolute left-3 -top-2.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-600">
            Prix maximum
          </label>
        </div>
        <Button variant="default" type="submit" className="h-10 w-full rounded-md bg-black text-white hover:bg-gray-800 transition-colors">
          Rechercher
        </Button>
      </form>
      <ProductSearch searchParams={{ q, category, minPrice, maxPrice }} />
    </div>
  );
}
