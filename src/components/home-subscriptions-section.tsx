import Link from "next/link";

import { Button } from "@/components/ui/button";
import { productConfig } from "@/lib/product-config";
import { naira } from "@/lib/utils";

const [tier1, tier2] = productConfig.subscriptions.tiers;

export function HomeSubscriptionsSection() {
  return (
    <section
      id="subscriptions"
      className="bg-white py-10 sm:py-12 lg:py-14"
      aria-labelledby="home-subscriptions-heading"
    >
      <div className="container">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-white sm:rounded-[2rem] lg:rounded-[2.25rem]">
          {/* Green wash inside rounded panel — mint rises higher; only a thin band stays white at top */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.92)_0%,rgba(197,237,203,0.55)_22%,#C5EDCB_48%,#C5EDCB_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-[5%] left-[5%] h-[75%] w-[45%] rounded-full bg-mint-section/90 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-[70%] w-[55%] translate-x-[8%] rounded-full bg-leaf/30 blur-3xl"
            aria-hidden
          />

          <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <h2
              id="home-subscriptions-heading"
              className="text-center text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
            >
              Subscriptions
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-hero-tint/85 sm:text-base">
              Pre-pay ride credits for airport shuttles. Book with zero payment when you have balance
              left on your plan.
            </p>

            <div className="mx-auto mt-8 flex max-w-3xl flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-center sm:gap-5 lg:gap-6">
              <article className="flex min-h-[13.5rem] flex-col justify-between rounded-2xl bg-white p-5 text-hero-tint shadow-soft sm:min-h-[14rem] sm:max-w-[15rem] sm:flex-1 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-tint/75">
                    {tier1.label}
                  </p>
                  <p className="mt-2 text-2xl font-extrabold tabular tracking-tight sm:text-3xl">
                    {naira(tier1.priceKobo)}
                  </p>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-hero-tint/85">
                  <li>{tier1.rides} airport rides</li>
                  <li>Valid for {tier1.validityMonths} months</li>
                  <li>≈ {naira(tier1.effectivePerRideKobo)} per ride</li>
                </ul>
              </article>

              <article className="flex min-h-[16rem] flex-col justify-between rounded-2xl bg-white p-6 text-hero-tint shadow-soft sm:min-h-[18.5rem] sm:max-w-[19rem] sm:flex-[1.35] sm:p-7 lg:min-h-[19.5rem]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-tint/75">
                    {tier2.label} · Most rides
                  </p>
                  <p className="mt-2 text-3xl font-extrabold tabular tracking-tight sm:text-4xl">
                    {naira(tier2.priceKobo)}
                  </p>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-hero-tint/85 sm:text-base">
                  <li>{tier2.rides} airport rides</li>
                  <li>Valid for {tier2.validityMonths} months</li>
                  <li>≈ {naira(tier2.effectivePerRideKobo)} per ride</li>
                  <li className="font-medium text-hero-tint">Named account support on Tier 2</li>
                </ul>
              </article>
            </div>

            <div className="mt-8 flex justify-center sm:mt-10">
              <Button
                asChild
                size="lg"
                className="min-w-[min(100%,18rem)] bg-hero-tint text-white hover:bg-hero-tint/90"
              >
                <Link href="/subscriptions">View plans &amp; subscribe</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
