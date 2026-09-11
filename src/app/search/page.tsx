"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarX2, MapPin, MessageCircle, TriangleAlert } from "lucide-react";

import { DateSwitcher } from "@/components/date-switcher";
import { SearchWidget } from "@/components/search-widget";
import { TripCard } from "@/components/trip-card";
import { Alert, EmptyState } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TripListSkeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { whatsappLink } from "@/lib/config";
import { addDaysISO, formatDateLong, todayISO } from "@/lib/utils";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <TripListSkeleton />
      </div>
    </div>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();

  const routeId = params.get("route") ?? "";
  const date = params.get("date") ?? todayISO();
  const seats = Number(params.get("seats") ?? 1);
  const male = Number(params.get("male") ?? 0);
  const female = Number(params.get("female") ?? 0);

  const { data: routes } = useQuery({
    queryKey: ["routes"],
    queryFn: api.routes,
    staleTime: 10 * 60_000,
  });

  const route = routes?.find((r) => r.id === routeId);

  const {
    data: trips,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["trips", routeId, date, seats],
    queryFn: () => api.trips({ route_id: routeId, service_date: date, seats }),
    enabled: Boolean(routeId),
    // Seat counts are live; refresh whenever the tab is revisited.
    staleTime: 20_000,
  });

  const { data: calendar } = useQuery({
    queryKey: ["availability", routeId],
    queryFn: () => api.availabilityCalendar(routeId, 10),
    enabled: Boolean(routeId),
    staleTime: 60_000,
  });

  function setDate(next: string) {
    router.replace(
      `/search?route=${routeId}&date=${next}&seats=${seats}&male=${male}&female=${female}`,
      { scroll: false },
    );
  }

  if (!routeId) {
    return (
      <div className="container py-10 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-display-sm font-extrabold text-forest">Find your departure</h1>
          <p className="mt-2 text-ink-muted">
            Choose a route and a date to see every seat still available.
          </p>
          <SearchWidget className="mt-6" />
        </div>
      </div>
    );
  }

  const bookable = (trips ?? []).filter((t) => t.is_bookable && t.seats_available >= seats);
  const soldOut = (trips ?? []).filter((t) => !bookable.includes(t));

  return (
    <div className="container py-8 lg:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-forest sm:text-display-sm">
            <MapPin className="size-6 shrink-0 text-moss" aria-hidden />
            <span className="text-balance">{route?.name ?? "Departures"}</span>
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            {formatDateLong(`${date}T09:00:00+01:00`)}
            {seats > 1 && ` · ${seats} seats`}
          </p>
        </div>

        {/* Change search */}
        <details className="group mb-6">
          <summary className="tap-target inline-flex cursor-pointer list-none items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-forest shadow-soft transition-shadow hover:shadow-lift">
            Change route, date or seats
            <span className="text-moss transition-transform group-open:rotate-180" aria-hidden>
              ▾
            </span>
          </summary>
          <SearchWidget className="mt-3" defaultRouteId={routeId} defaultDate={date} />
        </details>

        {/* Date strip */}
        <div className="mb-7">
          <DateSwitcher value={date} onChange={setDate} availability={calendar} />
        </div>

        {/* Results */}
        {isLoading ? (
          <TripListSkeleton />
        ) : isError ? (
          <Alert variant="error" title="We couldn't load departures">
            <p>{(error as Error)?.message ?? "Something went wrong."}</p>
            <Button size="sm" variant="danger" className="mt-3" onClick={() => refetch()}>
              Try again
            </Button>
          </Alert>
        ) : bookable.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No seats left on this date"
            description={
              soldOut.length > 0
                ? `All ${soldOut.length} departures on this date are full. Try the next day — we run four shuttles daily.`
                : "There are no departures published for this date yet. Try another day."
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => setDate(addDaysISO(date, 1))}>Try the next day</Button>
                <Button asChild variant="outline">
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden />
                    Ask on WhatsApp
                  </a>
                </Button>
              </div>
            }
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink-muted" aria-live="polite">
                {bookable.length} departure{bookable.length === 1 ? "" : "s"} available
              </p>
              {isFetching && <span className="text-xs text-ink-soft">Refreshing…</span>}
            </div>

            <div className="space-y-4">
              {bookable.map((trip) => (
                <TripCard key={trip.id} trip={trip} seats={seats} male={male} female={female} />
              ))}
            </div>

            {soldOut.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-soft">
                  <TriangleAlert className="size-4" aria-hidden />
                  Not available for {seats} seat{seats === 1 ? "" : "s"}
                </p>
                <div className="space-y-4">
                  {soldOut.map((trip) => (
                    <TripCard key={trip.id} trip={trip} seats={seats} male={male} female={female} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-center text-xs leading-relaxed text-ink-soft">
          Fares are per seat and include all charges. Free cancellation up to 2 hours before
          departure.
        </p>
      </div>
    </div>
  );
}
