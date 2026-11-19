"use client";

import Link from "next/link";
import { ArrowRight, Clock, QrCode } from "lucide-react";

import { TypewriterText } from "@/components/typewriter-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHeroSection({ fareLabel }: { fareLabel: string }) {
  return (
    <section
      className="flex min-h-[calc(100svh-60px)] snap-start flex-col justify-center bg-hero-tint/90 py-10 sm:py-14 sm:min-h-[calc(100svh-68px)] lg:py-16"
      aria-label="Ride Smart. Arrive On Time. — Ecojindu airport shuttle"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left on Desktop / Top on Mobile: Headings, description, CTAs, and trust bar */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            {/* Headline */}
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Ride Smart. <br className="hidden sm:inline" />
              <TypewriterText text="Arrive On Time." />
            </h1>

            {/* Descriptive Text */}
            <p className="mt-4 text-pretty text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe Airport.
              Upload your flight ticket or select your run—instant QR boarding pass ready to board.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 lg:justify-start">
              <Link
                href="/book"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-white px-7 font-bold text-hero-tint shadow-soft hover:bg-white/90",
                )}
              >
                Book a Seat
              </Link>
              <Link
                href="/subscriptions"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full border-white/35 bg-white/10 px-6 font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
                )}
              >
                View Tiers
                <ArrowRight className="size-4 ml-1.5" aria-hidden />
              </Link>
            </div>

            {/* Social Proof / Trust Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-white/90 sm:gap-x-4 sm:text-sm lg:justify-start">
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
                alt="Ecojindu electric shuttle on airport runway"
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="eager"
              />

              {/* Floating Price Pill (Pinned to top-right) */}
              <div className="absolute right-4 top-4 rounded-2xl border border-white/40 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md sm:right-6 sm:top-6 sm:px-5 sm:py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-hero-tint/70 sm:text-xs">
                  FROM
                </p>
                <p className="text-lg font-black tracking-tight text-hero-tint sm:text-2xl">
                  {fareLabel}
                  <span className="text-xs font-semibold text-hero-tint/60 sm:text-sm">/seat</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
