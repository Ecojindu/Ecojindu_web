"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, CircleHelp, CreditCard, Ticket } from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Book", icon: Bus, match: (p: string) => p === "/" || p.startsWith("/search") || p.startsWith("/book") },
  { href: "/trips", label: "My Trips", icon: Ticket, match: (p: string) => p.startsWith("/trips") || p.startsWith("/dashboard") || p.startsWith("/manage") || p.startsWith("/booking") },
  { href: "/subscriptions", label: "Plans", icon: CreditCard, match: (p: string) => p.startsWith("/subscriptions") },
  { href: "/help", label: "Help", icon: CircleHelp, match: (p: string) => p.startsWith("/help") },
] as const;

/** Hide bottom nav on full-screen checkout / auth where a second nav fights the CTA. */
const HIDE_ON = ["/auth", "/booking/callback"];

export function BottomNav() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300/90 bg-cream-50/95 backdrop-blur-md dark:border-white/15 dark:bg-[var(--surface-raised)]/95 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "tap-target flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition-colors",
                  active ? "text-moss dark:text-leaf-light font-bold" : "text-ink-muted dark:text-cream-100/75 font-semibold",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("size-5", active && "stroke-[2.25]")} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
