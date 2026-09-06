import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = { title: "Reji", description: "ระบบขายหน้าร้านสำหรับร้านเบเกอรี่" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body><Providers>{children}</Providers></body></html>;
}
