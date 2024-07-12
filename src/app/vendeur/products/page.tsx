'use client'
// Import React and required components
import { useQuery } from 'react-query';
import { Produit, columns } from "./{components}/products/columns";
import { ProductTable } from "./{components}/products/data-table";
import { useSession } from "next-auth/react";

// Function to fetch data from API
async function fetchData(vendeurId: string): Promise<Produit[]> {
  const response = await fetch(`/api/vendeur/products?vendeurId=${vendeurId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des produits');
  }
  return await response.json();
}

// Default export for the component
export default function ProductTablePage() {
  const { data: session, status } = useSession();
  const vendeurId = session?.user?.id;

  // Use React Query useQuery hook to fetch data
  const { data, isLoading, isError } = useQuery<Produit[], Error>(
    ['products', vendeurId],
    () => fetchData(vendeurId),
    {
      enabled: !!vendeurId, // Only fetch data if vendeurId is available
    }
  );

  // Loading state while fetching data
  if (status === 'loading' || isLoading) {
    return <div>Chargement en cours...</div>;
  }

  // Display login prompt if user is not authenticated
  if (!session?.user?.id || isError) {
    return <div>Veuillez vous connecter pour voir les produits.</div>;
  }

  // Render DataTable with fetched data
  return (
    <div className="container mx-auto py-10">
      <ProductTable columns={columns} data={data || []} />
    </div>
  );
}
