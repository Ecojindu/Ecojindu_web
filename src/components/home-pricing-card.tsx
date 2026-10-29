import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  "4 departures daily",
  "100% electric 14-seat shuttles",
  "QR ticket in three taps",
] as const;

export function HomePricingCard({
  fareLabel,
  className,
}: {
  fareLabel: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col bg-white p-4 text-hero-tint shadow-soft sm:p-5",
        className,
      )}
      aria-labelledby="hero-pricing-heading"
    >
      <h3
        id="hero-pricing-heading"
        className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-hero-tint/75 sm:text-xs"
      >
        Pricing per seat
      </h3>
      <p className="mt-1.5 text-2xl font-extrabold tabular tracking-tight sm:mt-2 sm:text-3xl">{fareLabel}</p>
      <p className="mt-2 text-xs leading-snug text-hero-tint/90 sm:text-sm sm:leading-relaxed">
        Fixed fare on every scheduled airport shuttle between Umuahia or Aba and Sam Mbakwe. No
        haggling at the terminal.
      </p>
      <ul className="mt-3 space-y-1.5 text-xs text-hero-tint/90 sm:text-sm">
        {FEATURES.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-hero-tint" strokeWidth={2.5} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Button asChild size="sm" className="mt-4 w-full bg-hero-tint text-white hover:bg-hero-tint/90">
        <Link href="/#upload-go">Book now</Link>
      </Button>
    </article>
  );
}
