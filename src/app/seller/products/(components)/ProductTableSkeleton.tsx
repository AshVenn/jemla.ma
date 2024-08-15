// ProductTableSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have the Skeleton component available

const ProductTableSkeleton = () => {
  return (
    <div className='overflow-auto'>
      <div className="py-4 flex items-center justify-between space-x-2">
        <Skeleton className="w-24 h-8 rounded" />
        <div className='flex space-x-2'>
          <Skeleton className="w-20 h-8 rounded" />
          <Skeleton className="w-20 h-8 rounded" />
          <Skeleton className="w-32 h-8 rounded" />
        </div>
      </div>
      <div className="py-2">
        <Skeleton className="w-full h-10 rounded" />
      </div>
      <div className="grid grid-cols-1 flex-1 overflow-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-6 rounded" />
            <Skeleton className="h-6 rounded" />
            <Skeleton className="h-6 rounded" />
            <Skeleton className="h-6 rounded" />
          </div>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <Skeleton className="h-8 rounded" />
                <Skeleton className="h-8 rounded" />
                <Skeleton className="h-8 rounded" />
                <Skeleton className="h-8 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <Skeleton className="w-24 h-8 rounded" />
        <Skeleton className="w-24 h-8 rounded" />
      </div>
    </div>
  );
};

export default ProductTableSkeleton;
