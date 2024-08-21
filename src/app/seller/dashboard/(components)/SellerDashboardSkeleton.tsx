import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function SellerDashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
    {/* Dashboard Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
    </div>

    {/* Main Content with Table and Sidebar */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Table Skeleton */}
      <div className="col-span-2 mt-4 p-4 rounded-lg bg-white">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 mb-2 rounded-md" />
        <Skeleton className="h-12 mb-2 rounded-md" />
        <Skeleton className="h-12 mb-2 rounded-md" />
        <Skeleton className="h-12 mb-2 rounded-md" />
      </div>

      {/* Order Details Skeleton */}
      <div className="mt-4 p-4 rounded-lg bg-white">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-4" />
      </div>
    </div>
  </div>
  )
}
