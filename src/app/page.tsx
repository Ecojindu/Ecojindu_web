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
    <div>
      {/* Hero — two columns on desktop: copy + upload card */}
      <section className="border-b border-cream-300/80 bg-cream-50 dark:border-white/10 dark:bg-[var(--page-bg)]">
        <div className="section-shell py-8 sm:py-12 lg:py-14">
          <UploadGoHome />
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14" id="how-it-works">
        <h2 className="text-display-sm font-extrabold text-forest dark:text-cream-50">
          Three taps. Ticket in hand.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-muted dark:text-cream-100/80">
          Upload your flight ticket, confirm the shuttle we pick, and pay. Subscribers skip the
          payment tap.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Upload", d: "Photo, PDF or booking code — we read the flight." },
            { n: "2", t: "Confirm", d: "Shuttle time, seats and phone on one screen." },
            { n: "3", t: "Pay", d: "Paystack card, transfer or USSD — then your QR." },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-cream-300 bg-white p-5 dark:border-white/15 dark:bg-[var(--surface-raised)]"
            >
              <span className="grid size-9 place-items-center rounded-full bg-forest text-sm font-bold text-cream-50">
                {step.n}
              </span>
              <h3 className="mt-3 font-bold text-forest dark:text-cream-50">{step.t}</h3>
              <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/80">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-cream-300/80 bg-white py-10 dark:border-white/10 dark:bg-[var(--surface)]" id="fares">
        <div className="section-shell">
          <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">
            Fixed fare · {naira(sampleFare)} a seat
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-muted dark:text-cream-100/80">
            No haggling. Same price on every scheduled run from Umuahia or Aba to Sam Mbakwe.
          </p>
          <ul className="mt-6 max-w-xl space-y-2 text-sm text-ink-muted dark:text-cream-100/80">
            {(airportRoutes.length ? airportRoutes : []).slice(0, 4).map((route) => (
              <li
                key={route.id}
                className="flex items-center justify-between rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 dark:border-white/15 dark:bg-[var(--surface-raised)]"
              >
                <span className="font-medium text-forest dark:text-cream-100">{route.name}</span>
                <span className="font-bold tabular text-forest dark:text-cream-50">
                  {naira(route.base_fare_kobo > 0 ? route.base_fare_kobo : sampleFare)}
                </span>
              </li>
            ))}
            {!airportRoutes.length ? (
              <li className="rounded-xl border border-cream-300 px-4 py-3 dark:border-white/15 dark:text-cream-100/80">
                Live timetable loads when the booking service is reachable. Fare{" "}
                <strong className="tabular dark:text-cream-50">{naira(sampleFare)}</strong>.
              </li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14" id="green">
        <div className="flex max-w-xl flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-cream-300 bg-white text-moss dark:border-white/15 dark:bg-[var(--surface-raised)] dark:text-[#B8E08A]">
            <BatteryCharging className="size-7" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">
              100% electric · 14-seat Wuling EVs
            </h2>
            <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/80">
              Quiet, zero-tailpipe rides between Abia cities and Sam Mbakwe Airport, Owerri.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell pb-6" id="faq">
        <div className="max-w-xl">
          <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">Questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {productConfig.faq.slice(0, 5).map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="dark:text-cream-50">{item.q}</AccordionTrigger>
                <AccordionContent className="dark:text-cream-100/80">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild variant="link" className="mt-2 px-0 font-semibold">
            <Link href="/help">Full help &amp; FAQ</Link>
          </Button>
        </div>
      </section>

      <section className="section-shell pb-10">
        <div className="max-w-xl rounded-3xl border border-cream-300 bg-white px-5 py-8 dark:border-white/15 dark:bg-[var(--surface-raised)] sm:px-8">
          <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">Prefer WhatsApp?</h2>
          <p className="mt-2 text-sm text-ink-muted dark:text-cream-100/80">
            Send a ticket photo or message {config.contactPhone} — same booking API as the web.
          </p>
          <Button asChild variant="whatsapp" size="lg" className="mt-5">
            <a
              href={whatsappLink("Hi Ecojindu, I'd like to book a seat.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden />
              Book on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
