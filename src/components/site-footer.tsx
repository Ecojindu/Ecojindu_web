import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white pt-16 sm:pt-20 lg:pt-24">
      <footer className="overflow-hidden rounded-t-[1.75rem] bg-[#009E61] pb-[calc(3.5rem+env(safe-area-inset-bottom))] text-white sm:rounded-t-[2rem] lg:pb-0">
        <div className="container">
        <section
          className="px-5 pb-8 pt-9 text-center sm:px-8 sm:pb-10 sm:pt-11"
          aria-labelledby="footer-whatsapp-heading"
        >
          <h2 id="footer-whatsapp-heading" className="text-xl font-extrabold text-white">
            Prefer WhatsApp?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/90">
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
        </section>

        <div className="border-t border-white/15" aria-hidden />

        <div className="py-9 sm:py-14">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] md:gap-10">
          <div>
            <Logo variant="dark" />
            <p className="mt-4 hidden max-w-xs text-pretty text-sm leading-relaxed text-white/90 sm:block">
              Scheduled, zero-emission electric shuttles between Umuahia, Aba and Sam Mbakwe Airport —
              on a fixed timetable you can plan a flight around.
            </p>
            <p className="mt-3 text-sm font-semibold text-white sm:mt-5">
              Bridging Cities, Powering Green Mobility.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-labelledby={`footer-${column.title}`}>
              <h2
                id={`footer-${column.title}`}
                className="text-xs font-bold uppercase tracking-[0.16em] text-white"
              >
                {column.title}
              </h2>

              {/* Mobile: collapsible list under the same heading */}
              <details className="md:hidden [&[open]_summary_span]:rotate-180">
                <summary className="tap-target flex cursor-pointer list-none items-center justify-between py-2 text-sm text-white/90">
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
                        className="-mx-2 block rounded px-2 py-2 text-sm text-white/90 transition-colors hover:text-white"
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
                      className="-mx-2 block rounded px-2 py-2 text-sm text-white/90 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="flex items-start gap-2.5 text-white/90 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                  {config.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${config.contactPhone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2.5 text-white/90 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                  {config.contactPhone}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${config.socialHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-white/90 transition-colors hover:text-white"
                >
                  <Instagram className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                  {config.socialHandle}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/90">
                <MapPin className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                <span>
                  Nnenna Otti Bus Terminal,
                  <br />
                  Umuahia, Abia State
                </span>
              </li>
            </ul>
          </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/80 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-7">
            <p>© {new Date().getFullYear()} Ecojindu Shuttle. All rights reserved.</p>
            <p>Operated in partnership with Abia State · Powered by 100% electric vehicles.</p>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
}
