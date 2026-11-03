import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";

import { BookAuthBanner } from "@/components/book-auth-banner";
import { BookHome } from "@/components/upload-go-home";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Book a Seat — Ecojindu Airport Shuttle",
  description:
    "Book your scheduled 100% electric shuttle between Umuahia, Aba and Sam Mbakwe Airport. Upload your flight ticket or select your departure.",
  openGraph: {
    title: "Book a Seat — Ecojindu Airport Shuttle",
    description:
      "Direct scheduled zero-emission EV airport transfers across Abia State. Instant QR pass to board.",
    url: `${config.siteUrl}/book`,
  },
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-6 pb-16 sm:pt-10 sm:pb-20 dark:bg-[var(--page-bg)]">
      <div className="container max-w-4xl px-4 sm:px-6">
        {/* Back navigation */}
        <div className="mb-6 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-hero-tint/80 transition-colors hover:text-hero-tint dark:text-white/70 dark:hover:text-white sm:text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Home
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-mint-section px-3.5 py-1 text-xs font-bold text-hero-tint">
            <Zap className="size-3.5 fill-current" aria-hidden />
            <span>100% Electric Airport Transfers</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-hero-tint sm:text-3xl lg:text-4xl dark:text-white">
            Book Your Airport Shuttle
          </h1>
          <p className="mt-2 text-sm text-hero-tint/85 sm:text-base dark:text-white/80">
            Scheduled EV rides between Umuahia, Aba, and Sam Mbakwe Airport (Owerri). Upload your
            flight ticket for automated matching or pick your route and departure below.
          </p>
        </div>

        {/* Auth prompt banner */}
        <BookAuthBanner />

        {/* The core booking engine */}
        <div className="rounded-2xl border border-cream-300/80 bg-white p-5 shadow-soft sm:p-7 lg:p-8 dark:border-white/10 dark:bg-[var(--card-bg)]">
          <BookHome />
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-hero-tint/75 sm:text-sm dark:text-white/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-leaf" aria-hidden />
            Guaranteed flight departure timing
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-leaf" aria-hidden />
            Instant QR boarding pass
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-leaf" aria-hidden />
            Secure payment via Paystack
          </span>
        </div>
      </div>
    </div>
  );
}
