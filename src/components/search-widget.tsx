"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowRightLeft,
  Bus,
  CalendarDays,
  MapPin,
  Plane,
  Search,
  TrainFront,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { productConfig } from "@/lib/product-config";
import { addDaysISO, cn, naira, todayISO } from "@/lib/utils";
import type { Route, ServiceType } from "@/lib/types";

const MAX_SEATS = 6;
/** Above this, it's a group booking — flagged so operations can offer terms. */
const GROUP_THRESHOLD = 4;

const SERVICES: {
  id: ServiceType;
  label: string;
  /** Three full labels don't fit a 375px screen, so phones get the short form. */
  shortLabel: string;
  icon: typeof Plane;
  live: boolean;
}[] = [
  { id: "airport", label: "Airport Transfers", shortLabel: "Airport", icon: Plane, live: true },
  { id: "rail", label: "Railways Transfers", shortLabel: "Rail", icon: TrainFront, live: productConfig.railTransfersLive },
  { id: "charter", label: "Charter", shortLabel: "Charter", icon: Bus, live: true },
];

/**
 * The front door.
 *
 * Service type replaces the usual one-way/return control, because every Ecojindu
 * route is a single direction in its own right — there was never a return to toggle.
 */
export function SearchWidget({
  className,
  defaultRouteId,
  defaultDate,
  compact = false,
}: {
  className?: string;
  defaultRouteId?: string;
  defaultDate?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const today = todayISO();

  const { data: routes, isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: api.routes,
    staleTime: 10 * 60_000,
  });

  const [service, setService] = React.useState<ServiceType>("airport");
  const [routeId, setRouteId] = React.useState(defaultRouteId ?? "");
  const [date, setDate] = React.useState(defaultDate ?? today);
  const [seats, setSeats] = React.useState(1);

  const bookable = (routes ?? []).filter((r) => r.service_type === "airport");

  React.useEffect(() => {
    if (!routeId && bookable.length) setRouteId(bookable[0].id);
  }, [bookable, routeId]);

  const selected = bookable.find((r) => r.id === routeId);
  const reverse = selected ? findReverse(bookable, selected) : undefined;
  // Never show ₦0 while at least one seat is intended — fall back to published fare.
  const fareKobo =
    selected?.base_fare_kobo && selected.base_fare_kobo > 0
      ? selected.base_fare_kobo
      : productConfig.singleFareKobo;
  const displaySeats = Math.max(1, seats);
  const total = fareKobo * displaySeats;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!routeId || seats < 1) return;

    if (service === "charter") {
      router.push(`/charter?route=${routeId}&date=${date}&passengers=${seats}`);
      return;
    }
    router.push(
      `/search?route=${routeId}&date=${date}&seats=${seats}`,
    );
  }

  const activeService = SERVICES.find((s) => s.id === service)!;

  return (
    <form
      onSubmit={submit}
      className={cn("rounded-3xl border border-cream-300 bg-white p-3 shadow-lift sm:p-5", className)}
      aria-label="Find a departure"
    >
      {/* ── Service type ── */}
      <div
        className="mb-4 flex gap-1 rounded-2xl bg-cream-100 p-1.5 sm:gap-1.5"
        role="tablist"
        aria-label="Service type"
      >
        {SERVICES.map((item) => {
          const active = service === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={!item.live}
              onClick={() => item.live && setService(item.id)}
              title={item.live ? undefined : "Coming soon"}
              className={cn(
                "tap-target relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2",
                "text-[13px] font-bold transition-all sm:gap-2 sm:px-3 sm:text-sm",
                active && "bg-white text-forest shadow-soft",
                !active && item.live && "text-ink-muted hover:text-forest",
                !item.live && "cursor-not-allowed text-ink-soft/50",
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap sm:hidden">{item.shortLabel}</span>
              <span className="hidden whitespace-nowrap sm:inline">{item.label}</span>
              {!item.live && (
                <span className="ml-0.5 hidden rounded-full bg-cream-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft md:inline">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {service === "rail" ? (
        <ComingSoon />
      ) : (
        <>
          <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "lg:grid-cols-[1.5fr_1fr_1fr]")}>
            {/* Route */}
            <div className="min-w-0">
              <label
                htmlFor="route"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft"
              >
                <MapPin className="size-3.5" aria-hidden />
                From → To
              </label>
              {isLoading ? (
                <Skeleton className="h-14 w-full rounded-xl" />
              ) : (
                <Select value={routeId} onValueChange={setRouteId}>
                  <SelectTrigger id="route" aria-label="Choose your route">
                    <SelectValue placeholder="Choose your route" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookable.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {shortRouteLabel(route)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Date */}
            <div className="min-w-0">
              <label
                htmlFor="date"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft"
              >
                <CalendarDays className="size-3.5" aria-hidden />
                Travel date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                min={today}
                max={addDaysISO(today, 60)}
                onChange={(e) => setDate(e.target.value)}
                className="h-14 w-full rounded-xl border-2 border-cream-300 bg-white px-4 text-base text-ink focus:border-moss focus:outline-none"
              />
            </div>

            {/* Passengers */}
            <div className="min-w-0">
              <label
                htmlFor="passengers"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft"
              >
                <Users className="size-3.5" aria-hidden />
                Passengers
              </label>
              <Select value={String(seats)} onValueChange={(v) => setSeats(Number(v))}>
                <SelectTrigger id="passengers" aria-label="Number of passengers">
                  <SelectValue placeholder="1 Passenger" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Total + submit ── */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div aria-live="polite">
              {service === "charter" ? (
                <p className="text-sm text-ink-muted">
                  Whole-vehicle hire ·{" "}
                  <span className="font-semibold text-forest">{seats} passengers</span>
                </p>
              ) : (
                <>
                  <p className="tabular text-2xl font-extrabold leading-none text-forest">
                    {naira(total)}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {seats} {seats === 1 ? "seat" : "seats"}
                    {` · ${naira(fareKobo)} each`}
                  </p>
                </>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={!routeId || seats < 1}
            >
              {service === "charter" ? (
                <>
                  <Bus aria-hidden />
                  Request a quote
                </>
              ) : (
                <>
                  <Search aria-hidden />
                  Search departures
                </>
              )}
              <ArrowRight className="hidden sm:block" aria-hidden />
            </Button>
          </div>

          {seats > GROUP_THRESHOLD && service !== "charter" && (
            <p className="mt-3 rounded-xl bg-leaf/[0.10] px-3.5 py-2.5 text-[13px] leading-relaxed text-moss-dark">
              That&apos;s a group booking — we may be able to offer you better terms.{" "}
              <button
                type="button"
                onClick={() => setService("charter")}
                className="font-bold underline underline-offset-2"
              >
                Ask about charter instead
              </button>
              .
            </p>
          )}

          {reverse && service !== "charter" && (
            <button
              type="button"
              onClick={() => setRouteId(reverse.id)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold text-moss transition-colors hover:text-moss-dark"
            >
              <ArrowRightLeft className="size-3.5" aria-hidden />
              Swap direction — {shortRouteLabel(reverse)}
            </button>
          )}
        </>
      )}

      <span className="sr-only" aria-live="polite">
        {activeService.label} selected
      </span>
    </form>
  );
}

function ComingSoon() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-cream-400 px-6 py-10 text-center">
      <TrainFront className="mx-auto size-8 text-ink-soft" aria-hidden />
      <p className="mt-3 text-base font-bold text-forest">Railways transfers are coming</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
        We&apos;re working on connecting the rail terminus to the same fixed timetable. Airport
        transfers are running today.
      </p>
    </div>
  );
}

function shortRouteLabel(route: Route) {
  const origin = route.origin_terminal
    .split(",")[0]
    .replace(/Bus Terminal|Central Terminal/i, "")
    .trim();
  const dest = /airport/i.test(route.destination)
    ? "Sam Mbakwe Airport"
    : route.destination.split(",").slice(-1)[0].trim();
  return `${origin || route.origin_terminal} → ${dest}`;
}

/** The same corridor in the opposite direction. */
function findReverse(routes: Route[], route: Route) {
  return routes.find(
    (candidate) =>
      candidate.id !== route.id &&
      candidate.origin_terminal === route.destination &&
      candidate.destination === route.origin_terminal,
  );
}
