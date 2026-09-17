"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Minus,
  Plus,
  Sparkles,
  User,
} from "lucide-react";

import { StopConnector } from "@/components/brand";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { openCheckout, preloadPaystack } from "@/lib/paystack";
import { productConfig } from "@/lib/product-config";
import { durationLabel, fareTotal, formatDateLong, formatTime, naira } from "@/lib/utils";
import { passengerSchema, type PassengerInput } from "@/lib/validation";
import type { Trip } from "@/lib/types";

export default function BookPage() {
  return (
    <Suspense fallback={<BookingSkeleton />}>
      <BookingFlow />
    </Suspense>
  );
}

function BookingSkeleton() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

type Step = 1 | 2 | 3;

function BookingFlow() {
  const { tripId } = useParams<{ tripId: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = React.useState<Step>(1);
  const [male, setMale] = React.useState(Math.max(0, Number(params.get("male") ?? 0)));
  const [female, setFemale] = React.useState(Math.max(0, Number(params.get("female") ?? 0)));
  const [seats, setSeats] = React.useState(() => {
    const fromSex = Math.max(0, Number(params.get("male") ?? 0)) + Math.max(0, Number(params.get("female") ?? 0));
    return fromSex || Math.max(1, Number(params.get("seats") ?? 1));
  });
  const [submitting, setSubmitting] = React.useState(false);

  // Only send a split when it accounts for every seat — the backend rejects a
  // partial one, and inventing the difference would corrupt the reporting.
  // Declared here, above the mutation that closes over it.
  const sexRecorded = male + female === seats && seats > 0;

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => api.trip(tripId),
    staleTime: 15_000,
  });

  // A subscriber sees "use a ride credit" instead of a payment step.
  const { data: subscription } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: api.myActiveSubscription,
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  const canUseCredits = Boolean(
    subscription && subscription.status === "active" && subscription.credits_remaining >= seats,
  );

  const form = useForm<PassengerInput>({
    resolver: zodResolver(passengerSchema),
    defaultValues: { passenger_name: "", passenger_phone: "", passenger_email: "" },
    mode: "onBlur",
  });

  // Prefill from the signed-in account — one less thing to type on a phone.
  React.useEffect(() => {
    if (!user) return;
    form.reset({
      passenger_name: user.full_name,
      passenger_phone: user.phone,
      passenger_email: user.email ?? "",
    });
  }, [user, form]);

  React.useEffect(() => {
    if (step === 2) preloadPaystack();
  }, [step]);

  const createBooking = useMutation({
    mutationFn: async (values: PassengerInput) => {
      const parsed = passengerSchema.parse(values);
      if (canUseCredits) {
        return api.createSubscriptionBooking({
          trip_id: tripId,
          seats,
          seats_male: sexRecorded ? male : undefined,
          seats_female: sexRecorded ? female : undefined,
        });
      }
      return api.createBooking({
        trip_id: tripId,
        passenger_name: parsed.passenger_name,
        passenger_phone: parsed.passenger_phone,
        passenger_email: parsed.passenger_email ?? null,
        seats,
        seats_male: sexRecorded ? male : undefined,
        seats_female: sexRecorded ? female : undefined,
        source: "web",
      });
    },
  });

  async function handlePay() {
    setSubmitting(true);
    try {
      const result = await createBooking.mutateAsync(form.getValues());

      // Credit bookings are already confirmed — go straight to the ticket.
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
            `Payment cancelled. Your seats are held for a few more minutes — reference ${result.booking.booking_ref}.`,
            "info",
          );
          router.push(`/booking/${result.booking.booking_ref}`);
        },
        onError: (message) => {
          setSubmitting(false);
          toast(message, "error");
        },
      });
    } catch (error) {
      setSubmitting(false);
      const message =
        error instanceof ApiError
          ? error.message
          : "We couldn't start your booking. Please try again.";
      toast(message, "error");
      if (error instanceof ApiError && error.isSeatsUnavailable) setStep(1);
    }
  }

  if (isLoading) return <BookingSkeleton />;

  if (!trip) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-forest">Departure not found</h1>
          <p className="mt-2 text-ink-muted">
            That departure may have left or been cancelled. Let&apos;s find you another.
          </p>
          <Button asChild className="mt-6">
            <Link href="/search">Search departures</Link>
          </Button>
        </div>
      </div>
    );
  }

  const maxSeats = Math.min(trip.seats_available, 6);

  /** Adding a seat defaults to male; removing takes from whichever has spare. */
  function stepSeats(delta: number) {
    const next = Math.min(Math.max(seats + delta, 1), maxSeats);
    if (next === seats) return;
    setSeats(next);
    if (delta > 0) setMale((m) => m + 1);
    else if (female > 0) setFemale((f) => f - 1);
    else setMale((m) => Math.max(0, m - 1));
  }
  const totalKobo = canUseCredits
    ? 0
    : fareTotal(trip.fare_kobo, seats, productConfig.singleFareKobo).kobo;
  const total = totalKobo;

  return (
    <div className="container py-6 lg:py-10">
      <div className="mx-auto max-w-lg">
        <Link
          href="/search"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-forest"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to departures
        </Link>

        <StepIndicator step={step} />

        <TripSummary trip={trip} seats={seats} total={total} usingCredits={canUseCredits} />

        {/* Step 1 — passenger details */}
        {step === 1 && (
          <Card className="mt-5 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-forest">
              <User className="size-5 text-moss" aria-hidden />
              Who&apos;s travelling?
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              No account needed — we just need a name and number for the ticket.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={form.handleSubmit(() => setStep(2))}
              noValidate
            >
              <Field
                label="Full name"
                htmlFor="passenger_name"
                error={form.formState.errors.passenger_name?.message}
              >
                <Input
                  autoComplete="name"
                  placeholder="Chinedu Okafor"
                  invalid={Boolean(form.formState.errors.passenger_name)}
                  {...form.register("passenger_name")}
                />
              </Field>

              <Field
                label="Phone number"
                htmlFor="passenger_phone"
                hint="We'll text your QR ticket here."
                error={form.formState.errors.passenger_phone?.message}
              >
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0815 447 1570"
                  invalid={Boolean(form.formState.errors.passenger_phone)}
                  {...form.register("passenger_phone")}
                />
              </Field>

              <Field
                label="Email address"
                htmlFor="passenger_email"
                optional
                hint="For a copy of your ticket you can print or forward."
                error={form.formState.errors.passenger_email?.message}
              >
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  invalid={Boolean(form.formState.errors.passenger_email)}
                  {...form.register("passenger_email")}
                />
              </Field>

              <Button type="submit" block size="lg" className="mt-6">
                Continue
                <ArrowRight aria-hidden />
              </Button>
            </form>
          </Card>
        )}

        {/* Step 2 — seats */}
        {step === 2 && (
          <Card className="mt-5 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-forest">How many seats?</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {trip.seats_available} seat{trip.seats_available === 1 ? "" : "s"} left on this
              departure.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => stepSeats(-1)}
                disabled={seats <= 1}
                aria-label="Fewer seats"
              >
                <Minus aria-hidden />
              </Button>
              <div className="text-center" aria-live="polite">
                <p className="tabular text-6xl font-extrabold leading-none text-forest">{seats}</p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {seats === 1 ? "seat" : "seats"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => stepSeats(1)}
                disabled={seats >= maxSeats}
                aria-label="More seats"
              >
                <Plus aria-hidden />
              </Button>
            </div>

            {seats >= maxSeats && trip.seats_available > 6 && (
              <p className="mt-4 text-center text-xs text-ink-soft">
                Need more than 6 seats? Message us on WhatsApp and we&apos;ll arrange it.
              </p>
            )}

            <p className="mt-4 text-center text-sm text-ink-muted" aria-live="polite">
              {male > 0 && `${male} male`}
              {male > 0 && female > 0 && " · "}
              {female > 0 && `${female} female`}
              {!sexRecorded && (
                <span className="text-ink-soft">Sex not recorded for this booking</span>
              )}
            </p>

            {canUseCredits && (
              <Alert variant="success" className="mt-5">
                <p>
                  <strong>{seats} ride credit{seats === 1 ? "" : "s"}</strong> will be used from
                  your {subscription?.plan_name} plan. Nothing to pay.
                </p>
              </Alert>
            )}

            <div className="mt-6 flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button size="lg" onClick={() => setStep(3)} className="flex-[2]">
                Review
                <ArrowRight aria-hidden />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3 — confirm & pay */}
        {step === 3 && (
          <Card className="mt-5 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-forest">Confirm and pay</h2>

            <dl className="mt-4 divide-y divide-cream-200 text-sm">
              <Row label="Passenger" value={form.getValues("passenger_name")} />
              <Row label="Phone" value={form.getValues("passenger_phone")} />
              {form.getValues("passenger_email") && (
                <Row label="Email" value={form.getValues("passenger_email") as string} />
              )}
              <Row label="Departure" value={formatTime(trip.departure_datetime)} />
              <Row label="Date" value={formatDateLong(trip.departure_datetime)} />
              <Row label="Seats" value={String(seats)} />
              {sexRecorded && (
                <Row label="Passengers" value={`${male} male · ${female} female`} />
              )}
            </dl>

            <div className="mt-5 flex items-baseline justify-between rounded-xl bg-cream-100 px-4 py-4">
              <span className="text-sm font-semibold text-ink-muted">Total</span>
              <span className="tabular text-3xl font-extrabold text-forest">
                {canUseCredits ? (
                  <span className="inline-flex items-center gap-2 text-2xl text-teal-dark">
                    <Sparkles className="size-5" aria-hidden />
                    {seats} credit{seats === 1 ? "" : "s"}
                  </span>
                ) : (
                  naira(total)
                )}
              </span>
            </div>

            <Button
              size="xl"
              block
              className="mt-5"
              onClick={handlePay}
              loading={submitting}
              loadingText={canUseCredits ? "Confirming…" : "Opening checkout…"}
            >
              {canUseCredits ? (
                <>
                  <Sparkles aria-hidden />
                  Confirm with credits
                </>
              ) : (
                <>
                  <CreditCard aria-hidden />
                  Pay {naira(total)}
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              block
              className="mt-2"
              onClick={() => setStep(2)}
              disabled={submitting}
            >
              Back
            </Button>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
              <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {canUseCredits
                ? "Your ticket is issued immediately and sent by email and SMS."
                : "Your seats are held for 15 minutes while you pay. Card, transfer and USSD accepted through Paystack."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const labels = ["Details", "Seats", "Pay"];
  return (
    <ol className="mb-6 flex items-center gap-2" aria-label={`Step ${step} of 3`}>
      {labels.map((label, index) => {
        const number = index + 1;
        const done = number < step;
        const active = number === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold transition-colors ${
                done
                  ? "bg-moss text-white"
                  : active
                    ? "bg-forest text-white"
                    : "bg-cream-300 text-ink-soft"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-4" aria-hidden /> : number}
            </span>
            <span
              className={`text-xs font-semibold ${active ? "text-forest" : "text-ink-soft"}`}
            >
              {label}
            </span>
            {index < labels.length - 1 && (
              <span
                className={`h-0.5 flex-1 rounded-full ${done ? "bg-moss" : "bg-cream-300"}`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function TripSummary({
  trip,
  seats,
  total,
  usingCredits,
}: {
  trip: Trip;
  seats: number;
  total: number;
  usingCredits: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="tabular text-2xl font-extrabold text-forest">
            {formatTime(trip.departure_datetime)}
          </p>
          <p className="mt-0.5 truncate text-sm text-ink-muted">
            {formatDateLong(trip.departure_datetime)}
          </p>
        </div>
        <Badge variant="leaf" className="shrink-0">
          {durationLabel(trip.duration_mins)}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="max-w-[38%] truncate text-xs font-semibold text-ink-muted">
          {trip.origin_terminal.split(",")[0]}
        </span>
        <StopConnector className="flex-1" />
        <span className="max-w-[38%] truncate text-right text-xs font-semibold text-ink-muted">
          {trip.destination.split(",")[0]}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-cream-200 pt-3">
        <span className="text-xs text-ink-soft">
          {seats} × {naira(trip.fare_kobo)}
        </span>
        <span className="tabular text-lg font-extrabold text-forest">
          {usingCredits ? `${seats} credit${seats === 1 ? "" : "s"}` : naira(total)}
        </span>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd className="truncate text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
