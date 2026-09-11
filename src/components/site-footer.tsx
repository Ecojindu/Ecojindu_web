import Link from "next/link";
import { ChevronDown, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { LeafMark } from "@/components/brand";
import { config, whatsappLink } from "@/lib/config";

const COLUMNS = [
  {
    title: "Travel",
    links: [
      { href: "/search", label: "Book a trip" },
      { href: "/charter", label: "Charter a vehicle" },
      { href: "/subscriptions", label: "Ride subscriptions" },
      { href: "/manage", label: "Manage a booking" },
      { href: "/dashboard", label: "My trips" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#green", label: "Our EV fleet" },
      { href: "/#fares", label: "Fares" },
      { href: "/#faq", label: "FAQs" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-cream-300 bg-forest text-cream-100 sm:mt-24">
      <div className="container py-9 sm:py-14">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] md:gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-white/10">
                <LeafMark className="size-5 text-leaf" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Ecojindu<span className="text-leaf">.</span>
              </span>
            </div>
            <p className="mt-4 hidden max-w-xs text-pretty text-sm leading-relaxed text-cream-100/75 sm:block">
              Scheduled, zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe
              Airport — on a fixed timetable you can plan a flight around.
            </p>
            <p className="mt-3 text-sm font-semibold text-leaf-light sm:mt-5">
              Bridging Cities, Powering Green Mobility.
            </p>
          </div>

          {/*
            Two renderings on purpose. A closed <details> doesn't render its
            children at all, so CSS can't force it open on desktop — and a
            desktop footer that needs clicking to reveal links would be worse
            than the scroll it saves. It's ten links; the duplication is cheap.
          */}
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              {/* Mobile: collapsed by default */}
              <details className="border-b border-white/10 md:hidden [&[open]_svg]:rotate-180">
                <summary className="tap-target flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-leaf-light">
                  {column.title}
                  <ChevronDown className="size-4 transition-transform" aria-hidden />
                </summary>
                <ul className="mb-3 mt-1 space-y-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="-mx-2 block rounded px-2 py-2 text-sm text-cream-100/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>

              {/* Desktop: always open */}
              <div className="hidden md:block">
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-light">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="-mx-2 block rounded px-2 py-2 text-sm text-cream-100/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          ))}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-light">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="flex items-start gap-2.5 text-cream-100/80 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />
                  {config.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${config.contactPhone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2.5 text-cream-100/80 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />
                  {config.contactPhone}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${config.socialHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-cream-100/80 transition-colors hover:text-white"
                >
                  <Instagram className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />
                  {config.socialHandle}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-cream-100/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />
                Nnenna Otti Bus Terminal,
                <br />
                Umuahia, Abia State
              </li>
            </ul>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1EBE5A]"
            >
              <MessageCircle className="size-4" aria-hidden />
              Book on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:pt-7 text-xs text-cream-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ecojindu Shuttle. All rights reserved.</p>
          <p>Operated in partnership with Abia State · Powered by 100% electric vehicles.</p>
        </div>
      </div>
    </footer>
  );
}
