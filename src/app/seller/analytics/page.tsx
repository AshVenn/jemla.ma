"use client";

import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import SellerSalesBarChart from "./(components)/SellerSalesBarChart";
import SellerReviewsPieChart from "./(components)/SellerReviewsPieChart";
import SellerProductsLineChart from "./(components)/SellerProductsLineChart";

const fetchAnalyticsData = async (sellerID: string | undefined) => {
  const res = await fetch(`/api/seller/analytics?sellerID=${sellerID}`);
  const data = await res.json();
  return data;
};


export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const sellerID = session?.user?.id;

  const { data, isLoading, error } = useQuery(
    ['analyticsData', sellerID],
    () => fetchAnalyticsData(sellerID),
    { enabled: !!sellerID } // The query won't run until sellerID is available
  );

  if (status === "loading" || isLoading) return <div>Chargement...</div>;
  if (status === "unauthenticated" || error) return <div>Erreur de chargement des données</div>;

  // Extract specific data for each chart
  const salesData = data?.salesData || [];  // Provide a default empty array
  const reviewData = data?.totalReviewsByRating || {};
  const productsData = data?.totalProducts || 0;
  const previousMonthReviews = data?.previousMonthReviews || 0;
  const currentMonthSales = data?.currentMonthSales || 0;
  const previousMonthSales = data?.previousMonthSales || 0;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4">
      <div className="col-span-1 md:col-span-2">
        <SellerSalesBarChart 
          salesData={salesData} 
          currentMonthSales={currentMonthSales} 
          previousMonthSales={previousMonthSales} 
        />
      </div>
      <div className="col-span-1">
        <SellerReviewsPieChart 
          reviewData={reviewData} 
          previousTotalReviews={previousMonthReviews} 
        />
      </div>
      <div className="col-span-1">
        <SellerProductsLineChart productsData={productsData} />
      </div>
    </div>
  );
}
