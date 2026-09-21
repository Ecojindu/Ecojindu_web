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
        <p className="mt-2 max-w-xl text-sm text-ink-muted dark:text-cream-100/80">
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
            Message {config.contactPhone} — same booking API as the web.
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
