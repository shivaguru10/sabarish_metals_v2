"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/lib/settings-context";

export default function ContactPage() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [settings.sitePhone],
    },
    {
      icon: Mail,
      title: "Email",
      details: [settings.siteEmail],
    },
    {
      icon: MapPin,
      title: "Address",
      details: [
        `Virudhunagar: ${settings.siteAddress}`,
        "Aruppukottai: Alagunagar, Mengles Road",
      ],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday: 9:00 AM - 7:00 PM", "Sunday: Closed"],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or services? We&apos;d love to hear from you.
            Get in touch with us and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="space-y-10">
          {/* Contact Form */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for contacting us. We&apos;ll get back to you soon.
                  </p>
                  <Button onClick={() => setSuccess(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject *</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What is this about?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message *</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>

        {/* Maps */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Our Locations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">Virudhunagar Branch</h3>
                  <p className="text-sm text-muted-foreground">{settings.siteAddress}</p>
                </div>
                <div className="relative w-full aspect-[16/9]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.1676430263033!2d77.94627437324621!3d9.580813680110968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b012d5d4dae4877%3A0x67fa1e2fcaece0ca!2sSABARISH%20METALS!5e0!3m2!1sen!2sin!4v1770615450290!5m2!1sen!2sin"
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sabarish Metals - Virudhunagar"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">Aruppukottai Branch</h3>
                  <p className="text-sm text-muted-foreground">Alagunagar, Mengles Road</p>
                </div>
                <div className="aspect-[16/9] bg-secondary/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Map will be added soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
