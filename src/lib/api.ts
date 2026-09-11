"use client";

import { config } from "./config";
import type {
  AuthResponse,
  Booking,
  CharterResponse,
  BookingCreateResponse,
  PaymentVerification,
  Plan,
  Route,
  Subscription,
  SubscriptionPurchaseResponse,
  TokenPair,
  Trip,
  User,
} from "./types";

const ACCESS_KEY = "ejs.access";
const REFRESH_KEY = "ejs.refresh";
const USER_KEY = "ejs.user";

/** A backend error, carrying the machine-readable code so callers can branch. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string = "error",
    readonly status: number = 500,
    readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isSeatsUnavailable() {
    return this.code === "seats_unavailable";
  }
  get isUnauthorized() {
    return this.status === 401;
  }
}

// ── Token storage ────────────────────────────────────────────
// localStorage keeps sessions across tabs and reloads. The API is CORS-scoped
// and tokens are short-lived, which is the right trade for a booking site.

export const tokenStore = {
  get access() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  get user(): User | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  save(tokens: TokenPair, user?: User) {
    window.localStorage.setItem(ACCESS_KEY, tokens.access_token);
    window.localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("ejs:auth"));
  },
  saveUser(user: User) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("ejs:auth"));
  },
  clear() {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("ejs:auth"));
  },
};

// ── Fetch wrapper ────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Internal: prevents an infinite refresh loop. */
  _retried?: boolean;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokenStore.refresh;
  if (!refresh) return false;

  const response = await fetch(`${config.apiBaseUrl}/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!response.ok) {
    tokenStore.clear();
    return false;
  }
  const tokens = (await response.json()) as TokenPair;
  const user = tokenStore.user;
  tokenStore.save(tokens, user ?? undefined);
  return true;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, params, _retried = false } = options;

  const url = new URL(`${config.apiBaseUrl}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = tokenStore.access;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "We couldn't reach the booking service. Check your connection and try again.",
      "network_error",
      0,
    );
  }

  // One transparent refresh, then give up and let the caller send them to login.
  if (response.status === 401 && auth && !_retried) {
    if (await refreshAccessToken()) {
      return request<T>(path, { ...options, _retried: true });
    }
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const err = payload?.error;
    throw new ApiError(
      err?.message ?? "Something went wrong. Please try again.",
      err?.code ?? "error",
      response.status,
      err?.details ?? {},
    );
  }

  return payload as T;
}

// ── Endpoints ────────────────────────────────────────────────

export const api = {
  // Catalogue
  routes: () => request<Route[]>("/v1/routes"),
  route: (id: string) => request<Route>(`/v1/routes/${id}`),
  plans: () => request<Plan[]>("/v1/plans"),

  trips: (params: {
    route_id?: string;
    service_date?: string;
    origin?: string;
    destination?: string;
    seats?: number;
  }) => request<Trip[]>("/v1/trips", { params }),

  trip: (id: string) => request<Trip>(`/v1/trips/${id}`),

  availabilityCalendar: (routeId: string, days = 14) =>
    request<Record<string, number>>("/v1/trips/availability", {
      params: { route_id: routeId, days },
    }),

  // Bookings
  createBooking: (body: {
    trip_id: string;
    passenger_name: string;
    passenger_phone: string;
    passenger_email?: string | null;
    seats: number;
    seats_male?: number;
    seats_female?: number;
    source?: string;
  }) => request<BookingCreateResponse>("/v1/bookings", { method: "POST", body }),

  createSubscriptionBooking: (body: {
    trip_id: string;
    seats: number;
    seats_male?: number;
    seats_female?: number;
  }) =>
    request<BookingCreateResponse>("/v1/bookings/subscription", {
      method: "POST",
      body,
      auth: true,
    }),

  lookupBooking: (booking_ref: string, phone: string) =>
    request<Booking>("/v1/bookings/lookup", { method: "POST", body: { booking_ref, phone } }),

  myBookings: (upcomingOnly = false) =>
    request<Booking[]>("/v1/bookings/mine", { auth: true, params: { upcoming_only: upcomingOnly } }),

  cancelBooking: (ref: string, phone?: string, reason?: string) =>
    request<Booking>(`/v1/bookings/${ref}/cancel`, {
      method: "POST",
      body: { reason },
      auth: true,
      params: { phone },
    }),

  resendTicket: (ref: string, phone?: string, channels: string[] = ["email", "sms"]) =>
    request<{ message: string }>(`/v1/bookings/${ref}/resend-ticket`, {
      method: "POST",
      body: { channels },
      auth: true,
      params: { phone },
    }),

  // Payments
  verifyPayment: (reference: string) =>
    request<PaymentVerification>(`/v1/payments/verify/${reference}`),

  // Subscriptions
  purchaseSubscription: (body: {
    plan_id: string;
    full_name: string;
    phone: string;
    email: string;
  }) => request<SubscriptionPurchaseResponse>("/v1/subscriptions/purchase", { method: "POST", body }),

  mySubscriptions: () => request<Subscription[]>("/v1/subscriptions/mine", { auth: true }),

  myActiveSubscription: () =>
    request<Subscription | null>("/v1/subscriptions/mine/active", { auth: true }),

  // Auth
  register: (body: { full_name: string; phone: string; email?: string; password: string }) =>
    request<AuthResponse>("/v1/auth/register", { method: "POST", body }),

  login: (body: { identifier: string; password: string }) =>
    request<AuthResponse>("/v1/auth/login", { method: "POST", body }),

  me: () => request<User>("/v1/auth/me", { auth: true }),

  updateProfile: (body: Partial<Pick<User, "full_name" | "email" | "notify_email" | "notify_sms" | "notify_whatsapp">>) =>
    request<User>("/v1/auth/me", { method: "PATCH", body, auth: true }),

  requestOtp: (phone: string) =>
    request<{ message: string }>("/v1/auth/otp/request", { method: "POST", body: { phone } }),

  verifyOtp: (phone: string, code: string) =>
    request<{ message: string }>("/v1/auth/otp/verify", { method: "POST", body: { phone, code } }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/v1/auth/password/forgot", { method: "POST", body: { email } }),

  resetPassword: (token: string, new_password: string) =>
    request<{ message: string }>("/v1/auth/password/reset", {
      method: "POST",
      body: { token, new_password },
    }),

  // ── Charter ──
  requestCharter: (body: {
    contact_name: string;
    phone: string;
    contact_email?: string | null;
    organisation?: string | null;
    route_id?: string | null;
    origin_text: string;
    destination_text: string;
    service_date: string;
    preferred_time?: string | null;
    passengers: number;
    return_trip?: boolean;
    notes?: string | null;
  }) => request<CharterResponse>("/v1/charter/requests", { method: "POST", body }),

  lookupCharter: (reference: string, phone: string) =>
    request<CharterResponse>("/v1/charter/lookup", { method: "POST", body: { reference, phone } }),

  ticketImageUrl: (ref: string) => `${config.apiBaseUrl}/v1/tickets/${ref}/qr.png`,
};
