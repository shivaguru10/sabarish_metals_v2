"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    type: "home",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user?.name) {
      setAddress(prev => ({ ...prev, name: session.user.name || "" }));
    }
  }, [session]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout");
    }
  }, [status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: address,
          subtotal,
          shipping,
          tax,
          total,
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderRes.json();

      // Initialize Razorpay payment (placeholder - needs actual integration)
      // For now, simulate successful payment
      alert("Payment integration coming soon! Order created successfully.");
      clearCart();
      router.push("/orders/" + order.id);

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart" className="hover:text-primary">Cart</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Checkout</span>
      </nav>

      <div className="flex flex-col md:flex-row items-center justify-start gap-20 mb-12">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center">
          {/* Step 1: Address */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 shadow-sm ${step >= 1 ? "bg-primary text-primary-foreground scale-100" : "bg-secondary text-muted-foreground"
              }`}>
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className={`text-sm sm:text-base font-bold ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
              Address
            </span>
          </div>

          {/* Connector Line */}
          <div className="flex items-center px-4">
            <div className={`h-[2px] w-12 sm:w-16 transition-colors duration-300 ${step > 1 ? "bg-primary" : "bg-gray-300"}`}></div>
            <ChevronRight className={`h-4 w-4 -ml-1 ${step > 1 ? "text-primary" : "text-gray-300"}`} />
          </div>

          {/* Step 2: Payment */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 shadow-sm ${step >= 2 ? "bg-primary text-primary-foreground scale-100" : "bg-secondary text-muted-foreground scale-95"
              }`}>
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className={`text-sm sm:text-base font-bold ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
              Payment
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        placeholder="Enter full name"
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) {
                            setAddress({ ...address, phone: value });
                          }
                        }}
                        placeholder="Enter 10-digit mobile number"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      {address.phone.length > 0 && address.phone.length < 10 && (
                        <p className="text-xs text-destructive mt-1">Must be 10 digits</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Street Address</label>
                    <Input
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Enter street address, house no, building"
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pincode</label>
                      <div className="relative">
                        <Input
                          value={address.pincode}
                          onChange={async (e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 6) {
                              setAddress(prev => ({ ...prev, pincode: value }));

                              // Auto-fetch city/state when 6 digits entered
                              if (value.length === 6) {
                                try {
                                  // Simple visual feedback before fetch
                                  const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                                  const data = await res.json();

                                  if (data?.[0]?.Status === "Success" && data?.[0]?.PostOffice?.length > 0) {
                                    const postOffice = data[0].PostOffice[0];
                                    setAddress(prev => ({
                                      ...prev,
                                      pincode: value,
                                      city: postOffice.District,
                                      state: postOffice.State
                                    }));
                                  }
                                } catch (error) {
                                  console.error("Failed to fetch pincode details", error);
                                }
                              }
                            }
                          }}
                          placeholder="Enter 6-digit pincode"
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          className="transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                        />
                        {address.pincode.length === 6 && !address.city && (
                          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">City / District</label>
                      <Input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Enter city"
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/20 bg-muted/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">State</label>
                      <Input
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        placeholder="Enter state"
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/20 bg-muted/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Address Type</label>
                    <div className="flex flex-wrap gap-4">
                      {["home", "work", "other"].map((type) => (
                        <div
                          key={type}
                          onClick={() => setAddress({ ...address, type: type })}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 group ${address.type === type
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-input hover:border-primary/50 hover:bg-muted/50"
                            }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${address.type === type
                            ? "border-primary bg-primary"
                            : "border-muted-foreground group-hover:border-primary"
                            }`}>
                            {address.type === type && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="capitalize text-sm font-medium hover:text-primary transition-colors">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                    size="lg"
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Payment</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="cursor-pointer group hover:bg-transparent hover:text-primary transition-colors pl-0"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Address
                  </Button>
                </div>

                {/* Shipping Address Summary */}
                <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Delivering to:</h3>
                  <p className="text-sm">
                    {address.name} | {address.phone}<br />
                    {address.street}<br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="font-medium">Pay Online (Razorpay)</p>
                      <p className="text-sm text-muted-foreground">
                        Credit Card, Debit Card, UPI, Net Banking
                      </p>
                    </div>
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </label>

                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </p>
                    </div>
                    <Truck className="h-6 w-6 text-muted-foreground" />
                  </label>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order Now
                      <span className="ml-1 opacity-90">({formatPrice(total)})</span>
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Secure payment powered by Razorpay
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center text-lg font-bold text-muted-foreground/30">
                        {item.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
