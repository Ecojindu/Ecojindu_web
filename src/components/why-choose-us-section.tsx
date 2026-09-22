import Image from "next/image";
import Link from "next/link";
import { BatteryCharging, Clock, QrCode, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

const CARDS = [
  {
    title: "100% electric fleet",
    body: "Quiet Wuling EV shuttles — zero tailpipe emissions between Abia cities and the airport.",
    icon: BatteryCharging,
  },
  {
    title: "Fixed fare, every run",
    body: "One published price per seat. No terminal haggling and no surge pricing on flight days.",
    icon: Wallet,
  },
  {
    title: "Built around your flight",
    body: "Upload your ticket and we match departures so you reach Sam Mbakwe with check-in time to spare.",
    icon: Clock,
  },
  {
    title: "QR boarding pass",
    body: "Pay once, get an instant QR ticket plus SMS and email reminders before departure.",
    icon: QrCode,
  },
] as const;

export function WhyChooseUsSection() {
  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden py-12 sm:py-14 lg:py-16"
      aria-labelledby="why-choose-us-heading"
    >
      <Image
        src="/images/why-choose-us-bg.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-hero-tint/[0.52]" aria-hidden />

      <div className="container relative">
        <h2
          id="why-choose-us-heading"
          className="text-center text-display-sm font-extrabold tracking-tight text-white sm:text-display-md"
        >
          Why Choose Us
        </h2>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="max-w-lg lg:max-w-none">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf">
              Green mobility, on your schedule
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-snug text-white sm:text-3xl">
              Airport runs that respect your time and your wallet.
            </h3>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/90">
              Ecojindu connects Umuahia and Aba to Sam Mbakwe Airport with scheduled electric
              shuttles, transparent pricing, and booking in three taps — upload your flight ticket,
              confirm, and pay.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 border-0 bg-mint-section text-hero-tint hover:bg-white/90"
            >
              <Link href="/search">View scheduled departures</Link>
            </Button>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:gap-4">
            {CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <li
                  key={card.title}
                  className="flex flex-col rounded-2xl border border-[#009E61]/40 bg-[#009E61]/30 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-5"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-[#009E61]/45 text-white">
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
                  </span>
                  <h4 className="mt-4 text-sm font-bold leading-snug text-white sm:text-base">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/85 sm:text-sm">
                    {card.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
