import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SellerSettingsSkeleton() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl p-4">
        <div className="space-y-4 md:space-y-8">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column */}
            <div className="w-full md:w-1/2 px-4 space-y-4">
              {/* Username */}
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              {/* Last Name */}
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              {/* First Name */}
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              {/* Phone Number */}
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              {/* Email */}
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 px-4 space-y-4">
              {/* Profile Image */}
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Update Button */}
          <div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerSettingsSkeleton;
