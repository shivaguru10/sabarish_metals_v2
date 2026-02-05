"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SettingsProvider } from "@/lib/settings-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </SessionProvider>
  );
}
