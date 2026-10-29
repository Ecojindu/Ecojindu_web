"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MessageCircle, User as UserIcon, X } from "lucide-react";

import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { whatsappLink } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Left-aligned bars — long, medium, short (reference menu glyph). */
function StaggeredMenuIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("flex w-6 flex-col items-start justify-center gap-[5px]", className)}
      aria-hidden
    >
      <span className="h-0.5 w-6 rounded-full bg-current" />
      <span className="h-0.5 w-[1.125rem] rounded-full bg-current" />
      <span className="h-0.5 w-2.5 rounded-full bg-current" />
    </span>
  );
}

const NAV = [
  { href: "/", label: "Book" },
  { href: "/trips", label: "My trips" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/charter", label: "Charter" },
  { href: "/help", label: "Help" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.removeItem("ejs.theme");
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-hero-tint">
      <div className="container flex h-[60px] items-center justify-between gap-4 sm:h-[68px]">
        <Logo variant="light" className="[&>span:last-child>span:last-child]:!text-white" />

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
                    ? "bg-white/20 text-white shadow-soft ring-1 ring-white/25"
                    : "text-white/85 hover:bg-white/10 hover:text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/trips">
                  <UserIcon aria-hidden />
                  {user.full_name.split(" ")[0]}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white"
                onClick={signOut}
                aria-label="Sign out"
              >
                <LogOut aria-hidden />
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            className="bg-white px-5 font-bold text-hero-tint shadow-soft hover:bg-white/90"
          >
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

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="tap-target -mr-2 grid place-items-center rounded-xl text-white"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="size-6 transition-transform duration-200" aria-hidden />
            ) : (
              <StaggeredMenuIcon />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "border-t border-white/15 bg-hero-tint transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
              !open && "pointer-events-none",
            )}
          >
            <nav className="container flex flex-col py-3" aria-label="Mobile">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? undefined : -1}
                  className="tap-target flex items-center border-b border-white/15 py-4 text-base font-semibold text-white last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/manage"
                tabIndex={open ? undefined : -1}
                className="tap-target flex items-center border-b border-white/15 py-4 text-base font-semibold text-white"
              >
                Manage booking
              </Link>
              <Link
                href="/search"
                tabIndex={open ? undefined : -1}
                className="tap-target flex items-center py-4 text-base font-semibold text-white"
              >
                Timetable (no flight ticket)
              </Link>
            </nav>
            <div className="container flex flex-col gap-2 pb-5">
              <Button
                asChild
                block
                className="bg-white font-bold text-hero-tint shadow-soft hover:bg-white/90"
              >
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden />
                  Book on WhatsApp
                </a>
              </Button>
              {user ? (
                <Button
                  block
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                  onClick={signOut}
                >
                  <LogOut aria-hidden />
                  Sign out
                </Button>
              ) : (
                <Button
                  asChild
                  block
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
