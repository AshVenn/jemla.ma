'use client';
// Import React and required components
import { useQuery } from 'react-query';
import { Product, columns } from "./(components)/products/columns";
import { ProductTable } from "./(components)/products/data-table";
import { useSession } from "next-auth/react";

// Function to fetch data from API
async function fetchData(sellerId: string): Promise<Product[]> {
  const response = await fetch(`/api/seller/products?sellerId=${sellerId}`);
  if (!response.ok) {
    throw new Error('Error fetching products');
  }
  return await response.json();
}

// Default export for the component
export default function ProductTablePage() {
  const { data: session, status } = useSession();
  const sellerId = session?.user?.id;

  // Use React Query useQuery hook to fetch data
  const { data, isLoading, isError } = useQuery<Product[], Error>(
    ['products', sellerId],
    () => fetchData(sellerId),
    {
      enabled: !!sellerId, // Only fetch data if sellerId is available
    }
  );

  // Loading state while fetching data
  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  // Display login prompt if user is not authenticated
  if (!session?.user?.id || isError) {
    return <div>Please log in to view the products.</div>;
  }

  // Render DataTable with fetched data
  return (
    <div className="container mx-auto py-10">
      <ProductTable columns={columns} data={data || []} />
    </div>
  );
}
