// ProductTableSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have the Skeleton component available

const ProductTableSkeleton = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Page Title Skeleton */}
      <Skeleton className="h-8 w-1/4 mb-6" />

      {/* Filter and Action Buttons Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Table Header Skeleton */}
      <div className="grid grid-cols-8 gap-4 mb-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="grid grid-cols-8 gap-4 items-center">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTableSkeleton;
