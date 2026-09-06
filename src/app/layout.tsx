import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = { title: "Reji", description: "Point-of-sale system for a small bakery" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th" className={cn("font-sans", inter.variable)}><body><Providers>{children}</Providers></body></html>;
}
