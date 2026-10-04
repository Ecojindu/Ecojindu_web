"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";

import { whatsappLink } from "@/lib/config";

/**
 * Persistent booking bar, mobile only.
 *
 * Gideon's note was that booking has to be reachable without scrolling back up.
 * This keeps the two things a passenger actually wants — book, or ask on
 * WhatsApp — within thumb reach on every page.
 *
 * Hidden on pages that *are* the booking flow, where a second "Book" button
 * would compete with the real call to action.
 */
const HIDE_ON = ["/book", "/booking", "/charter", "/auth"];

export function MobileActionBar() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-300 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-forest-dark/95 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container flex gap-2 py-2.5">
        <Link
          href="/search"
          className="tap-target flex flex-[2] items-center justify-center gap-2 rounded-full bg-moss text-sm font-bold text-white shadow-soft active:scale-[0.98]"
        >
          <Search className="size-4" aria-hidden />
          Book a seat
        </Link>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-[#0B3D1F] shadow-soft active:scale-[0.98]"
        >
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
