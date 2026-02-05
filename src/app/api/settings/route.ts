import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Fetch public settings (no auth required)
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert array to object
    const settingsObj: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    // Return with defaults for missing settings
    const publicSettings = {
      siteName: settingsObj.siteName || "Sabarish Metals",
      siteDescription: settingsObj.siteDescription || "Premium Quality Metals & Alloys",
      siteEmail: settingsObj.siteEmail || "contact@sabarishmetals.com",
      sitePhone: settingsObj.sitePhone || "+91 9876543210",
      siteAddress: settingsObj.siteAddress || "Chennai, Tamil Nadu, India",
      currency: settingsObj.currency || "INR",
      currencySymbol: settingsObj.currencySymbol || "₹",
      taxRate: settingsObj.taxRate || "18",
      shippingFee: settingsObj.shippingFee || "100",
      freeShippingThreshold: settingsObj.freeShippingThreshold || "5000",
      facebook: settingsObj.facebook || "",
      instagram: settingsObj.instagram || "",
      twitter: settingsObj.twitter || "",
      whatsapp: settingsObj.whatsapp || "",
      razorpayEnabled: settingsObj.razorpayEnabled || "true",
      codEnabled: settingsObj.codEnabled || "true",
    };

    return NextResponse.json({ data: publicSettings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
