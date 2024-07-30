'use client';
import React from 'react';
import { useQuery } from 'react-query';
import { Product, columns } from "./(components)/products/columns";
import ProductTable from "./(components)/products/data-table";
import { useSession } from "next-auth/react";
import ProductTableSkeleton from "./(components)/ProductTableSkeleton"; // Import the skeleton component

async function fetchData(sellerId: string): Promise<Product[]> {
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
  const { data, isLoading, isFetching, isError } = useQuery<Product[], Error>(
    ['products', sellerId],
    () => fetchData(sellerId),
    {
      enabled: !!sellerId, // Only fetch data if sellerId is available
    }
  );

  // Display skeleton if loading or fetching new data
  if (status === 'loading' || isLoading || isFetching) {
    return <ProductTableSkeleton />;
  }

  // Display login prompt if user is not authenticated
  if (!session?.user?.id || isError) {
    return <div>Veuillez vous connecter pour voir les produits.</div>;
  }

  // Render DataTable with fetched data
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Produits</h1>
      <ProductTable columns={columns} data={data || []} />
    </div>
  );
}
