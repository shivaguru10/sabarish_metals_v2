"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard,
  Truck,
  Percent,
  Loader2,
  CheckCircle,
  ChevronDown
} from "lucide-react";

interface Settings {
  // General
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  
  // Store
  currency: string;
  currencySymbol: string;
  taxRate: string;
  shippingFee: string;
  freeShippingThreshold: string;
  
  // Social
  facebook: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
  
  // Payment
  razorpayEnabled: string;
  codEnabled: string;
}

const defaultSettings: Settings = {
  siteName: "Sabarish Metals",
  siteDescription: "Premium Quality Metals & Alloys",
  siteEmail: "contact@sabarishmetals.com",
  sitePhone: "+91 9876543210",
  siteAddress: "Chennai, Tamil Nadu, India",
  currency: "INR",
  currencySymbol: "₹",
  taxRate: "18",
  shippingFee: "100",
  freeShippingThreshold: "5000",
  facebook: "",
  instagram: "",
  twitter: "",
  whatsapp: "",
  razorpayEnabled: "true",
  codEnabled: "true",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    store: false,
    social: false,
    payment: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setSettings({ ...defaultSettings, ...data.data });
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {/* General Settings */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("general")}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openSections.general ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
          {openSections.general && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    placeholder="Your store name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Description</label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => handleChange("siteDescription", e.target.value)}
                    placeholder="Short description"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => handleChange("siteEmail", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone
                  </label>
                  <Input
                    value={settings.sitePhone}
                    onChange={(e) => handleChange("sitePhone", e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <Input
                  value={settings.siteAddress}
                  onChange={(e) => handleChange("siteAddress", e.target.value)}
                  placeholder="Your store address"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Store Settings */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("store")}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Store Settings
                </CardTitle>
                <CardDescription>
                  Currency, tax, and shipping configuration
                </CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openSections.store ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
          {openSections.store && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency Symbol</label>
                  <Input
                    value={settings.currencySymbol}
                    onChange={(e) => handleChange("currencySymbol", e.target.value)}
                    placeholder="₹"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Percent className="h-4 w-4 inline mr-1" />
                    Tax Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleChange("taxRate", e.target.value)}
                    placeholder="18"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Truck className="h-4 w-4 inline mr-1" />
                    Shipping Fee ({settings.currencySymbol})
                  </label>
                  <Input
                    type="number"
                    value={settings.shippingFee}
                    onChange={(e) => handleChange("shippingFee", e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Free Shipping Above ({settings.currencySymbol})
                  </label>
                  <Input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
                    placeholder="5000"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("social")}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media
                </CardTitle>
                <CardDescription>
                  Connect your social media accounts
                </CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openSections.social ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
          {openSections.social && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Facebook</label>
                  <Input
                    value={settings.facebook}
                    onChange={(e) => handleChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram</label>
                  <Input
                    value={settings.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter / X</label>
                  <Input
                    value={settings.twitter}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp</label>
                  <Input
                    value={settings.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("payment")}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Enable or disable payment options
                </CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openSections.payment ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
          {openSections.payment && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Razorpay</h4>
                  <p className="text-sm text-gray-500">Accept online payments via Razorpay</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.razorpayEnabled === "true"}
                    onChange={(e) => handleChange("razorpayEnabled", e.target.checked ? "true" : "false")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Cash on Delivery (COD)</h4>
                  <p className="text-sm text-gray-500">Allow customers to pay on delivery</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.codEnabled === "true"}
                    onChange={(e) => handleChange("codEnabled", e.target.checked ? "true" : "false")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
