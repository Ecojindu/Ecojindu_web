import Link from "next/link";
import { ArrowRight, Clock, Plane, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HomeHeroSection({ fareLabel }: { fareLabel: string }) {
  return (
    <section
      className="flex min-h-[calc(100svh-60px)] snap-start flex-col justify-center bg-hero-tint/90 py-10 sm:py-14 sm:min-h-[calc(100svh-68px)] lg:py-16"
      aria-label="Ride Smart. Arrive On Time. — Ecojindu airport shuttle"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left on Desktop / Top on Mobile: Headings, description, CTAs, and trust bar */}
          <div className="w-full max-w-xl text-left">
            {/* Eyebrow Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm sm:mb-6">
              <Plane className="size-3.5 text-[#8FE029]" aria-hidden />
              <span>Airport Shuttle</span>
            </div>

            {/* Headline */}
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Ride Smart. <br className="hidden sm:inline" />
              <span className="text-[#8FE029]">Arrive On Time.</span>
            </h1>

            {/* Descriptive Text */}
            <p className="mt-4 text-pretty text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe Airport.
              Upload your flight ticket or select your run—instant QR boarding pass ready to board.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-start gap-3 sm:mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white px-7 font-bold text-hero-tint shadow-soft hover:bg-white/90"
              >
                <Link href="/book">
                  Book a Seat
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/35 bg-white/10 px-6 font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href="/subscriptions">
                  View Tiers
                  <ArrowRight className="size-4 ml-1.5" aria-hidden />
                </Link>
              </Button>
            </div>

            {/* Social Proof / Trust Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-xs font-medium text-white/90 sm:gap-x-4 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-[#8FE029]" aria-hidden />
                <span>4 departures daily</span>
              </span>
              <span className="hidden h-3.5 w-px bg-white/30 sm:inline-block" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <QrCode className="size-4 text-[#8FE029]" aria-hidden />
                <span>QR ticket in three taps</span>
              </span>
            </div>
          </div>

          {/* Right on Desktop / Bottom on Mobile: The photo container with floating pricing badge */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl ring-1 ring-white/10">
              {/* Airport Tarmac & Shuttle Image */}
              <img
                src="/images/hero-shuttle-card.png"
                alt="eShuttle airport transfer at tarmac with aircraft"
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />

              {/* Floating Pricing Badge on Top-Right */}
              <div className="absolute right-4 top-4 rounded-2xl bg-white px-4 py-2.5 shadow-xl sm:right-6 sm:top-6 sm:px-5 sm:py-3">
                <span className="block text-[0.6875rem] font-bold uppercase tracking-wider text-hero-tint/60">
                  From
                </span>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold tracking-tight text-hero-tint sm:text-2xl">
                    {fareLabel}
                  </span>
                  <span className="text-xs font-semibold text-hero-tint/60">
                    /seat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Keep aliases for backwards compatibility
export const HomeHeroMobile = HomeHeroSection;
export const HomeHeroDesktop = HomeHeroSection;
