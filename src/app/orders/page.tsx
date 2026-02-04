"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  ChevronRight, 
  Clock, 
  Truck, 
  CheckCircle,
  XCircle,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      image: string;
    };
  }>;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-yellow-500" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "text-blue-500" },
  PROCESSING: { label: "Processing", icon: Package, color: "text-purple-500" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "text-orange-500" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-green-500" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-500" },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/orders");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Package className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                      <StatusIcon className="h-5 w-5" />
                      <span className="font-medium">{statusInfo.label}</span>
                    </div>
                    <Link href={"/orders/" + order.id}>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Link href={"/products/" + item.product.slug}>
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center text-xl font-bold text-muted-foreground/30">
                            {item.product.name[0]}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <Link 
                          href={"/products/" + item.product.slug}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                  </p>
                  <p className="text-lg font-bold">
                    Total: <span className="text-primary">{formatPrice(order.total)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
