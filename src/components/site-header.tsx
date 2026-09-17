"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, MessageCircle, Moon, Sun, User as UserIcon, X } from "lucide-react";

import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { whatsappLink } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Book" },
  { href: "/trips", label: "My trips" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/help", label: "Help" },
  { href: "/charter", label: "Charter" },
];

function useThemeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem("ejs.theme");
    const preferDark =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(preferDark);
    document.documentElement.classList.toggle("dark", preferDark);
  }, []);

  function toggle() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("ejs.theme", next ? "dark" : "light");
      return next;
    });
  }

  return { dark, toggle };
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const { dark, toggle } = useThemeToggle();

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/80 bg-cream/85 backdrop-blur-md dark:border-white/10 dark:bg-forest-dark/90">
      <div className="container flex h-[60px] items-center justify-between gap-4 sm:h-[68px]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-white text-forest shadow-soft dark:bg-white/10 dark:text-cream-50"
                    : "text-ink-muted hover:text-forest dark:text-cream-100/70 dark:hover:text-cream-50",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="text-[#25D366]" aria-hidden />
              WhatsApp
            </a>
          </Button>
          {user ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/trips">
                  <UserIcon aria-hidden />
                  {user.full_name.split(" ")[0]}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
                <LogOut aria-hidden />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" variant="forest">
              <Link href="/">Book</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggle}
            className="tap-target grid place-items-center rounded-xl text-forest dark:text-cream-50"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="tap-target -mr-2 grid place-items-center rounded-xl text-forest dark:text-cream-50"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-up border-t border-cream-300 bg-cream dark:border-white/10 dark:bg-forest-dark lg:hidden"
        >
          <nav className="container flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="tap-target flex items-center border-b border-cream-300/70 py-4 text-base font-semibold text-forest last:border-0 dark:border-white/10 dark:text-cream-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/manage"
              className="tap-target flex items-center border-b border-cream-300/70 py-4 text-base font-semibold text-forest dark:border-white/10 dark:text-cream-50"
            >
              Manage booking
            </Link>
            <Link
              href="/search"
              className="tap-target flex items-center py-4 text-base font-semibold text-forest dark:text-cream-50"
            >
              Timetable (no flight ticket)
            </Link>
          </nav>
          <div className="container flex flex-col gap-2 pb-5">
            <Button asChild block variant="whatsapp">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                Book on WhatsApp
              </a>
            </Button>
            {user ? (
              <Button block variant="ghost" onClick={signOut}>
                <LogOut aria-hidden />
                Sign out
              </Button>
            ) : (
              <Button asChild block variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
