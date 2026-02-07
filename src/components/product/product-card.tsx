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
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
              {product.name[0]}
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          )}
          
          {/* Name */}
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Price and Cart Button Row */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-primary">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-destructive/10 text-destructive text-xs font-semibold px-1.5 py-0.5 rounded">
                  {discount}% off
                </span>
              )}
            </div>
            
            {/* Add to Cart Icon Button */}
            <Button 
              size="icon"
              variant={product.stock === 0 ? "outline" : "default"}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="shrink-0 h-8 w-8"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock status */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-orange-500 mt-1">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-destructive mt-1">Out of Stock</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
