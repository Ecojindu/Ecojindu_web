import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Zap,
} from "lucide-react";

import { HomeFaqSection } from "@/components/home-faq-section";
import { HomeHeroSection } from "@/components/home-hero-section";
import { HomeSubscriptionsSection } from "@/components/home-subscriptions-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { productConfig } from "@/lib/product-config";
import { getRoutes } from "@/lib/server-api";
import { naira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ecojindu Shuttle — 100% Electric Airport Transfers across Abia State",
  description:
    "Scheduled zero-emission EV shuttles between Umuahia, Aba and Sam Mbakwe Airport (Owerri). Fixed fares, subscription tiers, private charter, and instant QR boarding pass.",
  openGraph: {
    title: "Ecojindu Shuttle — Zero-Emission Airport Travel",
    description:
      "Electric airport shuttles across Abia State. Book your seat, explore frequent flyer subscription tiers, or charter an EV.",
    url: config.siteUrl,
  },
};

export default async function HomePage() {
  const routes = await getRoutes();
  const airportRoutes = (routes ?? []).filter((r) => r.service_type === "airport" && r.is_active);
  const sampleFare =
    airportRoutes.find((r) => r.base_fare_kobo > 0)?.base_fare_kobo ?? productConfig.singleFareKobo;

  return (
    <div className="snap-y snap-proximity">
      {/* 1. Hero Section with Call to Actions */}
      <HomeHeroSection fareLabel={naira(sampleFare)} />

      {/* 2. Core Services Grid */}
      <section
        id="services"
        className="border-b border-cream-300/80 bg-cream-50 py-12 sm:py-16 lg:py-20 dark:border-white/10 dark:bg-[var(--page-bg)]"
        aria-labelledby="services-heading"
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-section px-3.5 py-1 text-xs font-bold text-hero-tint">
              <Sparkles className="size-3.5" aria-hidden />
              Our Mobility Services
            </span>
            <h2
              id="services-heading"
              className="mt-3 text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md dark:text-white"
            >
              Tailored Travel for Every Passenger
            </h2>
            <p className="mt-2 text-sm text-hero-tint/80 sm:text-base dark:text-white/75">
              Whether you are flying solo, traveling weekly on business, or booking a private team
              delegation, Ecojindu delivers prompt, comfortable, zero-emission travel.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* Service 1: Scheduled Shuttle */}
            <article className="flex flex-col justify-between rounded-2xl border border-cream-300/80 bg-white p-6 shadow-soft transition-all hover:shadow-md sm:p-7 dark:border-white/10 dark:bg-[var(--card-bg)]">
              <div>
                <span className="grid size-12 place-items-center rounded-xl bg-hero-tint/90 text-white dark:bg-leaf dark:text-hero-tint">
                  <Ticket className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-hero-tint sm:text-xl dark:text-white">
                  Scheduled Airport Shuttle
                </h3>
                <p className="mt-2 text-sm text-hero-tint/80 leading-relaxed dark:text-white/75">
                  4 guaranteed departures daily each way between Umuahia, Aba, and Sam Mbakwe Airport.
                  Upload your flight ticket for instant matching or pick your departure time.
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-hero-tint/85 sm:text-sm dark:text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Fixed fares from {naira(sampleFare)}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Guaranteed airport arrival window
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Instant QR boarding pass
                  </li>
                </ul>
              </div>
              <Button asChild size="sm" className="mt-6 w-full bg-hero-tint/90 font-bold text-white hover:bg-hero-tint/80 dark:bg-leaf dark:text-hero-tint">
                <Link href="/book">
                  Book a Shuttle
                  <ArrowRight className="size-4 ml-1.5" aria-hidden />
                </Link>
              </Button>
            </article>

            {/* Service 2: Subscription Tiers */}
            <article className="flex flex-col justify-between rounded-2xl border-2 border-leaf/40 bg-white p-6 shadow-soft transition-all hover:shadow-md sm:p-7 dark:border-leaf/30 dark:bg-[var(--card-bg)]">
              <div>
                <span className="grid size-12 place-items-center rounded-xl bg-leaf text-hero-tint">
                  <CalendarCheck className="size-6" aria-hidden />
                </span>
                <div className="mt-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-hero-tint sm:text-xl dark:text-white">
                    Subscription Passes
                  </h3>
                  <span className="rounded-full bg-leaf/20 px-2.5 py-0.5 text-[0.6875rem] font-bold text-hero-tint dark:text-leaf">
                    Frequent Flyers
                  </span>
                </div>
                <p className="mt-2 text-sm text-hero-tint/80 leading-relaxed dark:text-white/75">
                  Prepaid travel tiers designed for regular fliers and organizations. Enjoy zero-payment
                  checkout, priority boarding, and substantial per-ride savings.
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-hero-tint/85 sm:text-sm dark:text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Tier 1: 12 rides (3 months validity)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Tier 2: 50 rides (12 months validity)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Free rescheduling &amp; priority seating
                  </li>
                </ul>
              </div>
              <Button asChild size="sm" className="mt-6 w-full bg-leaf font-bold text-hero-tint hover:bg-leaf/90">
                <Link href="/subscriptions">
                  Explore Tiers
                  <ArrowRight className="size-4 ml-1.5" aria-hidden />
                </Link>
              </Button>
            </article>

            {/* Service 3: Executive Charter */}
            <article className="flex flex-col justify-between rounded-2xl border border-cream-300/80 bg-white p-6 shadow-soft transition-all hover:shadow-md sm:p-7 dark:border-white/10 dark:bg-[var(--card-bg)]">
              <div>
                <span className="grid size-12 place-items-center rounded-xl bg-hero-tint/10 text-hero-tint dark:bg-white/10 dark:text-white">
                  <Users className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-hero-tint sm:text-xl dark:text-white">
                  Private &amp; Group Charter
                </h3>
                <p className="mt-2 text-sm text-hero-tint/80 leading-relaxed dark:text-white/75">
                  Reserve an entire 14-seat EV minibus exclusively for family trips, executive delegations,
                  weddings, or custom pickup locations across Abia and Imo State.
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-hero-tint/85 sm:text-sm dark:text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Entire 14-seat vehicle exclusively yours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Custom pickup &amp; drop-off times
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-leaf" />
                    Transparent quotes &amp; verified driver
                  </li>
                </ul>
              </div>
              <Button asChild size="sm" variant="outline" className="mt-6 w-full border-hero-tint/20 font-bold text-hero-tint hover:bg-hero-tint/5 dark:border-white/20 dark:text-white">
                <Link href="/charter">
                  Charter a Shuttle
                  <ArrowRight className="size-4 ml-1.5" aria-hidden />
                </Link>
              </Button>
            </article>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <HowItWorksSection />

      {/* 4. Terminals & Corridors Guide */}
      <section
        id="terminals"
        className="bg-white py-12 sm:py-16 dark:bg-[var(--page-bg)]"
        aria-labelledby="terminals-heading"
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-section px-3.5 py-1 text-xs font-bold text-hero-tint">
              <Compass className="size-3.5" aria-hidden />
              Stations &amp; Routes
            </span>
            <h2
              id="terminals-heading"
              className="mt-3 text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md dark:text-white"
            >
              Abia ↔ Sam Mbakwe Airport Hubs
            </h2>
            <p className="mt-2 text-sm text-hero-tint/80 sm:text-base dark:text-white/75">
              Strategically located terminals in Umuahia, Aba, and Owerri for seamless departures and arrivals.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-cream-300/80 bg-cream-50 p-6 dark:border-white/10 dark:bg-[var(--card-bg)]">
              <span className="flex size-10 items-center justify-center rounded-xl bg-hero-tint/90 text-white">
                <MapPin className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-hero-tint dark:text-white">Nnenna Otti Bus Terminal</h3>
              <p className="text-xs text-hero-tint/70 dark:text-white/60">Umuahia City Central</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-hero-tint/90 dark:text-white/80">
                <Clock className="size-4 text-leaf" />
                <span>06:00 · 09:00 · 12:00 · 15:00</span>
              </div>
              <p className="mt-2 text-xs text-hero-tint/80 leading-relaxed dark:text-white/70">
                Direct EV express via Umuahia–Owerri Road. Average transit time 90 minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-cream-300/80 bg-cream-50 p-6 dark:border-white/10 dark:bg-[var(--card-bg)]">
              <span className="flex size-10 items-center justify-center rounded-xl bg-hero-tint/90 text-white">
                <MapPin className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-hero-tint dark:text-white">Aba Central Terminal</h3>
              <p className="text-xs text-hero-tint/70 dark:text-white/60">Aba Commercial Hub</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-hero-tint/90 dark:text-white/80">
                <Clock className="size-4 text-leaf" />
                <span>06:00 · 09:00 · 12:00 · 15:00</span>
              </div>
              <p className="mt-2 text-xs text-hero-tint/80 leading-relaxed dark:text-white/70">
                Pickups at Osisioma Junction and Owerrinta en route. Average transit time 85 minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-cream-300/80 bg-cream-50 p-6 dark:border-white/10 dark:bg-[var(--card-bg)]">
              <span className="flex size-10 items-center justify-center rounded-xl bg-hero-tint/90 text-white">
                <MapPin className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-hero-tint dark:text-white">Sam Mbakwe Airport Terminal</h3>
              <p className="text-xs text-hero-tint/70 dark:text-white/60">Arrivals Hall, Owerri (QOW)</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-hero-tint/90 dark:text-white/80">
                <Clock className="size-4 text-leaf" />
                <span>Synchronized with domestic flight arrivals</span>
              </div>
              <p className="mt-2 text-xs text-hero-tint/80 leading-relaxed dark:text-white/70">
                Return legs meet incoming flights directly at the terminal with marked passenger reception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Subscriptions Section (Tiers) */}
      <HomeSubscriptionsSection />

      {/* 6. Green Fleet Banner */}
      <section className="bg-hero-tint/90 py-12 sm:py-16" id="green">
        <div className="container">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 sm:flex-row sm:items-center">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white/15 text-white">
              <BatteryCharging className="size-8" aria-hidden />
            </span>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-leaf px-3 py-0.5 text-xs font-bold text-hero-tint">
                <Zap className="size-3.5 fill-current" aria-hidden />
                Zero Tailpipe Emissions
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                100% Electric · 14-Seat Wuling EV Shuttles
              </h2>
              <p className="mt-1.5 text-sm text-white/85 leading-relaxed sm:text-base">
                Quiet, air-conditioned, zero-tailpipe travel between Abia state hubs and Sam Mbakwe
                Airport, Owerri. Certified drivers, onboard safety, and dependable scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <HomeFaqSection />

      {/* 8. Final Conversion CTA */}
      <section className="border-t border-cream-300/80 bg-cream-50 py-12 sm:py-16 dark:border-white/10 dark:bg-[var(--page-bg)]">
        <div className="container max-w-4xl text-center">
          <h2 className="text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md dark:text-white">
            Ready to Catch Your Flight?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-hero-tint/80 sm:text-base dark:text-white/75">
            Book your seat online in under two minutes, or create an account to manage your rides
            and subscription passes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-hero-tint/90 px-8 font-bold text-white shadow-soft hover:bg-hero-tint/80 dark:bg-leaf dark:text-hero-tint">
              <Link href="/book">
                Book a Shuttle
                <ArrowRight className="size-4 ml-2" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-hero-tint/25 bg-white px-6 font-semibold text-hero-tint hover:bg-hero-tint/5 dark:border-white/20 dark:bg-transparent dark:text-white">
              <Link href="/auth/register?next=/book">Create Passenger Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
