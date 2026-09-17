import type { Metadata } from "next";
import Link from "next/link";

import { CharterPageClient } from "./charter-client";
import { config } from "@/lib/config";
import { productConfig } from "@/lib/product-config";
import { getRoutes } from "@/lib/server-api";
import { naira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Charter a vehicle",
  description:
    "Request a private Ecojindu EV for groups. Route, date, passengers — we call you back with a quote.",
};

export default async function CharterPage() {
  const routes = await getRoutes();
  const charterRoutes = (routes ?? []).filter(
    (r) => r.is_active && (r.service_type === "charter" || r.charter_fare_kobo),
  );

  return (
    <div>
      <div className="container max-w-2xl pt-8 sm:pt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Charter</p>
        <h1 className="mt-2 text-display-sm font-extrabold text-forest dark:text-cream-50">
          Private EV for your group
        </h1>
        <p className="mt-2 text-ink-muted">
          Tell us the route, date, passenger count and a callback number. If we can quote instantly
          from published rules, you will see an estimate — otherwise operations call you back.
        </p>
        {charterRoutes.length ? (
          <ul className="mt-4 space-y-2 text-sm">
            {charterRoutes.slice(0, 4).map((route) => (
              <li
                key={route.id}
                className="flex justify-between rounded-xl border border-cream-300 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-forest/40"
              >
                <span className="font-medium text-forest dark:text-cream-100">{route.name}</span>
                <span className="font-bold tabular">
                  {route.charter_fare_kobo
                    ? `from ${naira(route.charter_fare_kobo)}`
                    : "Quote on request"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink-muted">
            Single seats are {naira(productConfig.singleFareKobo)}. For a full vehicle, submit the
            form below or email{" "}
            <a className="font-semibold text-moss" href={`mailto:${config.contactEmail}`}>
              {config.contactEmail}
            </a>
            .
          </p>
        )}
        <p className="mt-3 text-sm">
          Already requested?{" "}
          <Link href="/charter/lookup" className="font-semibold text-moss underline-offset-2 hover:underline">
            Look up your charter
          </Link>
        </p>
      </div>
      <CharterPageClient />
    </div>
  );
}
