'use client'
import * as React from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import OrdersTable from "../orders/(components)/OrdersTable";
import SellerRevenueCard from "./(components)/SellerRevenueCard"
import SellerOrderTracker from "./(components)/SellerOrderTracker"
import SellerProductSpace from "./(components)/SellerProductSpace";

function VendeurDashboard() {
  return (
    <>
 
      
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 overflow-x-hidden w-full max-w-full">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 w-full max-w-full">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 w-full max-w-full">
            <SellerProductSpace />

            <Card x-chunk="dashboard-05-chunk-1" className="w-full max-w-full overflow-x-hidden">
              <SellerRevenueCard period="year" />
            </Card>
            <Card x-chunk="dashboard-05-chunk-2" className="w-full max-w-full overflow-x-hidden">
              <SellerRevenueCard period="month" />
            </Card>
          </div>

          <Card x-chunk="dashboard-05-chunk-3" className="w-full max-w-full overflow-x-hidden">
            <CardContent className="w-full max-w-full">
              <OrdersTable />
            </CardContent>
          </Card>
        </div>
        <div className='w-full max-w-full grid grid-cols-1 overflow-x-scroll scrollbar-hide'>
          <SellerOrderTracker />
        </div>
      </main>
    </>
  )
}

export default VendeurDashboard
