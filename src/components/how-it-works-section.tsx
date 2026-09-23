import Link from "next/link";

import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    title: "Upload your ticket",
    body: "Snap a photo, upload a PDF, or paste your booking code. We pull your flight time and route so you are not retyping details.",
  },
  {
    step: "02",
    title: "We pick your shuttle",
    body: "We match you to the next scheduled electric run from Umuahia or Aba — the right direction for your flight, with live seat counts.",
  },
  {
    step: "03",
    title: "Confirm details",
    body: "Review passengers, pickup city, travel date, and your mobile number on one screen. Adjust anything before you continue to payment.",
  },
  {
    step: "04",
    title: "Pay & get QR",
    body: "Pay with card, bank transfer, or USSD. Your QR boarding pass is ready right away — show it when you board the shuttle.",
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
      <div className="container px-4 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto w-full max-w-[62rem] xl:max-w-[66rem]">
          <h2
            id="how-it-works-heading"
            className="text-center text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
          >
            How it works
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-10 lg:mt-6 lg:grid-cols-[minmax(0,36rem)_minmax(0,20rem)] lg:items-start lg:justify-between lg:gap-x-10 xl:grid-cols-[minmax(0,36rem)_minmax(0,22rem)] xl:gap-x-12">
            <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-3">
              {STEPS.map((item) => (
                <li
                  key={item.step}
                  className="flex min-h-[10.5rem] flex-col rounded-xl bg-white p-3.5 text-hero-tint shadow-soft sm:min-h-[11.5rem] sm:rounded-2xl sm:p-4 lg:min-h-[12rem] lg:p-5"
                >
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center self-start rounded-full bg-mint-section text-[0.6875rem] font-bold tabular tracking-wide text-hero-tint sm:size-10 sm:text-xs"
                    aria-hidden
                  >
                    {item.step}
                  </span>
                  <div className="mt-3 flex flex-1 flex-col items-center text-center sm:mt-3.5">
                    <h3 className="text-sm font-bold leading-snug sm:text-base">{item.title}</h3>
                    <p className="mt-2 text-[0.6875rem] leading-relaxed text-hero-tint/85 sm:text-xs sm:leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <article
              className="flex min-h-[9.5rem] flex-col justify-between rounded-xl bg-white p-5 text-hero-tint shadow-soft sm:min-h-[10rem] sm:rounded-2xl sm:p-6 lg:min-h-0 lg:self-stretch"
              aria-labelledby="pricing-heading"
            >
              <div>
                <h3
                  id="pricing-heading"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-tint/75"
                >
                  Pricing per seat
                </h3>
                <p className="mt-2 text-3xl font-extrabold tabular tracking-tight sm:text-4xl">
                  {fareLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-hero-tint/90">
                  Fixed fare on every scheduled airport shuttle between Umuahia or Aba and Sam Mbakwe.
                  No haggling at the terminal.
                </p>
              </div>
              <ul className="mt-4 space-y-1 text-xs text-hero-tint/85 sm:text-sm">
                <li>· 4 departures daily</li>
                <li>· 100% electric 14-seat shuttles</li>
                <li>· QR ticket in three taps</li>
              </ul>
              <Button
                asChild
                size="sm"
                className="mt-5 w-full bg-hero-tint text-white hover:bg-hero-tint/90"
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
