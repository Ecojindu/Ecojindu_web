import type { Metadata } from "next";
import Link from "next/link";
import { BatteryCharging, MessageCircle } from "lucide-react";

import { BookHome } from "@/components/upload-go-home";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { config, whatsappLink } from "@/lib/config";
import { productConfig } from "@/lib/product-config";

export const metadata: Metadata = {
  title: "Ecojindu Shuttle — Umuahia & Aba to Sam Mbakwe Airport",
  description:
    "Scheduled 100% electric shuttles between Umuahia, Aba and Sam Mbakwe Airport. Pick your route, confirm, and pay — QR ticket in a few taps.",
  openGraph: {
    title: "Ecojindu Shuttle",
    description:
      "Electric airport shuttles across Abia State. Book a seat, confirm, and get a QR boarding pass.",
    url: config.siteUrl,
  },
};

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-cream-300/80 bg-cream-50 dark:border-white/10 dark:bg-[var(--page-bg)]">
        <div className="section-shell py-8 sm:py-12 lg:py-14">
          <BookHome />
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14" id="how-it-works">
        <h2 className="text-display-sm font-extrabold text-forest dark:text-cream-50">
          Three steps. Ticket in hand.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-muted dark:text-cream-100/80 sm:text-base">
          Pick your departure, confirm your details, and pay. Subscribers skip the payment step.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Choose", d: "Route, date and seats on the form — then search." },
            { n: "2", t: "Confirm", d: "Name, phone and pickup on one screen." },
            { n: "3", t: "Pay", d: "Paystack card, transfer or USSD — then your QR." },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-cream-300 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-[var(--surface-raised)]"
            >
              <span className="grid size-9 place-items-center rounded-full bg-forest text-sm font-extrabold text-white dark:bg-white dark:text-[#0A2411]">
                {step.n}
              </span>
              <h3 className="mt-3 text-base font-bold text-forest dark:text-cream-50">{step.t}</h3>
              <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/80">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Fixed Fares Section ── */}
      <section className="border-y border-cream-300/80 bg-white/60 py-10 dark:border-white/10 dark:bg-[var(--surface)]/60 sm:py-14" id="fares">
        <div className="section-shell">
          <h2 className="text-display-sm font-extrabold text-forest dark:text-cream-50">
            Fixed fare · ₦15,000 a seat
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-muted dark:text-cream-100/80 sm:text-base">
            No surge pricing, no haggling. The same clear rate on every scheduled departure.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { from: "Umuahia Terminal", to: "Sam Mbakwe Airport", time: "55 mins" },
              { from: "Sam Mbakwe Airport", to: "Umuahia Terminal", time: "55 mins" },
              { from: "Aba Terminal", to: "Sam Mbakwe Airport", time: "65 mins" },
              { from: "Sam Mbakwe Airport", to: "Aba Terminal", time: "65 mins" },
            ].map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="flex items-center justify-between rounded-2xl border border-cream-300 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[var(--surface-raised)]"
              >
                <div>
                  <p className="text-sm font-bold text-forest dark:text-cream-50">
                    {route.from} → {route.to}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft dark:text-cream-100/70">
                    Approx. {route.time} · 100% Electric EV
                  </p>
                </div>
                <div className="text-right">
                  <span className="tabular text-lg font-extrabold text-forest dark:text-cream-50">
                    ₦15,000
                  </span>
                  <span className="block text-[11px] text-ink-soft dark:text-cream-100/70">per seat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14" id="green">
        <div className="flex max-w-2xl flex-col items-start gap-4 rounded-3xl border border-cream-300 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-[var(--surface-raised)] sm:flex-row sm:items-center sm:p-8">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-moss/10 text-moss dark:bg-leaf/20 dark:text-leaf-light">
            <BatteryCharging className="size-7" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">
              100% Electric · 14-Seat Wuling EV Fleet
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted dark:text-cream-100/80">
              Quiet, air-conditioned, zero-tailpipe rides connecting Abia State directly to Sam Mbakwe Airport, Owerri.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell pb-10" id="faq">
        <div className="max-w-3xl">
          <h2 className="text-display-sm font-extrabold text-forest dark:text-cream-50">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {productConfig.faq.slice(0, 5).map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="dark:text-cream-50 font-bold">{item.q}</AccordionTrigger>
                <AccordionContent className="dark:text-cream-100/80 text-sm leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-4">
            <Button asChild variant="link" className="px-0 text-base font-bold">
              <Link href="/help">View all help topics &amp; full FAQ →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-shell pb-12 sm:pb-16">
        <div className="rounded-3xl border border-[#25D366]/30 bg-white p-6 shadow-sm dark:border-[#25D366]/40 dark:bg-[var(--surface-raised)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">Prefer booking on WhatsApp?</h2>
              <p className="mt-1.5 text-sm text-ink-muted dark:text-cream-100/80">
                Message {config.contactPhone} directly with your travel details — same instant booking system.
              </p>
            </div>
            <Button asChild variant="whatsapp" size="lg" className="shrink-0">
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
        </div>
      </section>
    </div>
  );
}
