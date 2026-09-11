"use client";

import Link from "next/link";
import { ArrowRight, BatteryCharging, Clock, Users } from "lucide-react";

import { StopConnector } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, durationLabel, formatTime, naira, seatsBadge } from "@/lib/utils";
import type { Trip } from "@/lib/types";

const TONE_VARIANT = {
  plenty: "leaf",
  limited: "amber",
  scarce: "clay",
  none: "neutral",
} as const;

export function TripCard({
  trip,
  seats = 1,
  male = 0,
  female = 0,
}: {
  trip: Trip;
  seats?: number;
  male?: number;
  female?: number;
}) {
  const badge = seatsBadge(trip.seats_available);
  const soldOut = !trip.is_bookable || trip.seats_available < seats;
  const arrival = trip.arrival_estimate;
  const total = trip.fare_kobo * seats;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-soft transition-all duration-200 sm:p-6",
        soldOut
          ? "border-cream-300 opacity-75"
          : "border-cream-300 hover:-translate-y-0.5 hover:border-leaf/40 hover:shadow-lift",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="tabular text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
              {formatTime(trip.departure_datetime)}
            </p>
            {arrival && (
              <>
                <span className="text-ink-soft" aria-hidden>
                  →
                </span>
                <p className="tabular text-lg font-bold text-ink-muted">{formatTime(arrival)}</p>
              </>
            )}
          </div>
          <p className="mt-1 truncate text-sm font-medium text-ink-muted">{trip.route_name}</p>
        </div>

        <Badge variant={TONE_VARIANT[badge.tone]} className="shrink-0">
          {soldOut && trip.seats_available > 0 ? `Only ${trip.seats_available} left` : badge.label}
        </Badge>
      </div>

      {/* Origin → destination, with the transit-line motif */}
      <div className="mt-5 flex items-center gap-3">
        <span className="max-w-[38%] truncate text-xs font-semibold text-ink-muted">
          {trip.origin_terminal.split(",")[0]}
        </span>
        <StopConnector className="flex-1" />
        <span className="max-w-[38%] truncate text-right text-xs font-semibold text-ink-muted">
          {trip.destination.split(",")[0]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {durationLabel(trip.duration_mins)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {trip.seats_available} of {trip.seats_total} seats
        </span>
        {trip.vehicle_model && (
          <span className="inline-flex items-center gap-1.5">
            <BatteryCharging className="size-3.5 text-teal" aria-hidden />
            {trip.vehicle_model}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-cream-200 pt-4">
        <div>
          <p className="tabular text-2xl font-extrabold text-forest">{naira(total)}</p>
          <p className="text-xs text-ink-soft">
            {seats > 1 ? `${seats} seats · ${naira(trip.fare_kobo)} each` : "per seat"}
          </p>
        </div>

        {soldOut ? (
          <Button disabled size="md" variant="secondary">
            Sold out
          </Button>
        ) : (
          <Button asChild size="md">
            <Link href={`/book/${trip.id}?seats=${seats}&male=${male}&female=${female}`}>
              Select
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
