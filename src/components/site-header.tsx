"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, MessageCircle, User as UserIcon, X } from "lucide-react";

import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { whatsappLink } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/search", label: "Book a trip" },
  { href: "/charter", label: "Charter" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/manage", label: "Manage booking" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  // Close the drawer on navigation, otherwise it lingers over the new page.
  React.useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile drawer is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/80 bg-cream/85 backdrop-blur-md">
      <div className="container flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-white text-forest shadow-soft" : "text-ink-muted hover:text-forest",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="text-[#25D366]" aria-hidden />
              Book on WhatsApp
            </a>
          </Button>

          {user ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard">
                  <UserIcon aria-hidden />
                  {user.full_name.split(" ")[0]}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
                <LogOut aria-hidden />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/search">Book a seat</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="tap-target -mr-2 grid place-items-center rounded-xl text-forest lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-up border-t border-cream-300 bg-cream lg:hidden"
        >
          <nav className="container flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="tap-target flex items-center border-b border-cream-300/70 py-4 text-base font-semibold text-forest last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="container flex flex-col gap-2 pb-5">
            {user ? (
              <>
                <Button asChild block variant="secondary">
                  <Link href="/dashboard">
                    <UserIcon aria-hidden />
                    My dashboard
                  </Link>
                </Button>
                <Button block variant="ghost" onClick={signOut}>
                  <LogOut aria-hidden />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild block>
                  <Link href="/search">Book a seat</Link>
                </Button>
                <Button asChild block variant="outline">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              </>
            )}
            <Button asChild block variant="whatsapp">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                Book on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
