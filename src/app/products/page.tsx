import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}) {
  const { category, search, sort, page = "1" } = params;
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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const currentPage = parseInt(params.page || "1");

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
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/products"
                    className={`text-sm hover:text-primary ${!params.category ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    All Products
                  </a>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={"/products?category=" + cat.slug}
                      className={`text-sm hover:text-primary ${params.category === cat.slug ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <ul className="space-y-2">
                {[
                  { value: "", label: "Newest" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "name", label: "Name: A to Z" },
                ].map((option) => (
                  <li key={option.value}>
                    <a
                      href={"/products?" + new URLSearchParams({ ...params, sort: option.value }).toString()}
                      className={`text-sm hover:text-primary ${(params.sort || "") === option.value ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {total} products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {currentPage > 1 && (
                <a
                  href={"/products?" + new URLSearchParams({ ...params, page: String(currentPage - 1) }).toString()}
                  className="px-4 py-2 border rounded-md hover:bg-secondary"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <a
                  href={"/products?" + new URLSearchParams({ ...params, page: String(currentPage + 1) }).toString()}
                  className="px-4 py-2 border rounded-md hover:bg-secondary"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
