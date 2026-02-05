"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  currency: string;
  currencySymbol: string;
  taxRate: string;
  shippingFee: string;
  freeShippingThreshold: string;
  facebook: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
  razorpayEnabled: string;
  codEnabled: string;
}

const defaultSettings: SiteSettings = {
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

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  formatPrice: (amount: number) => string;
  getShippingFee: (subtotal: number) => number;
  getTaxAmount: (amount: number) => number;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  formatPrice: (amount) => `₹${amount.toLocaleString("en-IN")}`,
  getShippingFee: () => 100,
  getTaxAmount: (amount) => amount * 0.18,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getShippingFee = (subtotal: number) => {
    const threshold = parseFloat(settings.freeShippingThreshold) || 5000;
    const fee = parseFloat(settings.shippingFee) || 100;
    return subtotal >= threshold ? 0 : fee;
  };

  const getTaxAmount = (amount: number) => {
    const taxRate = parseFloat(settings.taxRate) || 18;
    return (amount * taxRate) / 100;
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, formatPrice, getShippingFee, getTaxAmount }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
