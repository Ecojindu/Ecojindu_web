"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Mail, MessageSquare, Search } from "lucide-react";

import { QrTicket } from "@/components/qr-ticket";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { countdownLabel } from "@/lib/utils";
import { phoneSchema } from "@/lib/validation";
import type { Booking } from "@/lib/types";

export default function BookingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookingConfirmation />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-sm space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[520px] w-full rounded-3xl" />
      </div>
    </div>
  );
}

function BookingConfirmation() {
  const { ref } = useParams<{ ref: string }>();
  const params = useSearchParams();
  const isNew = params.get("new") === "1";
  const { user } = useAuth();

  // Signed-in passengers are identified by their token; guests confirm with
  // the phone number on the booking, so a reference alone never leaks details.
  const [phone, setPhone] = React.useState("");
  const [confirmedPhone, setConfirmedPhone] = React.useState<string | null>(null);
  const [phoneError, setPhoneError] = React.useState<string>();

  const authed = useQuery({
    queryKey: ["booking", ref, "auth"],
    queryFn: () => api.lookupBooking(ref, user!.phone),
    enabled: Boolean(user),
    retry: false,
  });

  const guest = useQuery({
    queryKey: ["booking", ref, confirmedPhone],
    queryFn: () => api.lookupBooking(ref, confirmedPhone!),
    enabled: Boolean(confirmedPhone) && !user,
    retry: false,
  });

  const booking: Booking | undefined = authed.data ?? guest.data;
  const loading = (user && authed.isLoading) || (confirmedPhone && guest.isLoading);

  function verifyPhone(event: React.FormEvent) {
    event.preventDefault();
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setPhoneError(parsed.error.issues[0]?.message ?? "Check that number");
      return;
    }
    setPhoneError(undefined);
    setConfirmedPhone(parsed.data);
  }

  if (loading) return <Loading />;

  // Guest arriving with just a reference — ask for the phone on the booking.
  if (!booking && !user) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md p-6 sm:p-8">
          <h1 className="text-xl font-extrabold text-forest">View booking {ref}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            For your security, confirm the phone number on this booking.
          </p>
          <form className="mt-6 space-y-4" onSubmit={verifyPhone} noValidate>
            <Field label="Phone number" htmlFor="phone" error={phoneError ?? guestError(guest.error)}>
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0815 447 1570"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                invalid={Boolean(phoneError)}
              />
            </Field>
            <Button type="submit" block size="lg">
              <Search aria-hidden />
              View my ticket
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-extrabold text-forest">Booking not found</h1>
        <p className="mt-2 text-ink-muted">We couldn&apos;t find a booking with that reference.</p>
        <Button asChild className="mt-6">
          <Link href="/manage">Look it up another way</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="mx-auto max-w-lg">
        {isNew && booking.status !== "pending_payment" && (
          <div className="mb-7 text-center">
            <span className="mx-auto grid size-16 animate-fade-up place-items-center rounded-full bg-leaf/20">
              <CheckCircle2 className="size-9 text-moss" aria-hidden />
            </span>
            <h1 className="mt-5 animate-fade-up text-balance text-display-sm font-extrabold text-forest">
              You&apos;re on board
            </h1>
            <p className="mx-auto mt-2 max-w-sm animate-fade-up text-pretty text-sm leading-relaxed text-ink-muted">
              Your seat{booking.seats > 1 ? "s are" : " is"} confirmed. We&apos;ve emailed and
              texted this ticket to you as well.
            </p>
          </div>
        )}

        {booking.status === "pending_payment" && (
          <Alert variant="warning" title="Payment not completed" className="mb-6">
            <p>
              Your seats are held
              {countdownLabel(booking.hold_expires_at)
                ? ` for another ${countdownLabel(booking.hold_expires_at)}`
                : " for a short while"}
              . Complete payment to lock them in and get your QR ticket.
            </p>
          </Alert>
        )}

        {booking.status === "cancelled" && (
          <Alert variant="error" title="This booking was cancelled" className="mb-6">
            <p>
              The seats have been released. If you paid, a refund is on its way to your original
              payment method.
            </p>
          </Alert>
        )}

        {booking.status !== "cancelled" && booking.status !== "pending_payment" && (
          <QrTicket booking={booking} />
        )}

        <div className="mt-7 space-y-2">
          <Button asChild block variant="outline" size="lg">
            <Link href="/search">Book another trip</Link>
          </Button>
          <Button asChild block variant="ghost">
            <Link href="/manage">Manage this booking</Link>
          </Button>
        </div>

        {booking.status === "confirmed" && (
          <div className="mt-8 rounded-2xl bg-white/70 p-5">
            <p className="mb-3 text-sm font-bold text-forest">Before you travel</p>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-moss" aria-hidden />
                Arrive 20 minutes early — boarding closes 10 minutes before departure.
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-moss" aria-hidden />
                We&apos;ll email a reminder 24 hours and 2 hours before you travel.
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="mt-0.5 size-4 shrink-0 text-moss" aria-hidden />
                Save your reference <strong className="font-mono">{booking.booking_ref}</strong> —
                it works at the gate even without the QR.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function guestError(error: unknown): string | undefined {
  if (!error) return undefined;
  return (error as Error).message;
}
