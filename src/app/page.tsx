import Link from "next/link";
import { ArrowRight, Shield, Truck, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All our products meet strict quality standards with proper certifications.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery across India with real-time tracking.",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive wholesale and retail prices with bulk order discounts.",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Our expert team is always ready to assist you with your requirements.",
    },
  ];

  const categories = [
    { name: "Brass", description: "Premium brass sheets, rods, and components", image: "/brass.jpg" },
    { name: "Copper", description: "High-quality copper products for all industries", image: "/copper.jpg" },
    { name: "Aluminum", description: "Lightweight aluminum solutions", image: "/aluminum.jpg" },
    { name: "Stainless Steel", description: "Durable stainless steel materials", image: "/steel.jpg" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Premium Quality{" "}
              <span className="text-primary">Metals & Alloys</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Your trusted partner for high-grade brass, copper, aluminum, and stainless steel. 
              Serving industries across India with excellence and reliability.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Browse Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are committed to providing the best quality metals with exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of metal products for every industrial need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${category.name.toLowerCase()}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
                        {category.name[0]}
                      </span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Contact us today for a free quote on your metal requirements. 
            We offer competitive prices and fast delivery across India.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="gap-2">
                Contact Us <Phone className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
