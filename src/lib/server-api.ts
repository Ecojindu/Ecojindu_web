import { config } from "./config";
import type { Plan, Route, Trip } from "./types";

/**
 * Server-only catalogue fetches for SSR/SSG. Never import this from client
 * components — use `@/lib/api` there instead.
 */

async function serverGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T | null> {
  const url = new URL(`${config.apiBaseUrl}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function getRoutes() {
  return serverGet<Route[]>("/v1/routes");
}

export function getPlans() {
  return serverGet<Plan[]>("/v1/plans");
}

export function getTrips(params: {
  route_id?: string;
  service_date?: string;
  origin?: string;
  destination?: string;
  seats?: number;
}) {
  return serverGet<Trip[]>("/v1/trips", params);
}

export function getTrip(id: string) {
  return serverGet<Trip>(`/v1/trips/${id}`);
}
