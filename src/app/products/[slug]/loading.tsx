export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="skeleton h-4 w-12 rounded" />
        <div className="skeleton h-4 w-4 rounded" />
        <div className="skeleton h-4 w-16 rounded" />
        <div className="skeleton h-4 w-4 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image section skeleton */}
        <div className="flex flex-col gap-4">
          <div className="skeleton aspect-square w-full rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Details section skeleton */}
        <div className="flex flex-col gap-6">
          {/* Category & Title */}
          <div className="flex flex-col gap-3">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-8 w-1/2 rounded" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-5 w-5 rounded" />
              ))}
            </div>
            <div className="skeleton h-4 w-20 rounded" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="skeleton h-10 w-28 rounded" />
            <div className="skeleton h-6 w-20 rounded" />
            <div className="skeleton h-6 w-16 rounded" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>

          {/* Quantity & Add to cart */}
          <div className="flex items-center gap-4 pt-4">
            <div className="skeleton h-12 w-32 rounded-lg" />
            <div className="skeleton h-12 flex-1 rounded-lg" />
            <div className="skeleton h-12 w-12 rounded-lg" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="skeleton h-10 w-10 rounded-full" />
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-12">
        <div className="flex gap-4 border-b mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-10 w-28 rounded-t" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}
