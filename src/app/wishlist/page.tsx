"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore, useCartStore } from "@/store";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      stock: item.stock,
    });
    removeItem(item.productId);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Save items you love by clicking the heart icon on any product. They&apos;ll appear here!
          </p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist ({items.length})</h1>
        <Button 
          variant="ghost" 
          onClick={clearWishlist} 
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <Link href={"/products/" + item.slug}>
              <div className="aspect-square bg-secondary relative overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
                    {item.name[0]}
                  </div>
                )}
                
                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.productId);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Link>

            <CardContent className="p-4">
              <Link href={"/products/" + item.slug}>
                <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                  {item.name}
                </h3>
              </Link>
              
              <p className="font-bold text-primary mt-2">{formatPrice(item.price)}</p>

              {/* Stock status */}
              {item.stock > 0 ? (
                <p className="text-xs text-green-600 mt-1">In Stock</p>
              ) : (
                <p className="text-xs text-destructive mt-1">Out of Stock</p>
              )}

              <Button 
                className="w-full mt-3" 
                size="sm"
                onClick={() => handleAddToCart(item)}
                disabled={item.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {item.stock === 0 ? "Out of Stock" : "Move to Cart"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
