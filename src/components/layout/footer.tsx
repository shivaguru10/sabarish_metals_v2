"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer id="site-footer" className="bg-gradient-to-b from-[#0b0c0f] via-[#12141a] to-[#0b0c0f] text-white mt-auto">
      <div className="container py-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-12 md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_40%)]" />
          <div className="relative grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt={settings.siteName}
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <p className="text-lg font-semibold tracking-tight">{settings.siteName}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Premium Metals</p>
                </div>
              </div>
              <p className="text-sm text-white/70 max-w-md">
                {settings.siteDescription}. Serving industries across India with excellence.
              </p>
              <div className="flex items-center gap-4 text-white/70">
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings.twitter && (
                  <a
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Branches</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 text-white/80">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Virudhunagar</p>
                      <p className="text-white/60">Tamil Nadu, India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-white/60">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Aruppukottai</p>
                      <p className="text-white/50">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Contact</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3 text-white/80">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href={`tel:${settings.sitePhone}`} className="hover:text-white transition-colors">
                      {settings.sitePhone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${settings.siteEmail}`} className="hover:text-white transition-colors">
                      {settings.siteEmail}
                    </a>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
                  <Link href="/products" className="hover:text-white transition-colors">
                    Products
                  </Link>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
