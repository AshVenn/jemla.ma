'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

interface SellerRevenueCardProps {
  period: 'month' | 'year';
}

async function fetchRevenue(period: string, sellerId: string) {
  const response = await fetch(`/api/seller/revenueInfo?period=${period}&sellerID=${sellerId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des informations de revenu');
  }
  return await response.json();
}

function SellerRevenueCard({ period }: SellerRevenueCardProps) {
  const { data: session, status } = useSession();
  const sellerId = session?.user?.id;

  const { data, error, isLoading } = useQuery(
    ['revenue', period, sellerId],
    () => fetchRevenue(period, sellerId!),
    {
      enabled: !!sellerId, // Only run query if sellerId is available
      refetchOnWindowFocus: false, // Prevent refetching on window focus
    }
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur lors de la récupération des données</div>;
  }

  const revenue = data?.revenue || 0;
  const progress = data?.progress || 0;
  const description = `+${progress}% par rapport à ${period === 'month' ? 'le mois dernier' : "l'année dernière"}`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{period === 'month' ? 'Ce mois-ci' : 'Cette année'}</CardDescription>
        <CardTitle className="text-4xl">{`${revenue}€`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {description}
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={progress} aria-label={`${progress}% d'augmentation`} />
      </CardFooter>
    </Card>
  );
}

export default SellerRevenueCard;
