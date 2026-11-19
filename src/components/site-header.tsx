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
  { href: "/book", label: "Book a seat" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/trips", label: "My trips" },
  { href: "/charter", label: "Charter" },
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
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/15 bg-hero-tint/95 backdrop-blur-md">
        <div className="container flex h-[60px] items-center justify-between gap-4 sm:h-[68px]">
          <Logo variant="light" />

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
                      : "text-white hover:bg-white/10 hover:text-white",
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
              className="bg-leaf px-5 font-bold text-hero-tint shadow-soft hover:bg-white/90"
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
              className="tap-target -mr-2 relative grid size-10 place-items-center rounded-xl text-white focus:outline-none"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative size-6">
                <X
                  className={cn(
                    "absolute inset-0 size-6 transition-all duration-300 ease-in-out",
                    open ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75",
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
                    open ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100",
                  )}
                >
                  <StaggeredMenuIcon />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu overlay — displays ON TOP of the page with smooth slide & fade */}
        <div
          id="mobile-menu"
          className={cn(
            "absolute left-0 right-0 top-full z-50 border-b border-white/15 bg-hero-tint/95 shadow-2xl backdrop-blur-xl lg:hidden",
            "max-h-[calc(100dvh-60px)] sm:max-h-[calc(100dvh-68px)] overflow-y-auto",
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top",
            open
              ? "translate-y-0 opacity-100 visible pointer-events-auto"
              : "-translate-y-5 opacity-0 invisible pointer-events-none",
          )}
          aria-hidden={!open}
        >
          <div
            className={cn(
              "border-t border-white/10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open ? "translate-y-0" : "-translate-y-2",
            )}
          >
            <nav className="container flex flex-col py-2" aria-label="Mobile">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? undefined : -1}
                  className="tap-target flex items-center border-b border-white/15 py-3.5 text-base font-semibold text-white transition-colors hover:text-leaf active:text-leaf last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/manage"
                tabIndex={open ? undefined : -1}
                className="tap-target flex items-center border-b border-white/15 py-3.5 text-base font-semibold text-white transition-colors hover:text-leaf active:text-leaf"
              >
                Manage booking
              </Link>
              <Link
                href="/search"
                tabIndex={open ? undefined : -1}
                className="tap-target flex items-center py-3.5 text-base font-semibold text-white transition-colors hover:text-leaf active:text-leaf"
              >
                Timetable (no flight ticket)
              </Link>
            </nav>
            <div className="container flex flex-col gap-2.5 pb-6 pt-2">
              <Button
                asChild
                block
                className="bg-leaf font-bold text-hero-tint shadow-soft transition-transform active:scale-[0.98] hover:bg-white/90"
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
      </header>

      {/* Spacer to preserve document flow under fixed header */}
      <div className="h-[60px] sm:h-[68px]" aria-hidden="true" />

      {/* Backdrop overlay: smoothly fades in and out; tapping closes the menu */}
      <div
        className={cn(
          "fixed inset-0 top-[60px] z-40 bg-black/50 backdrop-blur-sm sm:top-[68px] lg:hidden",
          "transition-opacity duration-300 ease-in-out",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
