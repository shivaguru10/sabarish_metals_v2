import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      {/* Image skeleton */}
      <div className="skeleton aspect-square w-full rounded-lg" />
      
      {/* Content */}
      <div className="flex flex-col gap-3">
        {/* Category */}
        <div className="skeleton h-3 w-20 rounded" />
        
        {/* Name - 2 lines */}
        <div className="flex flex-col gap-2">
          <div className="skeleton h-5 w-full rounded" />
          <div className="skeleton h-5 w-3/4 rounded" />
        </div>
        
        {/* Price row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-20 rounded" />
            <div className="skeleton h-4 w-14 rounded" />
          </div>
          <div className="skeleton h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-4 rounded" />
          <div className="skeleton h-5 w-16 rounded" />
        </div>
        
        {/* Search */}
        <div className="skeleton h-10 w-full rounded-md" />
        
        {/* Categories section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="skeleton h-5 w-24 rounded" />
            <div className="skeleton h-4 w-4 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Price section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="skeleton h-5 w-24 rounded" />
            <div className="skeleton h-4 w-4 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-10 flex-1 rounded-md" />
            <div className="skeleton h-10 flex-1 rounded-md" />
          </div>
          <div className="skeleton h-9 w-full rounded-md" />
        </div>
        
        {/* Sort section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="skeleton h-5 w-16 rounded" />
            <div className="skeleton h-4 w-4 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileFilterSkeleton() {
  return (
    <div className="lg:hidden mb-4">
      <div className="skeleton h-10 w-full rounded-md" />
    </div>
  );
}

export function ResultsBarSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="skeleton h-4 w-4 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
      </div>
      <div className="skeleton h-4 w-24 rounded" />
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-2">
        <div className="skeleton h-10 w-20 rounded-md" />
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-10 rounded-md" />
          ))}
        </div>
        <div className="skeleton h-10 w-16 rounded-md" />
      </div>
    </div>
  );
}
