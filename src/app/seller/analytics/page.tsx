"use client";

import SellerSalesBarChart  from "./(components)/SellerSalesBarChart";
import  SellerReviewsPieChart  from "./(components)/SellerReviewsPieChart";
import  SellerProductsLineChart  from "./(components)/SellerProductsLineChart";

export default function AnalyticsPage() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4">
      <div className="col-span-1 md:col-span-2">
        <SellerSalesBarChart />
      </div>
      <div className="col-span-1">
        <SellerReviewsPieChart />
      </div>
      <div className="col-span-1">
        <SellerProductsLineChart />
      </div>
    </div>
  );
}
