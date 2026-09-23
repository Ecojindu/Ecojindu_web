"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronDown, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { productConfig, type PickupCity } from "@/lib/product-config";
import type { Route } from "@/lib/types";
import { cn, todayISO } from "@/lib/utils";

const PICKUP_KEY = "ejs.pickup_city";
const PLAN_EXTRAS_KEY = "ejs.plan_trip_extras";

function rememberPickup(city: PickupCity) {
  if (typeof window !== "undefined") window.localStorage.setItem(PICKUP_KEY, city);
}

function passengerLabel(count: number) {
  return count === 1 ? "1 passenger" : `${count} passengers`;
}

function routeMatchesCity(route: Route, city: PickupCity) {
  const hay = `${route.origin_terminal} ${route.name}`.toLowerCase();
  return city === "Aba" ? hay.includes("aba") : hay.includes("umuahia");
}

function routeDirection(route: Route): "to_airport" | "from_airport" {
  return /airport/i.test(route.destination) ? "to_airport" : "from_airport";
}

const fieldLabel =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-cream-100/70";

interface PlanTripHomeFoamProps {
  className?: string;
}

export function PlanTripHomeFoam({ className }: PlanTripHomeFoamProps) {
  const router = useRouter();
  const today = todayISO();

  const { data: routes, isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: api.routes,
    staleTime: 10 * 60_000,
  });

  const bookable = (routes ?? []).filter((r) => r.service_type === "airport" && r.is_active);

  const [pickupCity, setPickupCity] = React.useState<PickupCity>("Umuahia");
  const [direction, setDirection] = React.useState<"to_airport" | "from_airport">("to_airport");
  const [date, setDate] = React.useState(today);
  const [seats, setSeats] = React.useState(1);
  const [showNoRouteMessage, setShowNoRouteMessage] = React.useState(false);
  const [showOptional, setShowOptional] = React.useState(false);
  const [flightTime, setFlightTime] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const routeId = React.useMemo(() => {
    const match = bookable.filter(
      (r) => routeMatchesCity(r, pickupCity) && routeDirection(r) === direction,
    );
    return match[0]?.id ?? "";
  }, [bookable, pickupCity, direction]);

  React.useEffect(() => {
    if (routeId) setShowNoRouteMessage(false);
  }, [routeId]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (seats < 1 || isLoading) return;

    if (!routeId) {
      setShowNoRouteMessage(true);
      return;
    }

    setShowNoRouteMessage(false);
    rememberPickup(pickupCity);
    sessionStorage.setItem(
      PLAN_EXTRAS_KEY,
      JSON.stringify({
        flight_time: flightTime.trim() || null,
        phone: phone.trim() || null,
        notes: notes.trim() || null,
      }),
    );
    router.push(`/search?route=${routeId}&date=${date}&seats=${seats}`);
  }

  function onPickupCityChange(city: PickupCity) {
    setPickupCity(city);
    setShowNoRouteMessage(false);
  }

  function onDirectionChange(value: "to_airport" | "from_airport") {
    setDirection(value);
    setShowNoRouteMessage(false);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-3xl border border-cream-300 bg-white p-5 shadow-soft dark:border-white/20 dark:bg-forest/40",
        className,
      )}
      aria-label="Plan a trip without a flight ticket"
    >
      <p className="text-base font-bold text-forest dark:text-cream-50">Plan your trip</p>
      <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/75">
        Pick city, date, and seats — we&apos;ll show the next departures.
      </p>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <span className={fieldLabel}>Pickup city</span>
            <Select value={pickupCity} onValueChange={(v) => onPickupCityChange(v as PickupCity)}>
              <SelectTrigger className="h-12 w-full" aria-label="Pickup city">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productConfig.pickupCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-0">
            <span className={fieldLabel}>Direction</span>
            <Select
              value={direction}
              onValueChange={(v) => onDirectionChange(v as "to_airport" | "from_airport")}
            >
              <SelectTrigger className="h-12 w-full" aria-label="Travel direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to_airport">To Sam Mbakwe Airport</SelectItem>
                <SelectItem value="from_airport">From Sam Mbakwe Airport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="plan-date" className={cn(fieldLabel, "flex items-center gap-1.5")}>
              <CalendarDays className="size-3.5" aria-hidden />
              Travel date
            </label>
            <div className="relative">
              <input
                id="plan-date"
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className={cn(
                  "flex h-12 w-full rounded-xl border-2 border-cream-300 bg-white pl-4 pr-11 text-sm font-medium text-forest outline-none",
                  "focus-visible:border-moss focus-visible:ring-2 focus-visible:ring-moss/20",
                  "dark:border-white/20 dark:bg-forest-dark/50 dark:text-cream-50",
                  "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0",
                  "[&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full",
                  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
                )}
                required
              />
              <CalendarDays
                className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted dark:text-cream-100/60"
                aria-hidden
              />
            </div>
          </div>
          <div className="min-w-0">
            <span className={cn(fieldLabel, "flex items-center gap-1.5")}>
              <Users className="size-3.5" aria-hidden />
              Passengers
            </span>
            <Select value={String(seats)} onValueChange={(v) => setSeats(Number(v))}>
              <SelectTrigger id="plan-seats" className="h-12 w-full" aria-label="Passengers">
                <SelectValue placeholder="1 passenger" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {passengerLabel(n)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            showOptional ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="space-y-3 border-t border-cream-200 pt-4 dark:border-white/10">
              <div>
                <label htmlFor="plan-flight-time" className={fieldLabel}>
                  Flight departure time (optional)
                </label>
                <Input
                  id="plan-flight-time"
                  type="time"
                  value={flightTime}
                  onChange={(e) => setFlightTime(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label htmlFor="plan-phone" className={fieldLabel}>
                  Mobile number (optional)
                </label>
                <Input
                  id="plan-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="080XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label htmlFor="plan-notes" className={fieldLabel}>
                  Notes for the team (optional)
                </label>
                <textarea
                  id="plan-notes"
                  rows={2}
                  maxLength={280}
                  placeholder="Extra luggage, pickup detail, delay…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-sm text-forest outline-none focus-visible:border-moss focus-visible:ring-2 focus-visible:ring-moss/20 dark:border-white/20 dark:bg-forest-dark/50 dark:text-cream-50"
                />
              </div>
            </div>
          </div>
        </div>

        {showNoRouteMessage && !routeId && !isLoading ? (
          <p
            className="rounded-xl border border-cream-300 px-3 py-3 text-sm text-ink-muted dark:border-white/15"
            role="alert"
          >
            No shuttle for this city and direction. Try another combination.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setShowOptional((v) => !v)}
        className="mx-auto mt-5 flex items-center gap-1 text-center text-sm font-semibold text-moss underline-offset-4 hover:underline dark:text-leaf-light"
        aria-expanded={showOptional}
      >
        {showOptional ? "Hide optional details" : "Add flight time & contact (optional)"}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none",
            showOptional && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <Button
        type="submit"
        block
        size="lg"
        className="mt-3 w-full bg-hero-tint text-white hover:bg-hero-tint/90"
        disabled={isLoading}
      >
        Find departures
      </Button>
    </form>
  );
}
