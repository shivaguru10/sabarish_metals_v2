"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Heart, 
  User, 
  Search,
  Package,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, useWishlistStore } from "@/store";
import { useSettings } from "@/lib/settings-context";

export function Header() {
  const { data: session, status } = useSession();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const cartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.getTotalItems());

  // Prevent hydration mismatch by only showing counts after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt={settings.siteName} 
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {mounted && wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Admin Dashboard - Only for admins */}
          {mounted && status === "authenticated" && session?.user?.role === "ADMIN" && (
            <Link href="/admin" title="Admin Dashboard">
              <Button variant="ghost" size="icon" className="text-primary">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* User Menu */}
          {mounted && (
            <div className="relative" ref={userMenuRef}>
              {status === "authenticated" && session?.user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {session.user.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || "User"} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(session.user.name)
                      )}
                    </div>
                    {/* Name - hidden on mobile */}
                    <span className="hidden sm:block text-sm font-medium max-w-25 truncate">
                      {session.user.name?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className={`hidden sm:block h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl py-2 z-100" style={{ backgroundColor: 'white' }}>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: 'white' }}>
                        <p className="font-medium truncate">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{session.user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                        >
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                        >
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span>Wishlist</span>
                          {wishlistItems > 0 && (
                            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                              {wishlistItems}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                        >
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          <span>My Profile</span>
                        </Link>
                        
                        {/* Admin Link - Only for admins */}
                        {session.user.role === "ADMIN" && (
                          <>
                            <div className="border-t my-2" />
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors w-full text-left text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Menu */}
            {mounted && status === "authenticated" && session?.user && (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {getInitials(session.user.name)}
                    </div>
                    <div>
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-sm text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircle className="h-4 w-4" />
                  My Profile
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-destructive hover:text-destructive/80 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
