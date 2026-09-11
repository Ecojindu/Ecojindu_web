import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "./providers";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { config } from "@/lib/config";

import "./globals.css";

// `display: swap` means text paints immediately on a slow connection instead of
// waiting on the font — the single biggest LCP win on 3G.
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
    "Fixed airline-style timetable, ₦15,000 a seat, QR tickets. Book in under 90 seconds.",
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
      "Scheduled electric airport shuttles across Abia State. Fixed timetable, fixed fare, QR ticket in 90 seconds.",
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
};

export const viewport: Viewport = {
  themeColor: "#2F5233",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // never block zoom — WCAG 1.4.4
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={sans.variable}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <SiteHeader />
          {/* Bottom padding clears the mobile action bar so it never covers content. */}
          <main id="main" className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </Providers>
      </body>
    </html>
  );
}
