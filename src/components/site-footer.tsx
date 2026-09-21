import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { LeafMark } from "@/components/brand";
import { config, whatsappLink } from "@/lib/config";

const COLUMNS = [
  {
    title: "Travel",
    links: [
      { href: "/", label: "Book a seat" },
      { href: "/search", label: "Timetable" },
      { href: "/charter", label: "Charter a vehicle" },
      { href: "/subscriptions", label: "Ride subscriptions" },
      { href: "/manage", label: "Manage a booking" },
      { href: "/trips", label: "My trips" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#green", label: "Our EV fleet" },
      { href: "/help", label: "Help & FAQ" },
    ],
  },
];

/**
 * Footer columns: one heading in the accessibility tree.
 * Mobile uses a visually-hidden h2 + details; desktop shows the same heading.
 */
export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-cream-300 bg-forest text-cream-100 sm:mt-16">
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
              Scheduled, zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe Airport —
              on a fixed timetable you can plan a flight around.
            </p>
            <p className="mt-3 text-sm font-semibold text-leaf-light sm:mt-5">
              Bridging Cities, Powering Green Mobility.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-labelledby={`footer-${column.title}`}>
              <h2
                id={`footer-${column.title}`}
                className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-light"
              >
                {column.title}
              </h2>

              {/* Mobile: collapsible list under the same heading */}
              <details className="md:hidden [&[open]_summary_span]:rotate-180">
                <summary className="tap-target flex cursor-pointer list-none items-center justify-between py-2 text-sm text-cream-100/80">
                  Show links
                  <span className="inline-block transition-transform" aria-hidden>
                    ▾
                  </span>
                </summary>
                <ul className="mb-3 space-y-1">
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

              <ul className="mt-4 hidden space-y-1 md:block">
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
                <span>
                  Nnenna Otti Bus Terminal,
                  <br />
                  Umuahia, Abia State
                </span>
              </li>
            </ul>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-[#0B3D1F] transition-colors hover:bg-[#1EBE5A] hover:text-[#062816]"
            >
              <MessageCircle className="size-4" aria-hidden />
              Book on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream-100/55 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-7">
          <p>© {new Date().getFullYear()} Ecojindu Shuttle. All rights reserved.</p>
          <p>Operated in partnership with Abia State · Powered by 100% electric vehicles.</p>
        </div>
      </div>
    </footer>
  );
}
