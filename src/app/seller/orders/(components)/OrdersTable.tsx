// app/commandes/page.tsx
'use client';

import React from 'react';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import OrdersTable from "./orders/data-table";
import { columns, Order } from "./orders/columns";

async function fetchOrders(sellerId: string): Promise<Order[]> {
  const response = await fetch(`/api/seller/orders?sellerId=${sellerId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des commandes');
  }
  return await response.json();
}

export default function CommandesPage() {
  const { data: session } = useSession();
  const sellerId = session?.user?.id;

  const { data: orders, isLoading, isError } = useQuery<Order[], Error>(
    ['orders', sellerId],
    () => fetchOrders(sellerId),
    { enabled: !!sellerId }
  );

  if (isLoading) {
    return <div>Chargement des commandes...</div>;
  }

  if (isError) {
    return <div>Erreur lors de la récupération des commandes.</div>;
  }

  return (
    <div>
      
        <OrdersTable columns={columns} data={orders || []} />
      </div>
  );
}
