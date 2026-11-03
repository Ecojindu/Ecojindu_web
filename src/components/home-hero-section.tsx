import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HomePricingCard } from "@/components/home-pricing-card";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/images/hero-airport-shuttle.png";
const HERO_ALT =
  "Passenger aircraft and Ecojindu shuttle at Sam Mbakwe Airport — Umuahia and Aba airport transfers";

function HeroCopy({ centered }: { centered?: boolean }) {
  return (
    <div className={centered ? "mx-auto max-w-md text-center" : "max-w-xl"}>
      <h1 className="text-balance text-display-sm font-extrabold tracking-tight text-white sm:text-display-md">
        Plan.Book.Travel
      </h1>
      <p className="mt-3 text-pretty text-base leading-snug text-white/95 sm:leading-relaxed">
        Zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe Airport.
        Upload your flight ticket or select your run—instant QR boarding pass ready to board.
      </p>
      <div
        className={cn(
          "mt-6 flex flex-wrap items-center gap-3",
          centered ? "justify-center" : "justify-start",
        )}
      >
        <Button
          asChild
          size="lg"
          className="bg-white px-6 font-bold text-hero-tint shadow-soft hover:bg-white/90"
        >
          <Link href="/book">
            <Ticket className="size-4" aria-hidden />
            Book a Seat
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/35 bg-white/10 px-5 font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
        >
          <Link href="/subscriptions">
            View Tiers
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** Phone + tablet (< xl): copy on top, compact pricing card below. */
export function HomeHeroMobile({ fareLabel }: { fareLabel: string }) {
  return (
    <section
      className="flex min-h-[calc(100svh-60px)] snap-start flex-col bg-hero-tint sm:min-h-[calc(100svh-68px)] xl:hidden"
      aria-label="Plan, book, and travel — Ecojindu airport shuttle"
    >
      <div className="flex flex-1 flex-col justify-center px-5 py-8">
        <HeroCopy centered />
      </div>

      <div className="px-4 pb-5 pt-1">
        <HomePricingCard
          fareLabel={fareLabel}
          className="rounded-[1.75rem] ring-1 ring-white/10"
        />
      </div>
    </section>
  );
}

/** Full-viewport hero for xl+ desktop. */
export function HomeHeroDesktop() {
  return (
    <section
      className="relative hidden h-[calc(100svh-60px)] snap-start overflow-hidden xl:block xl:h-[calc(100svh-68px)]"
      aria-label="Plan, book, and travel — Ecojindu airport shuttle"
    >
      <Image
        src={HERO_IMAGE}
        alt={HERO_ALT}
        fill
        priority
        className="z-0 object-cover object-[center_28%]"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-hero-tint/30"
        aria-hidden
      />
      <div className="container relative z-[2] flex h-full flex-col justify-center py-10 sm:py-12">
        <div className="max-w-xl translate-y-20 xl:translate-y-24 2xl:translate-y-28">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}

export function HomeHeroSection({ fareLabel }: { fareLabel: string }) {
  return (
    <>
      <HomeHeroMobile fareLabel={fareLabel} />
      <HomeHeroDesktop />
    </>
  );
}
