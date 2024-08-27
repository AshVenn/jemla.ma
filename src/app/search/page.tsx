import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductSearch from '@/components/ProductSearch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default async function ProductSearchPage({ searchParams }: { searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string } }) {
  const { q = '', category = 'all', minPrice = '', maxPrice = '' } = searchParams;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`);
  const categories = await res.json();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recherche de Produits</h1>
      <form action="/search" method="get" className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-4">
        <Input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher des produits..."
          className="flex-1"
        />
        
        <Select name="category" defaultValue={category}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Toutes les catégories</SelectItem>    
              {categories.map((cat: any, index: number) => (
                <SelectItem key={index} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          type="number"
          name="minPrice"
          defaultValue={minPrice}
          placeholder="Prix minimum"
          className="flex-1"
        />
        <Input
          type="number"
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder="Prix maximum"
          className="flex-1"
        />
        <Button variant="default" type="submit" className="w-full sm:w-auto">
          Rechercher
        </Button>
      </form>
      <ProductSearch searchParams={{ q, category, minPrice, maxPrice }} />
    </div>
  );
}
