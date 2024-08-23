'use client';
import React from 'react';
import { useQuery } from 'react-query';
import { ProductWithInventory, columns } from "./(components)/products/columns";
import ProductTable from "./(components)/products/data-table";
import { useSession } from "next-auth/react";
import ProductTableSkeleton from "./(components)/ProductTableSkeleton";

// Fetch data including product and inventory details
async function fetchData(sellerId: string | undefined): Promise<ProductWithInventory[]> {
  const response = await fetch(`/api/seller/products?sellerId=${sellerId}`);
  if (!response.ok) {
    throw new Error('Error fetching products');
  }
  return await response.json();
}

export default function ProductTablePage() {
  const { data: session, status } = useSession();
  const sellerId = session?.user?.id;

  // Use useQuery hook to fetch data
  const { data, isLoading, isFetching, isError } = useQuery<ProductWithInventory[], Error>(
    ['products', sellerId],
    () => fetchData(sellerId),
    {
      enabled: !!sellerId, // Only fetch data if sellerId is available
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false, // Do not refetch on window focus
    }
  );

  // Display skeleton if loading or fetching new data
  if (status === 'loading' || isLoading || isFetching) {
    return <ProductTableSkeleton />;
  }

  // Display login prompt if user is not authenticated or error occurs
  if (!session?.user?.id || isError) {
    return <div>Veuillez vous connecter pour voir les produits.</div>;
  }

  // Render DataTable with fetched data
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Produits</h1>
      <ProductTable columns={columns} data={data || []} />
    </div>
  );
}
