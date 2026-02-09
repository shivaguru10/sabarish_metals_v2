"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show header/footer on admin pages and login page
  const isAdminPage = pathname?.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  if (isAdminPage || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <div className="border-t border-border" />
      <Footer />
    </>
  );
}
