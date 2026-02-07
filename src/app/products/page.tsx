import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { Suspense } from "react";
import { Package } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

async function getProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}) {
  const { category, search, sort, page = "1", minPrice, maxPrice, inStock } = params;
  const limit = 12;
  const skip = (parseInt(page) - 1) * limit;

  const where: any = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // In stock filter
  if (inStock === "true") {
    where.stock = { gt: 0 };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return { products, total, totalPages: Math.ceil(total / limit) };
}

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

async function getTotalProductCount() {
  return db.product.count({ where: { isActive: true } });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [{ products, total, totalPages }, categories, totalProductCount] = await Promise.all([
    getProducts(params),
    getCategories(),
    getTotalProductCount(),
  ]);

  const currentPage = parseInt(params.page || "1");

  // Create URL for pagination that preserves current filters
  const createPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (params.category) urlParams.set("category", params.category);
    if (params.search) urlParams.set("search", params.search);
    if (params.sort) urlParams.set("sort", params.sort);
    if (params.minPrice) urlParams.set("minPrice", params.minPrice);
    if (params.maxPrice) urlParams.set("maxPrice", params.maxPrice);
    if (params.inStock) urlParams.set("inStock", params.inStock);
    urlParams.set("page", String(page));
    return `/products?${urlParams.toString()}`;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of premium quality metals and alloys
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <Suspense fallback={<div className="w-72 h-96 bg-secondary/20 animate-pulse rounded-xl" />}>
          <ProductFilters 
            categories={categories} 
            totalProducts={totalProductCount}
          />
        </Suspense>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results count & current filters summary */}
          <div className="mb-6 flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                <span className="font-medium">{total}</span>
                <span className="text-muted-foreground"> products found</span>
                {products.length !== total && (
                  <span className="text-muted-foreground"> (showing {products.length})</span>
                )}
              </p>
            </div>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-secondary/20 rounded-xl">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <a 
                href="/products"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Clear all filters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-1">
                {/* Previous */}
                {currentPage > 1 ? (
                  <a
                    href={createPageUrl(currentPage - 1)}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Previous
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-border text-muted-foreground/50 cursor-not-allowed text-sm">
                    Previous
                  </span>
                )}
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                      return (
                        <span key={page} className="flex items-center">
                          {showEllipsisBefore && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <a
                            href={createPageUrl(page)}
                            className={`inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "border border-border hover:bg-secondary"
                            }`}
                          >
                            {page}
                          </a>
                        </span>
                      );
                    })}
                </div>

                {/* Next */}
                {currentPage < totalPages ? (
                  <a
                    href={createPageUrl(currentPage + 1)}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Next
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-border text-muted-foreground/50 cursor-not-allowed text-sm">
                    Next
                  </span>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
