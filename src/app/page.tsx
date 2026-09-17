import type { Metadata } from "next";
import Link from "next/link";
import { BatteryCharging, MessageCircle } from "lucide-react";

import { UploadGoHome } from "@/components/upload-go-home";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { config, whatsappLink } from "@/lib/config";
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
    <div className="pb-28 lg:pb-12">
      {/* Hero — one composition: brand, headline, support, CTAs */}
      <section className="relative overflow-hidden border-b border-cream-300/80">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(124,179,66,0.18),transparent_50%),radial-gradient(ellipse_at_90%_10%,rgba(47,82,51,0.12),transparent_45%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,rgba(124,179,66,0.12),transparent_50%)]"
          aria-hidden
        />
        <div className="container relative py-8 sm:py-12 lg:py-16">
          <UploadGoHome />
        </div>
      </section>

      <section className="container py-10 sm:py-14" id="how-it-works">
        <h2 className="text-center text-display-sm font-extrabold text-forest dark:text-cream-50">
          Three taps. Ticket in hand.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-ink-muted">
          Upload your flight ticket, confirm the shuttle we pick, and pay. Subscribers skip the
          payment tap.
        </p>
        <ol className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Upload", d: "Photo, PDF or booking code — we read the flight." },
            { n: "2", t: "Confirm", d: "Shuttle time, seats and phone on one screen." },
            { n: "3", t: "Pay", d: "Paystack card, transfer or USSD — then your QR." },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-cream-300 bg-white/80 p-5 dark:border-white/10 dark:bg-forest/40"
            >
              <span className="grid size-9 place-items-center rounded-full bg-forest text-sm font-bold text-leaf">
                {step.n}
              </span>
              <h3 className="mt-3 font-bold text-forest dark:text-cream-50">{step.t}</h3>
              <p className="mt-1 text-sm text-ink-muted">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-cream-300/80 bg-white/50 py-10 dark:bg-forest/30" id="fares">
        <div className="container max-w-3xl">
          <h2 className="text-center text-xl font-extrabold text-forest dark:text-cream-50">
            Fixed fare · {naira(sampleFare)} a seat
          </h2>
          <p className="mt-2 text-center text-sm text-ink-muted">
            No haggling. Same price on every scheduled run from Umuahia or Aba to Sam Mbakwe.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            {(airportRoutes.length ? airportRoutes : []).slice(0, 4).map((route) => (
              <li
                key={route.id}
                className="flex items-center justify-between rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 dark:border-white/10 dark:bg-forest/40"
              >
                <span className="font-medium text-forest dark:text-cream-100">{route.name}</span>
                <span className="font-bold tabular text-forest dark:text-cream-50">
                  {naira(route.base_fare_kobo > 0 ? route.base_fare_kobo : sampleFare)}
                </span>
              </li>
            ))}
            {!airportRoutes.length ? (
              <li className="rounded-xl border border-cream-300 px-4 py-3 text-center">
                Live timetable loads when the booking service is reachable. Fare{" "}
                <strong className="tabular">{naira(sampleFare)}</strong>.
              </li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="container py-10 sm:py-14" id="green">
        <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-forest text-leaf">
            <BatteryCharging className="size-7" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">
              100% electric · 14-seat Wuling EVs
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Quiet, zero-tailpipe rides between Abia cities and Sam Mbakwe Airport, Owerri.
            </p>
          </div>
        </div>
      </section>

      <section className="container max-w-2xl pb-6" id="faq">
        <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">Questions</h2>
        <Accordion type="single" collapsible className="mt-4">
          {productConfig.faq.slice(0, 5).map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link href="/help">Full help &amp; FAQ</Link>
        </Button>
      </section>

      <section className="container pb-8">
        <div className="rounded-3xl bg-forest px-5 py-8 text-center text-cream-50 sm:px-8">
          <h2 className="text-xl font-extrabold">Prefer WhatsApp?</h2>
          <p className="mt-2 text-sm text-cream-100/80">
            Send a ticket photo or message {config.contactPhone} — same booking API as the web.
          </p>
          <Button asChild variant="whatsapp" size="lg" className="mt-5">
            <a href={whatsappLink("Hi Ecojindu, I'd like to book a seat.")} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden />
              Book on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
