import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "./providers";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { config } from "@/lib/config";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Ecojindu Shuttle — Umuahia & Aba to Sam Mbakwe Airport",
    template: "%s · Ecojindu Shuttle",
  },
  description:
    "Scheduled, zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe Airport, Owerri. " +
    "QR tickets. Book a seat, confirm, and pay in a few taps.",
  keywords: [
    "Umuahia airport shuttle",
    "Aba airport transfer",
    "Sam Mbakwe Airport",
    "Owerri airport bus",
    "Abia State transport",
    "electric shuttle Nigeria",
  ],
  openGraph: {
    title: "Ecojindu Shuttle — Bridging Cities, Powering Green Mobility",
    description:
      "Scheduled electric airport shuttles across Abia State. Book a seat, confirm, pay — QR ticket in a few taps.",
    url: config.siteUrl,
    siteName: "Ecojindu Shuttle",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecojindu Shuttle",
    description: "Scheduled electric airport shuttles across Abia State.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ecojindu",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2F5233" },
    { media: "(prefers-color-scheme: dark)", color: "#223D25" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={sans.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <SiteHeader />
          <main id="main" className="page-pad-bottom flex-1">
            {children}
          </main>
          <SiteFooter />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
