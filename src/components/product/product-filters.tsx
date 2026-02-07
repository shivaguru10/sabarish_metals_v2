"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp,
  Check,
  ArrowUpDown,
  Package,
  Tag,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  totalProducts: number;
}

const sortOptions = [
  { value: "", label: "Newest First", icon: "🕒" },
  { value: "price-asc", label: "Price: Low to High", icon: "↑" },
  { value: "price-desc", label: "Price: High to Low", icon: "↓" },
  { value: "name", label: "Name: A to Z", icon: "🔤" },
];

const priceRanges = [
  { label: "Under ₹500", min: "", max: "500" },
  { label: "₹500 - ₹1000", min: "500", max: "1000" },
  { label: "₹1000 - ₹5000", min: "1000", max: "5000" },
  { label: "Above ₹5000", min: "5000", max: "" },
];

// Helper components defined outside the main component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-primary/20 rounded-full p-0.5">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function CategoryOption({ 
  name,  
  isActive, 
  onClick,
  count 
}: { 
  name: string; 
  isActive: boolean; 
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary"
      )}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className={cn(
          "text-xs",
          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          ({count})
        </span>
      )}
    </button>
  );
}

function CollapsibleSection({ 
  title, 
  icon: Icon, 
  isExpanded,
  onToggle,
  children 
}: { 
  title: string; 
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-sm font-semibold hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
}

export function ProductFilters({ categories, totalProducts }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Current filter values from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentInStock = searchParams.get("inStock") === "true";

  // Local state for inputs
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true,
    availability: true,
  });

  // Update URL with new params
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    params.delete("page");
    
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }, [router, searchParams]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery || null });
  };

  // Handle price range apply
  const handlePriceApply = () => {
    updateFilters({ 
      minPrice: minPrice || null, 
      maxPrice: maxPrice || null 
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.push("/products");
    });
  };

  // Check if any filters are active
  const hasActiveFilters = currentCategory || currentSearch || currentSort || currentMinPrice || currentMaxPrice || currentInStock;

  // Get active filter count
  const activeFilterCount = [currentCategory, currentSearch, currentSort, currentMinPrice || currentMaxPrice, currentInStock].filter(Boolean).length;

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filterContent = (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              if (currentSearch) updateFilters({ search: null });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Active Filters ({activeFilterCount})
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentSearch && (
              <FilterChip
                label={`"${currentSearch}"`}
                onRemove={() => {
                  setSearchQuery("");
                  updateFilters({ search: null });
                }}
              />
            )}
            {currentCategory && (
              <FilterChip
                label={categories.find(c => c.slug === currentCategory)?.name || currentCategory}
                onRemove={() => updateFilters({ category: null })}
              />
            )}
            {currentSort && (
              <FilterChip
                label={sortOptions.find(s => s.value === currentSort)?.label || currentSort}
                onRemove={() => updateFilters({ sort: null })}
              />
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <FilterChip
                label={`₹${currentMinPrice || "0"} - ₹${currentMaxPrice || "∞"}`}
                onRemove={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  updateFilters({ minPrice: null, maxPrice: null });
                }}
              />
            )}
            {currentInStock && (
              <FilterChip
                label="In Stock"
                onRemove={() => updateFilters({ inStock: null })}
              />
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <CollapsibleSection 
        title="Categories" 
        icon={Tag} 
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="space-y-1">
          <CategoryOption
            name="All Products"
            isActive={!currentCategory}
            onClick={() => updateFilters({ category: null })}
            count={totalProducts}
          />
          {categories.map((cat) => (
            <CategoryOption
              key={cat.id}
              name={cat.name}
              isActive={currentCategory === cat.slug}
              onClick={() => updateFilters({ category: cat.slug })}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection 
        title="Price Range" 
        icon={Tag} 
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-7 text-sm"
                min={0}
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-7 text-sm"
                min={0}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePriceApply}
            className="w-full"
            disabled={isPending}
          >
            Apply Price Filter
          </Button>
          {/* Quick price ranges */}
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setMinPrice(range.min);
                  setMaxPrice(range.max);
                  updateFilters({ minPrice: range.min || null, maxPrice: range.max || null });
                }}
                className={cn(
                  "text-xs px-2 py-1 rounded-full border transition-colors",
                  minPrice === range.min && maxPrice === range.max
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-secondary border-border"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Availability */}
      <CollapsibleSection 
        title="Availability" 
        icon={Package} 
        isExpanded={expandedSections.availability}
        onToggle={() => toggleSection("availability")}
      >
        <button
          onClick={() => updateFilters({ inStock: currentInStock ? null : "true" })}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className={cn(
            "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
            currentInStock 
              ? "bg-primary border-primary" 
              : "border-muted-foreground/30 hover:border-primary"
          )}>
            {currentInStock && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
          <span className="text-sm">In Stock Only</span>
        </button>
      </CollapsibleSection>

      {/* Sort By */}
      <CollapsibleSection 
        title="Sort By" 
        icon={ArrowUpDown} 
        isExpanded={expandedSections.sort}
        onToggle={() => toggleSection("sort")}
      >
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilters({ sort: option.value || null })}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                (currentSort || "") === option.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              )}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
              {(currentSort || "") === option.value && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {filterContent}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <Button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Applying..." : `Show Results`}
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>
            {isPending && (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
