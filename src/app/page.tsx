import type { Metadata } from "next";
import Image from "next/image";
import { BatteryCharging } from "lucide-react";

import { HowItWorksSection } from "@/components/how-it-works-section";
import { UploadGoHome } from "@/components/upload-go-home";
import { HomeSubscriptionsSection } from "@/components/home-subscriptions-section";
import { HomeFaqSection } from "@/components/home-faq-section";
import { OurServicesSection } from "@/components/our-services-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";
import { config } from "@/lib/config";
import { productConfig } from "@/lib/product-config";
import { getRoutes } from "@/lib/server-api";
import { naira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ecojindu Shuttle — Upload & Go to Sam Mbakwe Airport",
  description:
    "Scheduled 100% electric shuttles between Umuahia, Aba and Sam Mbakwe Airport. Upload your flight ticket, confirm, and pay — QR ticket in three taps.",
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
      {/* Hero — one screen below the header; next section begins on first scroll */}
      <section className="relative h-[calc(100svh-60px)] snap-start overflow-hidden sm:h-[calc(100svh-68px)]">
        <Image
          src="/images/hero-airport-shuttle.png"
          alt=""
          fill
          priority
          className="z-0 object-cover object-[center_28%]"
          sizes="100vw"
        />
        {/* Flat #1E4927 wash — image stays sharp and visible (no blur) */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-hero-tint/[0.52]"
          aria-hidden
        />
        <div className="container relative z-[2] flex h-full flex-col justify-center py-10 sm:py-12">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/85">
              Upload &amp; Go
            </p>
            <h1 className="mt-2 text-balance text-display-sm font-extrabold tracking-tight text-white sm:text-display-md">
              Ecojindu Shuttle
            </h1>
            <p className="mt-3 max-w-md text-pretty text-base text-white/90">
              Upload your flight ticket. We pick the shuttle that gets you to Sam Mbakwe in time —
              then you confirm and pay.
            </p>
          </div>
        </div>
      </section>

      <HowItWorksSection fareLabel={naira(sampleFare)} />

      <section
        className="snap-start border-b border-white/10 bg-[#009E61] py-8 sm:py-12 lg:py-14"
        id="upload-go"
        aria-labelledby="upload-go-heading"
      >
        <div className="container">
          <UploadGoHome showIntro introOnDark />
        </div>
      </section>

      <WhyChooseUsSection />

      <HomeSubscriptionsSection />

      <OurServicesSection />

      <section className="bg-[#009E61] py-10 sm:py-14" id="green">
        <div className="container">
          <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-forest text-leaf">
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
