"use client";

import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  rowCount?: number;
  columnCount?: number;
};

export function TableSkeleton({
  rowCount = 5,
  columnCount = 6,
}: TableSkeletonProps) {
  return (
    <div className="space-y-4 mx-8 mt-8">
      {/* Header skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: columnCount }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-10 w-full" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-12 w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
}