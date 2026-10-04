"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { LogIn, QrCode, Ticket } from "lucide-react";

import { QrTicket } from "@/components/qr-ticket";
import { Alert, EmptyState } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingCardSkeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateTime, naira } from "@/lib/utils";

export default function TripsPage() {
  const { user, loading } = useAuth();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.myBookings(false),
    enabled: Boolean(user),
    staleTime: 30_000,
  });

  if (loading) {
    return (
      <div className="container max-w-lg space-y-4 pb-8 pt-12 sm:pt-14">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-lg pb-10 pt-14 sm:pt-16">
        <header className="mx-auto max-w-md text-center">
          <h1 className="text-balance text-display-sm font-extrabold text-forest dark:text-cream-50">
            My trips
          </h1>
          <p className="mt-2 text-pretty text-ink-muted dark:text-cream-100/75">
            Sign in to see upcoming QR tickets, or look up a booking with your reference and phone.
          </p>
        </header>
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:mt-12">
          <Button
            asChild
            size="lg"
            block
            className="bg-hero-tint text-white hover:bg-hero-tint/90"
          >
            <Link href="/auth/login">
              <LogIn aria-hidden />
              Sign in
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" block>
            <Link href="/manage">Manage booking (no login)</Link>
          </Button>
        </div>
      </div>
    );
  }

  const upcoming =
    bookings?.filter((b) => ["confirmed", "pending_payment", "checked_in"].includes(b.status)) ?? [];
  const past = bookings?.filter((b) => !upcoming.includes(b)) ?? [];

  return (
    <div className="container max-w-lg pb-8 pt-12 sm:pt-14">
      <header className="mx-auto max-w-md text-center">
        <h1 className="text-balance text-display-sm font-extrabold text-forest dark:text-cream-50">
          My trips
        </h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted dark:text-cream-100/75">
          Upcoming first — tap a trip for your QR code.
        </p>
      </header>

      {error ? (
        <Alert variant="error" className="mt-4" title="Couldn't load trips">
          Check your connection and try again.
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      ) : null}

      {!isLoading && !upcoming.length && !past.length ? (
        <EmptyState
          className="mt-8"
          icon={Ticket}
          title="No trips yet"
          description="Upload a flight ticket on the home screen to book your first shuttle."
          action={
            <Button asChild>
              <Link href="/">Upload &amp; Go</Link>
            </Button>
          }
        />
      ) : null}

      {upcoming.length ? (
        <section className="mt-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-soft dark:text-cream-100/60">Upcoming</h2>
          {upcoming.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-cream-300 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-forest/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-forest dark:text-cream-50">{booking.booking_ref}</p>
                  <p className="mt-1 text-sm text-ink-muted dark:text-cream-100/75">
                    {booking.trip
                      ? formatDateTime(booking.trip.departure_datetime)
                      : "Departure details on your ticket"}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular text-forest dark:text-cream-50">
                    {booking.status === "pending_payment"
                      ? `Pay ${naira(booking.amount_kobo)}`
                      : `${booking.seats} seat${booking.seats > 1 ? "s" : ""}`}
                  </p>
                </div>
                <Badge>{booking.status.replace("_", " ")}</Badge>
              </div>
              {booking.ticket ? (
                <div className="mt-4">
                  <QrTicket booking={booking} />
                </div>
              ) : (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href={`/booking/${booking.booking_ref}`}>
                    <QrCode className="size-4" aria-hidden />
                    Open booking
                  </Link>
                </Button>
              )}
              {booking.status === "confirmed" || booking.status === "pending_payment" ? (
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/booking/${booking.booking_ref}`}>Change / cancel</Link>
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {past.length ? (
        <section className="mt-8 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-soft dark:text-cream-100/60">Past</h2>
          {past.map((booking) => (
            <Link
              key={booking.id}
              href={`/booking/${booking.booking_ref}`}
              className="flex items-center justify-between rounded-xl border border-cream-300 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-forest/40"
            >
              <span className="text-sm font-semibold text-forest dark:text-cream-50">
                {booking.booking_ref}
              </span>
              <span className="text-xs text-ink-muted dark:text-cream-100/70">{booking.status}</span>
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}
