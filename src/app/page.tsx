import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Leaf,
  MessageCircle,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { RouteLine, SectionHeading } from "@/components/brand";
import { SearchWidget } from "@/components/search-widget";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/config";

const STEPS = [
  {
    icon: Search,
    title: "Pick your departure",
    body: "Choose your route and date. Every seat left on every scheduled run, live — no calling around, no haggling.",
  },
  {
    icon: Wallet,
    title: "Pay securely",
    body: "Card, bank transfer or USSD through Paystack. Your seat is held for 15 minutes while you pay.",
  },
  {
    icon: QrCode,
    title: "Board with a QR code",
    body: "Your ticket arrives by email and SMS the moment payment clears. Show it at the gate and you're on.",
  },
];

const FARES = [
  {
    label: "Private charter cab",
    price: "₦40,000",
    per: "per trip",
    points: ["Price negotiated every time", "No fixed departure", "Petrol or diesel"],
    highlight: false,
  },
  {
    label: "Ecojindu Shuttle",
    price: "₦15,000",
    per: "per seat",
    points: ["Fixed, published fare", "Airline-style timetable", "100% electric — zero tailpipe emissions"],
    highlight: true,
  },
  {
    label: "Ecojindu subscription",
    price: "₦16,667",
    per: "per ride · Tier 1",
    points: ["12 rides over 3 months", "Book with zero payment at checkout", "Priority boarding"],
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Where does the shuttle leave from?",
    a: "Our Umuahia departures leave from the Nnenna Otti Bus Terminal, with pickup at Umuahia Tower Junction and along the Umuahia–Owerri road. Aba departures leave from Aba Central Terminal. The airport leg drops directly at the Sam Mbakwe terminal building.",
  },
  {
    q: "How far ahead should I arrive?",
    a: "Twenty minutes before departure. Boarding closes ten minutes before we leave — we run to a published timetable so that the shuttle after yours also leaves on time.",
  },
  {
    q: "What if my flight is delayed or I need to cancel?",
    a: "You can cancel free of charge up to two hours before departure, either from the Manage booking page or by replying CANCEL on WhatsApp. Refunds return to your original payment method within 3–5 working days. Inside two hours, call us on +234 815 447 1570 and we'll do what we can.",
  },
  {
    q: "Do I need an account to book?",
    a: "No. Guests book with just a name and phone number. If you give us an email we'll send the QR ticket there too, and you can claim the account later to see all your trips in one place.",
  },
  {
    q: "How much luggage can I bring?",
    a: "One suitcase and one piece of hand luggage per seat, which comfortably covers a normal flight allowance. Travelling heavier? Book an extra seat or message us on WhatsApp first so we can plan the load.",
  },
  {
    q: "Are the vehicles really electric?",
    a: "Yes. The fleet is 100% electric — Wuling EV minibuses with a 300km range, charged at our Umuahia terminal. No tailpipe emissions on any leg of your journey, and a noticeably quieter ride.",
  },
  {
    q: "How do the ride subscriptions work?",
    a: "You buy a block of rides upfront — 12 rides over 3 months, or 50 over a year. Each booking deducts one credit and costs nothing at checkout, so a regular traveller books in two taps. Credits are transferable on the corporate tier.",
  },
  {
    q: "Can I book for someone else?",
    a: "Yes. Put the passenger's name on the booking and their phone number so the QR ticket reaches them directly. You'll still get a copy at your own email address.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-gradient-to-b from-white/70 to-transparent"
          aria-hidden
        />
        <RouteLine
          className="pointer-events-none absolute inset-x-0 top-28 -z-10 h-40 opacity-40"
          animate
        />

        <div className="container pb-10 pt-7 sm:pt-14 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="leaf" className="mb-4 animate-fade-up sm:mb-5">
              <Leaf className="size-3.5" aria-hidden />
              100% electric · Abia State
            </Badge>

            <h1 className="animate-fade-up text-balance text-display-md font-extrabold leading-[1.06] tracking-tight text-forest sm:text-display-lg lg:text-display-xl">
              Catch flights,
              <br />
              <span className="text-moss">not miss them.</span>
            </h1>

            {/* One line on a phone, the fuller pitch on larger screens. */}
            <p className="mx-auto mt-4 max-w-xl animate-fade-up text-pretty text-[15px] leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
              Scheduled electric shuttles to Sam Mbakwe Airport.
              <span className="hidden sm:inline">
                {" "}
                A fixed timetable you can plan a flight around — with a fixed fare and a QR ticket
                on your phone in under 90 seconds.
              </span>
              <span className="sm:hidden"> Fixed fare, QR ticket, 90 seconds.</span>
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-4xl animate-fade-up sm:mt-10">
            <SearchWidget />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-ink-soft sm:mt-8 sm:gap-x-6 sm:text-sm">
            {[
              { icon: Clock, label: "4 departures daily", mobile: true },
              { icon: ShieldCheck, label: "Secure checkout", mobile: true },
              { icon: BatteryCharging, label: "Zero tailpipe emissions", mobile: false },
            ].map(({ icon: Icon, label, mobile }) => (
              <span
                key={label}
                className={`items-center gap-2 ${mobile ? "inline-flex" : "hidden sm:inline-flex"}`}
              >
                <Icon className="size-4 text-moss" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 py-10 sm:py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="Three steps. Ninety seconds."
            description="No phone calls, no waiting for a cab to fill up, no negotiating the fare at the roadside."
          />

          <ol className="mt-7 grid gap-3 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-4 rounded-2xl border border-cream-300 bg-white p-4 shadow-soft sm:block sm:p-6"
              >
                <span className="absolute -top-3 left-6 hidden size-7 place-items-center rounded-full bg-forest text-xs font-extrabold text-white sm:grid">
                  {index + 1}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-leaf/15 sm:mb-4 sm:size-12">
                  <step.icon className="size-5 text-moss sm:size-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-forest sm:text-lg">{step.title}</h3>
                  {/* The full explanation is desktop-only — on a phone the title carries it. */}
                  <p className="mt-1.5 hidden text-pretty text-sm leading-relaxed text-ink-muted sm:mt-2 sm:block">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Green story ────────────────────────────────────── */}
      <section id="green" className="scroll-mt-20 py-10 sm:py-16 lg:py-20">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-forest text-white shadow-lift">
            <div className="grid gap-8 p-6 sm:gap-10 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-leaf-light">
                  The EV story
                </p>
                <h2 className="text-balance text-display-sm font-extrabold leading-tight sm:text-display-md">
                  Every trip you take runs on electricity.
                </h2>
                <p className="mt-5 text-pretty leading-relaxed text-cream-100/80">
                  Our fleet is entirely electric — Wuling EV minibuses with a 300km range, charged
                  at the Nnenna Otti terminal in Umuahia. A single 14-seat run replaces up to seven
                  petrol cars on the Umuahia–Owerri corridor.
                </p>
                <p className="mt-4 hidden text-pretty leading-relaxed text-cream-100/80 sm:block">
                  That means no tailpipe emissions, a quieter cabin, and fares that don&apos;t move
                  every time the fuel price does.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="accent" size="lg">
                    <Link href="/search">
                      Book an electric trip
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-4">
                {[
                  { value: "100%", label: "Electric fleet" },
                  { value: "300km", label: "Range per charge" },
                  { value: "0g", label: "Tailpipe CO₂ per km" },
                  { value: "14", label: "Seats per shuttle" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/[0.07] p-5">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-3xl font-extrabold text-leaf sm:text-4xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-cream-100/60">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fare comparison ────────────────────────────────── */}
      <section id="fares" className="scroll-mt-20 py-10 sm:py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Fares"
            title="A published fare, not a negotiation"
            description="A private charter to Sam Mbakwe runs around ₦40,000 and leaves when it leaves. Ours is ₦15,000 a seat, four times a day, every day."
          />

          <div className="-mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FARES.map((tier) => (
              <div
                key={tier.label}
                className={`relative w-[85%] shrink-0 snap-center rounded-2xl border-2 p-5 sm:w-auto sm:p-6 ${
                  tier.highlight
                    ? "border-moss bg-white shadow-lift lg:-mt-3 lg:pb-9"
                    : "border-cream-300 bg-white/70 shadow-soft"
                }`}
              >
                {tier.highlight && (
                  <Badge variant="forest" className="absolute -top-3 left-6">
                    Best value
                  </Badge>
                )}
                <p className="text-sm font-semibold text-ink-soft">{tier.label}</p>
                <p className="mt-2 flex items-baseline gap-1.5">
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      tier.highlight ? "text-moss" : "text-forest"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm text-ink-soft">{tier.per}</span>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <CheckCircle2
                        className={`mt-0.5 size-4 shrink-0 ${
                          tier.highlight ? "text-moss" : "text-ink-soft"
                        }`}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscriptions teaser ───────────────────────────── */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="container">
          <div className="grid items-center gap-8 rounded-3xl border border-cream-300 bg-white p-8 shadow-soft sm:p-12 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <Badge variant="teal" className="mb-4">
                <Sparkles className="size-3.5" aria-hidden />
                For regular travellers
              </Badge>
              <h2 className="text-balance text-display-sm font-extrabold text-forest">
                Buy your rides upfront. Then just book.
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-ink-muted">
                Fly often? A ride subscription drops the payment step entirely. Pick your departure,
                tap once, and a credit comes off your balance — no card, no checkout, no receipt to
                file.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/subscriptions">
                    See both tiers
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { name: "Tier 1 · Commuter", price: "₦200,000", detail: "12 rides · 3 months" },
                { name: "Tier 2 · Corporate", price: "₦1,000,000", detail: "50 rides · 12 months" },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-cream-100 p-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-forest">{plan.name}</p>
                    <p className="text-xs text-ink-soft">{plan.detail}</p>
                  </div>
                  <p className="shrink-0 text-xl font-extrabold text-moss">{plan.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WhatsApp ───────────────────────────────────────── */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-br from-[#25D366]/12 to-teal/10 p-8 text-center sm:flex-row sm:justify-between sm:p-10 sm:text-left">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#25D366]">
                <MessageCircle className="size-7 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-forest">Prefer WhatsApp?</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  Book the whole trip in a chat — we&apos;ll send your QR ticket straight to the
                  thread.
                </p>
              </div>
            </div>
            <Button asChild variant="whatsapp" size="lg" className="shrink-0">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                Book on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 py-10 sm:py-16 lg:py-24">
        <div className="container max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow="Questions"
            title="Everything you might be wondering"
          />
          <div className="mt-10 rounded-2xl border border-cream-300 bg-white px-6 shadow-soft sm:px-8">
            <Accordion type="single" collapsible>
              {FAQS.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-ink-muted">Still not sure about something?</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <a href="mailto:jinduinc@gmail.com">Email us</a>
              </Button>
              <Button asChild variant="outline">
                <a href="tel:+2348154471570">Call +234 815 447 1570</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="pb-8">
        <div className="container">
          <div className="rounded-3xl bg-moss px-6 py-10 text-center text-white shadow-lift sm:px-12 sm:py-16">
            <CalendarCheck className="mx-auto mb-5 size-10 text-white/85" aria-hidden />
            <h2 className="text-balance text-display-sm font-extrabold sm:text-display-md">
              Your next flight starts here.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty leading-relaxed text-white/85">
              Pick a departure, pay, and board with a QR code. That&apos;s the whole thing.
            </p>
            <Button asChild size="xl" variant="secondary" className="mt-8">
              <Link href="/search">
                Find my departure
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
