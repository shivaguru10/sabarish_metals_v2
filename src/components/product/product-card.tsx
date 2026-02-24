"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  category: {
    name: string;
    slug: string;
  } | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        stock: product.stock,
      });
    }
  };

  return (
    <Link href={"/products/" + product.slug}>
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] sm:aspect-square bg-secondary overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-muted-foreground/30">
              {product.name[0]}
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        </div>

        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-2.5">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          {/* Name */}
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-base sm:text-lg text-primary">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-destructive/10 text-destructive text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded">
                {discount}% off
              </span>
            )}
          </div>

          {/* Stock status */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[10px] sm:text-xs text-orange-500">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-[10px] sm:text-xs text-destructive">Out of Stock</p>
          )}

          {/* Add to Cart Button */}
          <Button
            variant={product.stock === 0 ? "outline" : "default"}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full h-9 sm:h-10 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] group/cart"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 transition-transform group-hover/cart:scale-110" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
