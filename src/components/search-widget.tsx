"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowRightLeft,
  Bus,
  CalendarDays,
  Info,
  MapPin,
  Minus,
  Plane,
  Plus,
  Search,
  TrainFront,
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
  { id: "rail", label: "Railways Transfers", shortLabel: "Rail", icon: TrainFront, live: false },
  { id: "charter", label: "Charter", shortLabel: "Charter", icon: Bus, live: true },
];

/**
 * The front door.
 *
 * Service type replaces the usual one-way/return control, because every Ecojindu
 * route is a single direction in its own right — there was never a return to toggle.
 *
 * Passengers are counted by sex rather than as a single total: the state partner
 * needs the demographic split, and collecting it here means it's never a surprise
 * later in the flow.
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
  const [male, setMale] = React.useState(1);
  const [female, setFemale] = React.useState(0);

  const seats = male + female;
  const bookable = (routes ?? []).filter((r) => r.service_type === "airport");

  React.useEffect(() => {
    if (!routeId && bookable.length) setRouteId(bookable[0].id);
  }, [bookable, routeId]);

  const selected = bookable.find((r) => r.id === routeId);
  const reverse = selected ? findReverse(bookable, selected) : undefined;
  const total = selected ? selected.base_fare_kobo * seats : 0;

  function adjust(setter: (n: number) => void, current: number, delta: number) {
    const next = current + delta;
    if (next < 0) return;
    if (seats + delta > MAX_SEATS) return;
    setter(next);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!routeId || seats < 1) return;

    if (service === "charter") {
      router.push(`/charter?route=${routeId}&date=${date}&passengers=${seats}`);
      return;
    }
    router.push(
      `/search?route=${routeId}&date=${date}&seats=${seats}&male=${male}&female=${female}`,
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
          <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "lg:grid-cols-[1.6fr_1fr]")}>
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
          </div>

          {/* ── Passengers by sex ── */}
          <fieldset className="mt-3">
            <legend className="mb-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
              Passengers
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <Counter
                label="Male"
                tone="male"
                value={male}
                onChange={(d) => adjust(setMale, male, d)}
                canAdd={seats < MAX_SEATS}
              />
              <Counter
                label="Female"
                tone="female"
                value={female}
                onChange={(d) => adjust(setFemale, female, d)}
                canAdd={seats < MAX_SEATS}
              />
            </div>
          </fieldset>

          {/* ── Why we ask ── */}
          <p className="mt-3 flex items-start gap-2.5 rounded-xl bg-teal/[0.08] px-3.5 py-3 text-[13px] leading-relaxed text-ink-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden />
            <span>
              Booking for someone else? Please select the passenger&apos;s sex.
            </span>
          </p>

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
                    {selected && ` · ${naira(selected.base_fare_kobo)} each`}
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

function Counter({
  label,
  tone,
  value,
  onChange,
  canAdd,
}: {
  label: string;
  tone: "male" | "female";
  value: number;
  onChange: (delta: number) => void;
  canAdd: boolean;
}) {
  const accent =
    tone === "male"
      ? "border-[#3E6BB5]/35 bg-[#3E6BB5]/[0.06]"
      : "border-[#9B5AA8]/35 bg-[#9B5AA8]/[0.06]";
  const dot = tone === "male" ? "bg-[#3E6BB5]" : "bg-[#9B5AA8]";

  return (
    <div className={cn("rounded-xl border-2 px-3 py-2.5", accent)}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", dot)} aria-hidden />
        <span className="text-xs font-bold text-ink-muted">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => onChange(-1)}
          disabled={value <= 0}
          aria-label={`One fewer ${label.toLowerCase()} passenger`}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-forest shadow-soft transition-opacity disabled:opacity-35"
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <span
          className="tabular min-w-[2ch] text-center text-2xl font-extrabold text-forest"
          aria-live="polite"
          aria-label={`${value} ${label.toLowerCase()}`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(1)}
          disabled={!canAdd}
          aria-label={`One more ${label.toLowerCase()} passenger`}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-forest shadow-soft transition-opacity disabled:opacity-35"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
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
