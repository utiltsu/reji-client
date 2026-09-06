import type { Metadata } from "next";
import { clientEnv } from "@/lib/env";
import { Providers } from "./providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: clientEnv.NEXT_PUBLIC_APP_NAME,
  description: `Point-of-sale system for a small bakery — ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}
