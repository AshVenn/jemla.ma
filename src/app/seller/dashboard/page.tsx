'use client'
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"




import OrdersTable from "../orders/(components)/OrdersTable";
import { useRouter } from "next/navigation"
import SellerRevenueCard from "./(components)/SellerRevenueCard"
import SellerOrderTracker from "./(components)/SellerOrderTracker"
import SellerProductSpace from "./(components)/SellerProductSpace";
function VendeurDashboard() {

  const router= useRouter();
  const redirectToProducts =()=>{
    router.push('/seller/products')
  }
  return (
    <>
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">

                  <SellerProductSpace/>

              <Card x-chunk="dashboard-05-chunk-1">
                <SellerRevenueCard period="year"/>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
              <SellerRevenueCard period="month"/>
              </Card>
            </div>
            

                <Card x-chunk="dashboard-05-chunk-3">
                  <CardContent>

                    <OrdersTable/>
                    
                  </CardContent>
                </Card>
          </div>
          <div>
            <SellerOrderTracker/>
          </div>
        </main>
    </>
  )
}

export default VendeurDashboard