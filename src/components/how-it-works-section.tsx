import Link from "next/link";

import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    title: "Upload your ticket",
    body: "Photo, PDF, or booking code — we read your flight time.",
  },
  {
    step: "02",
    title: "We pick your shuttle",
    body: "Matched to a scheduled run from Umuahia or Aba.",
  },
  {
    step: "03",
    title: "Confirm details",
    body: "Seats, pickup, and phone on one screen.",
  },
  {
    step: "04",
    title: "Pay & get QR",
    body: "Card, transfer, or USSD — board with your pass.",
  },
] as const;

interface HowItWorksSectionProps {
  fareLabel: string;
}

export function HowItWorksSection({ fareLabel }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      className="snap-start bg-mint-section py-10 sm:py-12 lg:py-14"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container">
        <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-center lg:gap-5 xl:max-w-[60rem] xl:gap-6">
          {/* How it works — 2×2 card grid beside pricing */}
          <div className="min-w-0 w-full lg:w-[min(100%,36rem)] lg:shrink-0">
            <h2
              id="how-it-works-heading"
              className="text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
            >
              How it works
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:mt-6 lg:gap-3">
              {STEPS.map((item) => (
                <li
                  key={item.step}
                  className="flex min-h-[9.5rem] flex-col justify-between rounded-xl bg-white p-3.5 text-hero-tint shadow-soft sm:min-h-[10.5rem] sm:rounded-2xl sm:p-4 lg:min-h-[11rem] lg:p-5"
                >
                  <span className="text-[0.6875rem] font-semibold tabular tracking-widest text-hero-tint/70 sm:text-xs">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold leading-snug sm:text-base">{item.title}</h3>
                    <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-hero-tint/85 sm:text-xs">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing — height aligned with the 2×2 grid */}
          <div className="flex min-w-0 w-full flex-col lg:w-[min(100%,20rem)] lg:shrink-0 xl:w-[min(100%,22rem)]">
            <h2
              id="pricing-heading"
              className="text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
            >
              Pricing
            </h2>
            <article
              className="mt-5 flex min-h-[9.5rem] flex-1 flex-col justify-between rounded-xl bg-white p-5 text-hero-tint shadow-soft sm:min-h-[10rem] sm:rounded-2xl sm:p-6 lg:mt-6 lg:min-h-0 lg:flex-1"
              aria-labelledby="pricing-heading"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-tint/75">
                  Single seat
                </p>
                <p className="mt-2 text-3xl font-extrabold tabular tracking-tight sm:text-4xl">
                  {fareLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-hero-tint/90">
                  Fixed fare on every scheduled airport shuttle between Umuahia or Aba and Sam
                  Mbakwe. No haggling at the terminal.
                </p>
              </div>
              <ul className="mt-4 space-y-1 text-xs text-hero-tint/85 sm:text-sm">
                <li>· 4 departures daily</li>
                <li>· 100% electric 14-seat shuttles</li>
                <li>· QR ticket in three taps</li>
              </ul>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="mt-5 w-full border-0 bg-mint-section text-hero-tint hover:bg-mint-section/80"
              >
                <Link href="/subscriptions">View subscription plans</Link>
              </Button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
