import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function OrdersTableSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title Skeleton */}
      <Skeleton className="h-8 w-1/4 mb-6" />

      {/* Filter and Action Buttons Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Quote Skeleton */}
      <Skeleton className="h-6 w-1/2 mb-4" />

      {/* Table Skeleton */}
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="grid grid-cols-6 gap-4 mb-2">
          <Skeleton className="h-6 w-full col-span-1" /> {/* Client */}
          <Skeleton className="h-6 w-full col-span-1" /> {/* Montant Total */}
          <Skeleton className="h-6 w-full col-span-1" /> {/* Statut */}
          <Skeleton className="h-6 w-full col-span-1" /> {/* Date de création */}
          <Skeleton className="h-6 w-full col-span-1" /> {/* Actions */}
        </div>

        {/* Rows Skeleton */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 items-center">
            <Skeleton className="h-6 w-full col-span-1" /> {/* Client */}
            <Skeleton className="h-6 w-full col-span-1" /> {/* Montant Total */}
            <Skeleton className="h-6 w-full col-span-1" /> {/* Statut */}
            <Skeleton className="h-6 w-full col-span-1" /> {/* Date de création */}
            <Skeleton className="h-6 w-full col-span-1" /> {/* Actions */}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-6 w-16" /> {/* Previous */}
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-6" /> {/* Page 1 */}
          <Skeleton className="h-6 w-6" /> {/* Page 2 */}
          <Skeleton className="h-6 w-6" /> {/* Page 3 */}
        </div>
        <Skeleton className="h-6 w-16" /> {/* Next */}
      </div>
    </div>
  )
}

export default OrdersTableSkeleton