"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  images: string[];
  price: number;
  comparePrice: number | null;
  stock: number;
  specifications: Record<string, string> | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    user: {
      name: string | null;
    };
    createdAt: string;
  }>;
  _count: {
    reviews: number;
  };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("/api/products/" + slug);
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
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

  const handleWishlistToggle = () => {
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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={"/products?category=" + product.category.slug} className="hover:text-primary">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
            {allImages[selectedImage] ? (
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-muted-foreground/30">
                {product.name?.[0] || "P"}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-primary" : "border-transparent"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <Link
              href={"/products?category=" + product.category.slug}
              className="text-sm text-primary hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          {(product._count?.reviews || 0) > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= avgRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                      }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                ({product._count?.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-600">
                  In Stock {product.stock <= 10 && `(Only ${product.stock} left)`}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-red-600">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>

            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders above ₹5000</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">100% secure transactions</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-muted-foreground">7-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b">
          {[
            { id: "description", label: "Description" },
            { id: "specifications", label: "Specifications" },
            { id: "reviews", label: `Reviews (${product._count?.reviews || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-muted-foreground">No description available for this product.</p>
              )}
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-3 font-medium w-1/3">{key}</td>
                        <td className="py-3 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted-foreground">No specifications available for this product.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                            {review.user.name?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-medium">{review.user.name || "Anonymous"}</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
