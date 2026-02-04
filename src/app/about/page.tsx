import Link from "next/link";
import { Award, Users, Target, Truck, Shield, Clock, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About Us - Sabarish Metals",
  description: "Learn about Sabarish Metals - Your trusted partner for premium metal products since 1995.",
};

export default function AboutPage() {
  const stats = [
    { value: "28+", label: "Years Experience" },
    { value: "50K+", label: "Happy Customers" },
    { value: "1000+", label: "Products" },
    { value: "100+", label: "Cities Served" },
  ];

  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We source only the finest metals from certified manufacturers, ensuring every product meets the highest standards.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. We're committed to exceeding expectations at every step.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously evolve our product range and services to meet the changing needs of modern industries.",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery across India",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All products certified and tested",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round the clock customer assistance",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 via-background to-amber-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building Trust Through{" "}
              <span className="text-primary">Quality Metals</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Since 1995, Sabarish Metals has been India&apos;s trusted destination for premium 
              metal products. From industrial supplies to decorative pieces, we deliver 
              excellence in every product.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">Explore Products</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Sabarish Metals was founded in 1995 with a simple mission: to provide 
                  the highest quality metal products at fair prices. What started as a 
                  small family business in Chennai has grown into one of South India&apos;s 
                  most trusted metal suppliers.
                </p>
                <p>
                  Over the years, we&apos;ve built strong relationships with manufacturers 
                  across India and internationally, allowing us to offer an extensive 
                  range of products including copper, brass, bronze, stainless steel, 
                  and aluminum items.
                </p>
                <p>
                  Today, we serve thousands of customers – from individual craftsmen to 
                  large industrial clients. Our commitment to quality, fair pricing, and 
                  excellent customer service remains unchanged.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-amber-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-8xl">🏭</span>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl">
                <p className="text-3xl font-bold">28+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at Sabarish Metals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Sabarish Metals?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re more than just a metal supplier - we&apos;re your partners in success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-primary-foreground/80 mb-8">
              Have questions? Want to discuss a bulk order? Our team is here to help.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 mb-3" />
                <p className="font-medium">Call Us</p>
                <p className="text-primary-foreground/80">+91 98765 43210</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 mb-3" />
                <p className="font-medium">Email Us</p>
                <p className="text-primary-foreground/80">info@sabarishmetals.com</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-3" />
                <p className="font-medium">Visit Us</p>
                <p className="text-primary-foreground/80">Chennai, Tamil Nadu</p>
              </div>
            </div>

            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
