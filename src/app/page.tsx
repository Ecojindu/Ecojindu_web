import type { Metadata } from "next";
import { BatteryCharging } from "lucide-react";

import { HomeHeroSection } from "@/components/home-hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { BookHome } from "@/components/upload-go-home";
import { HomeFaqSection } from "@/components/home-faq-section";
import { HomeSubscriptionsSection } from "@/components/home-subscriptions-section";
import { config } from "@/lib/config";
import { productConfig } from "@/lib/product-config";
import { getRoutes } from "@/lib/server-api";
import { naira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ecojindu Shuttle — Upload & Go to Sam Mbakwe Airport",
  description:
    "Scheduled 100% electric shuttles between Umuahia, Aba and Sam Mbakwe Airport. Upload your ticket or plan your trip, confirm, and pay — QR boarding pass ready to board.",
  openGraph: {
    title: "Ecojindu Shuttle — Upload & Go",
    description:
      "Electric airport shuttles across Abia State. Upload your flight ticket and get a QR boarding pass in three taps.",
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
      <HomeHeroSection />

      <HowItWorksSection fareLabel={naira(sampleFare)} />

      <section
        id="upload-go"
        className="snap-start border-b border-cream-300/80 bg-cream-50 py-8 sm:py-12 lg:py-14 dark:border-white/10 dark:bg-[var(--page-bg)]"
        aria-label="Book a seat"
      >
        <div className="container">
          <BookHome />
        </div>
      </section>

      <HomeSubscriptionsSection />

      <section className="bg-[#009E61] py-10 sm:py-14" id="green">
        <div className="container">
          <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-mint-section text-hero-tint">
              <BatteryCharging className="size-7" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                100% electric · 14-seat Wuling EVs
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Quiet, zero-tailpipe rides between Abia cities and Sam Mbakwe Airport, Owerri.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeFaqSection />
    </div>
  );
}
