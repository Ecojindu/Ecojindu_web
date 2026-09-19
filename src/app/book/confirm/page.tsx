"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Minus, Plus } from "lucide-react";

import { lastPickup, rememberPickup } from "@/components/upload-go-home";
import { StickyActionBar } from "@/components/sticky-action-bar";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { openCheckout, preloadPaystack } from "@/lib/paystack";
import { productConfig, type PickupCity } from "@/lib/product-config";
import {
  fareTotal,
  formatDate,
  formatTime,
  naira,
} from "@/lib/utils";
import { passengerSchema, type PassengerInput } from "@/lib/validation";
import type { ShuttleSuggestion, TicketExtraction, Trip } from "@/lib/types";

interface UploadGoState {
  extraction: TicketExtraction;
  suggestion: ShuttleSuggestion;
  privacy_note?: string;
  pickup_city: PickupCity;
  seats: number;
}

export default function ConfirmPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [state, setState] = React.useState<UploadGoState | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [pickup, setPickup] = React.useState<PickupCity>("Umuahia");
  const [seats, setSeats] = React.useState(1);
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [fits, setFits] = React.useState(true);
  const [matchMessage, setMatchMessage] = React.useState("");
  const [alternatives, setAlternatives] = React.useState<Trip[]>([]);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [pickupSheet, setPickupSheet] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [sex, setSex] = React.useState<"male" | "female" | "">("");

  const form = useForm<PassengerInput>({
    resolver: zodResolver(passengerSchema),
    defaultValues: { passenger_name: "", passenger_phone: "", passenger_email: "" },
    mode: "onBlur",
  });

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ejs.upload_go");
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as UploadGoState;
      setState(parsed);
      setPickup(parsed.pickup_city || lastPickup());
      setSeats(Math.max(1, parsed.seats || 1));
      setTrip(parsed.suggestion.trip);
      setFits(parsed.suggestion.fits);
      setMatchMessage(parsed.suggestion.message);
      setAlternatives(parsed.suggestion.alternatives ?? []);
      const name = parsed.extraction.passenger_names?.[0] ?? "";
      form.reset({
        passenger_name: name,
        passenger_phone: user?.phone ?? "",
        passenger_email: user?.email ?? "",
      });
    } catch {
      /* ignore corrupt session */
    }
    setHydrated(true);
  }, [form, user]);

  React.useEffect(() => {
    if (user && !form.getValues("passenger_phone")) {
      form.setValue("passenger_phone", user.phone);
      if (user.email) form.setValue("passenger_email", user.email);
      if (!form.getValues("passenger_name")) form.setValue("passenger_name", user.full_name);
    }
  }, [user, form]);

  React.useEffect(() => {
    preloadPaystack();
  }, []);

  const { data: subscription } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: api.myActiveSubscription,
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  const canUseCredits = Boolean(
    subscription && subscription.status === "active" && subscription.credits_remaining >= seats,
  );

  const rematch = useMutation({
    mutationFn: (city: PickupCity) => {
      const dep = state?.extraction.departure_datetime;
      if (!dep) throw new ApiError("Missing flight time — go back and upload again.", "missing_flight");
      return api.matchShuttle({ departure_datetime: dep, pickup_city: city });
    },
    onSuccess: (suggestion, city) => {
      setPickup(city);
      rememberPickup(city);
      setTrip(suggestion.trip);
      setFits(suggestion.fits);
      setMatchMessage(suggestion.message);
      setAlternatives(suggestion.alternatives ?? []);
      setPickupSheet(false);
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "Couldn't update pickup.", "error");
    },
  });

  const createBooking = useMutation({
    mutationFn: async (values: PassengerInput) => {
      if (!trip) throw new ApiError("Pick a departure first.", "no_trip");
      const parsed = passengerSchema.parse(values);
      rememberPickup(pickup);
      const sexPayload =
        sex === "male"
          ? { seats_male: seats, seats_female: 0 }
          : sex === "female"
            ? { seats_male: 0, seats_female: seats }
            : {};

      if (canUseCredits) {
        return api.createSubscriptionBooking({
          trip_id: trip.id,
          seats,
          ...sexPayload,
        });
      }
      return api.createBooking({
        trip_id: trip.id,
        passenger_name: parsed.passenger_name,
        passenger_phone: parsed.passenger_phone,
        passenger_email: parsed.passenger_email ?? null,
        seats,
        ...sexPayload,
        source: "web_upload_go",
      });
    },
  });

  async function handlePay() {
    const valid = await form.trigger();
    if (!valid) return;
    if (!trip) {
      toast("Choose a shuttle departure first.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createBooking.mutateAsync(form.getValues());
      sessionStorage.removeItem("ejs.upload_go");

      if (!result.payment) {
        router.push(`/booking/${result.booking.booking_ref}?new=1`);
        return;
      }

      await openCheckout(result.payment, {
        onSuccess: (reference) => {
          router.push(`/booking/callback?reference=${reference}`);
        },
        onCancel: () => {
          setSubmitting(false);
          toast(
            `Payment cancelled. Seats held ~${productConfig.seatHoldMinutes} min — ${result.booking.booking_ref}.`,
            "info",
          );
        },
        onError: (message) => {
          setSubmitting(false);
          toast(message, "error");
        },
      });
    } catch (error) {
      setSubmitting(false);
      toast(
        error instanceof ApiError ? error.message : "We couldn't start payment. Try again.",
        "error",
      );
    }
  }

  if (!hydrated) {
    return (
      <div className="container max-w-lg space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="container max-w-lg py-16 text-center">
        <h1 className="text-2xl font-extrabold text-forest">Start with your flight ticket</h1>
        <p className="mt-2 text-ink-muted">Upload a ticket on the home screen to continue.</p>
        <Button asChild className="mt-6">
          <Link href="/">Upload &amp; Go</Link>
        </Button>
      </div>
    );
  }

  const maxSeats = trip ? Math.min(trip.seats_available, 6) : 6;
  const total = fareTotal(
    canUseCredits ? productConfig.singleFareKobo : trip?.fare_kobo,
    seats,
    productConfig.singleFareKobo,
  );
  const displayTotal = canUseCredits ? "1 ride credit" : total.label;

  return (
    <div className="container max-w-lg pb-36 pt-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-forest dark:text-cream-100/75 dark:hover:text-cream-50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back
      </Link>

      <h1 className="text-display-sm font-extrabold text-forest dark:text-cream-50">Confirm</h1>
      <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/75">One screen — check the details, then pay.</p>

      {/* Shuttle */}
      <section className="mt-5 rounded-2xl border border-cream-300 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-forest/50">
        {trip ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-moss dark:text-leaf-light">Your shuttle</p>
                <p className="mt-1 text-lg font-extrabold tabular text-forest dark:text-cream-50">
                  {formatDate(trip.departure_datetime)} · {formatTime(trip.departure_datetime)}
                </p>
                <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/75">
                  {trip.origin_terminal} → {trip.destination}
                </p>
                {trip.arrival_estimate ? (
                  <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/75">
                    Arrive airport ~{formatTime(trip.arrival_estimate)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="shrink-0 text-sm font-bold text-moss underline-offset-2 hover:underline dark:text-leaf-light"
                onClick={() => setSheetOpen(true)}
              >
                Change departure
              </button>
            </div>
            {!fits ? (
              <Alert variant="warning" className="mt-3" title="No perfect fit">
                {matchMessage || "This is the nearest earlier option before your check-in time."}
              </Alert>
            ) : matchMessage ? (
              <p className="mt-3 text-xs text-ink-soft dark:text-cream-100/70">{matchMessage}</p>
            ) : null}
          </>
        ) : (
          <Alert variant="error" title="No shuttle found">
            {matchMessage || "We couldn't match a departure. Try another pickup or book manually."}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setPickupSheet(true)}>
                Change pickup
              </Button>
              <Button asChild size="sm">
                <Link href="/search">Browse timetable</Link>
              </Button>
            </div>
          </Alert>
        )}
      </section>

      {/* Passenger */}
      <section className="mt-4 space-y-3 rounded-2xl border border-cream-300 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-forest/50">
        <h2 className="text-sm font-bold text-forest dark:text-cream-50">Passenger</h2>
        <Field label="Full name" htmlFor="passenger_name" error={form.formState.errors.passenger_name?.message}>
          <Input
            id="passenger_name"
            autoComplete="name"
            invalid={Boolean(form.formState.errors.passenger_name)}
            {...form.register("passenger_name")}
          />
        </Field>
        <Field
          label="Phone number"
          htmlFor="passenger_phone"
          hint="WhatsApp ticket delivery and your guest account."
          error={form.formState.errors.passenger_phone?.message}
        >
          <Input
            id="passenger_phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            invalid={Boolean(form.formState.errors.passenger_phone)}
            {...form.register("passenger_phone")}
          />
        </Field>
        <Field
          label="Email"
          htmlFor="passenger_email"
          optional
          error={form.formState.errors.passenger_email?.message}
        >
          <Input
            id="passenger_email"
            type="email"
            autoComplete="email"
            {...form.register("passenger_email")}
          />
        </Field>
        <Field label="Sex (for seating)" htmlFor="sex" optional hint="Only if operations need it — leave blank if unsure.">
          <select
            id="sex"
            className="h-12 w-full rounded-xl border border-cream-400 bg-white px-3 text-sm text-ink focus:border-moss focus:outline-none dark:border-white/20 dark:bg-forest-dark dark:text-cream-50 dark:focus:border-leaf"
            value={sex}
            onChange={(e) => setSex(e.target.value as typeof sex)}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
      </section>

      {/* Pickup + seats */}
      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setPickupSheet(true)}
          className="rounded-2xl border border-cream-300 bg-white p-4 text-left shadow-soft dark:border-white/10 dark:bg-forest/50"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft dark:text-cream-100/70">Pickup</p>
          <p className="mt-1 text-base font-bold text-forest dark:text-cream-50">{pickup}</p>
          <p className="mt-1 text-xs font-semibold text-moss dark:text-leaf-light">Change</p>
        </button>

        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-forest/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft dark:text-cream-100/70">Seats</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              className="tap-target grid place-items-center rounded-full border border-cream-400 dark:border-white/20 text-forest dark:text-cream-50"
              aria-label="Fewer seats"
              disabled={seats <= 1}
              onClick={() => setSeats((s) => Math.max(1, s - 1))}
            >
              <Minus className="size-4" />
            </button>
            <span className="text-xl font-extrabold tabular text-forest dark:text-cream-50">{seats}</span>
            <button
              type="button"
              className="tap-target grid place-items-center rounded-full border border-cream-400 dark:border-white/20 text-forest dark:text-cream-50"
              aria-label="More seats"
              disabled={seats >= maxSeats}
              onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {state.extraction.flight_number ? (
        <p className="mt-4 text-xs text-ink-soft dark:text-cream-100/70">
          Flight {state.extraction.airline ? `${state.extraction.airline} ` : ""}
          {state.extraction.flight_number}
          {state.extraction.departure_datetime
            ? ` · ${formatDate(state.extraction.departure_datetime)} ${formatTime(state.extraction.departure_datetime)}`
            : ""}
        </p>
      ) : null}

      <StickyActionBar
        meta={
          <span>
            Total{" "}
            <strong className="tabular text-lg text-forest dark:text-cream-50">{displayTotal}</strong>
            {!canUseCredits ? (
              <span className="block text-xs">
                {seats} × {naira(trip?.fare_kobo && trip.fare_kobo > 0 ? trip.fare_kobo : productConfig.singleFareKobo)}
              </span>
            ) : (
              <span className="block text-xs">Subscriber — no card charge</span>
            )}
          </span>
        }
      >
        <Button
          size="lg"
          block
          loading={submitting}
          loadingText={canUseCredits ? "Using credit…" : "Opening Paystack…"}
          onClick={() => void handlePay()}
          disabled={!trip}
        >
          {canUseCredits ? "Confirm with ride credit" : "Pay now"}
        </Button>
      </StickyActionBar>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Change departure"
        description="Other times that still work for your flight"
      >
        <ul className="space-y-2">
          {[trip, ...alternatives].filter(Boolean).map((option) => {
            if (!option) return null;
            const selected = trip?.id === option.id;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  className={`w-full rounded-2xl border p-4 text-left ${
                    selected ? "border-moss bg-leaf/10 dark:bg-leaf/20" : "border-cream-300 bg-white dark:border-white/10 dark:bg-forest/50"
                  }`}
                  onClick={() => {
                    setTrip(option);
                    setSheetOpen(false);
                  }}
                >
                  <p className="font-bold text-forest dark:text-cream-50">
                    {formatTime(option.departure_datetime)} · {formatDate(option.departure_datetime)}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/75">
                    {option.seats_available} seats · {naira(option.fare_kobo || productConfig.singleFareKobo)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
        {!alternatives.length && !trip ? (
          <p className="text-sm text-ink-muted dark:text-cream-100/75">No other departures available. Try another pickup city.</p>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={pickupSheet}
        onOpenChange={setPickupSheet}
        title="Pickup point"
        description="Remembered for your next booking"
      >
        <div className="grid gap-2">
          {productConfig.pickupCities.map((city) => (
            <Button
              key={city}
              variant={pickup === city ? "primary" : "outline"}
              size="lg"
              block
              loading={rematch.isPending && rematch.variables === city}
              onClick={() => rematch.mutate(city)}
            >
              {city}
            </Button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
