import { 
  FiltersSkeleton, 
  MobileFilterSkeleton, 
  ProductGridSkeleton, 
  ResultsBarSkeleton, 
  PaginationSkeleton
} from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="skeleton h-9 w-48 rounded" />
        <div className="skeleton h-5 w-80 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <MobileFilterSkeleton />
        
        {/* Sidebar Filters */}
        <FiltersSkeleton />

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results count */}
          <ResultsBarSkeleton />

          {/* Product Grid */}
          <ProductGridSkeleton count={9} />

          {/* Pagination */}
          <PaginationSkeleton />
        </div>
      </div>
    </div>
  );
}
