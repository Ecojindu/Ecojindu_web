import type { Metadata } from "next";
import Link from "next/link";

import { SearchPageClient } from "./search-client";
import { productConfig } from "@/lib/product-config";
import { getRoutes, getTrips } from "@/lib/server-api";
import { naira, todayISO } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Timetable",
  description:
    "Browse Ecojindu Shuttle departures from Umuahia and Aba to Sam Mbakwe Airport. Fixed fares, live seat counts.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const routeId = typeof searchParams.route === "string" ? searchParams.route : "";
  const date =
    typeof searchParams.date === "string" && searchParams.date ? searchParams.date : todayISO();
  const seats = Number(typeof searchParams.seats === "string" ? searchParams.seats : 1) || 1;

  const routes = await getRoutes();
  const route = routes?.find((r) => r.id === routeId);
  const trips = routeId
    ? await getTrips({ route_id: routeId, service_date: date, seats })
    : null;

  const fareHint =
    route && route.base_fare_kobo > 0
      ? route.base_fare_kobo
      : productConfig.singleFareKobo;

  return (
    <div>
      {/* Server-rendered summary — useful without JavaScript */}
      <noscript>
        <div className="container max-w-3xl py-8">
          <h1 className="text-2xl font-extrabold text-forest">
            {route?.name ?? "Find your departure"}
          </h1>
          <p className="mt-2 text-ink-muted">
            Fares from {naira(fareHint)}. Enable JavaScript to book, or{" "}
            <Link href="/" className="font-semibold text-moss underline">
              use Upload &amp; Go
            </Link>
            .
          </p>
          {trips?.length ? (
            <ul className="mt-6 space-y-3">
              {trips.map((trip) => (
                <li key={trip.id} className="rounded-xl border border-cream-300 bg-white p-4">
                  <p className="font-bold text-forest">
                    {trip.departure_datetime} · {naira(trip.fare_kobo || fareHint)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {trip.seats_available} seats · {trip.origin_terminal} → {trip.destination}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">
              Choose a route on the interactive timetable, or message us on WhatsApp.
            </p>
          )}
        </div>
      </noscript>

      <SearchPageClient
        initialRouteName={route?.name ?? null}
        initialTripCount={trips?.length ?? null}
      />
    </div>
  );
}
