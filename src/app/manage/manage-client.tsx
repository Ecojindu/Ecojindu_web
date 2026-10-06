"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, Send, XCircle } from "lucide-react";

import { QrTicket } from "@/components/qr-ticket";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { lookupSchema } from "@/lib/validation";
import type { Booking } from "@/lib/types";

type FormValues = z.input<typeof lookupSchema>;

export function ManagePageClient() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-lg py-10">
          <h1 className="text-display-sm font-extrabold text-forest dark:text-cream-50">Manage booking</h1>
          <p className="mt-2 text-ink-muted dark:text-cream-100/70">Enter your booking reference and phone number.</p>
        </div>
      }
    >
      <ManageBooking />
    </Suspense>
  );
}

function ManageBooking() {
  const params = useSearchParams();
  const { toast } = useToast();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [phone, setPhone] = React.useState("");
  const [confirmCancel, setConfirmCancel] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { booking_ref: params.get("ref") ?? "", phone: "" },
    mode: "onBlur",
  });

  const lookup = useMutation({
    mutationFn: async (values: FormValues) => {
      const parsed = lookupSchema.parse(values);
      setPhone(parsed.phone);
      return api.lookupBooking(parsed.booking_ref, parsed.phone);
    },
    onSuccess: (result) => {
      setBooking(result);
      setConfirmCancel(false);
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "We couldn't find that booking.", "error");
    },
  });

  const cancel = useMutation({
    mutationFn: () => api.cancelBooking(booking!.booking_ref, phone, "Cancelled by passenger"),
    onSuccess: (updated) => {
      setBooking(updated);
      setConfirmCancel(false);
      toast("Booking cancelled. Any refund is on its way to your original payment method.", "success");
    },
    onError: (error) => {
      toast(error instanceof ApiError ? error.message : "We couldn't cancel that booking.", "error");
    },
  });

  const resend = useMutation({
    mutationFn: () => api.resendTicket(booking!.booking_ref, phone),
    onSuccess: (result) => toast(result.message, "success"),
    onError: (error) =>
      toast(error instanceof ApiError ? error.message : "We couldn't resend that ticket.", "error"),
  });

  const canCancel =
    booking && ["pending_payment", "confirmed"].includes(booking.status);

  return (
    <div className="container pb-10 lg:pb-14">
      <div className="mx-auto max-w-lg">
        <Card className="mt-6 p-6 sm:p-7">
          <form className="space-y-4" onSubmit={form.handleSubmit((v) => lookup.mutate(v))} noValidate>
            <Field
              label="Booking reference"
              htmlFor="booking_ref"
              hint="Looks like EJS-8K3F2 — it's on your ticket, email and SMS."
              error={form.formState.errors.booking_ref?.message}
            >
              <Input
                placeholder="EJS-8K3F2"
                autoCapitalize="characters"
                className="font-mono uppercase tracking-widest"
                invalid={Boolean(form.formState.errors.booking_ref)}
                {...form.register("booking_ref")}
              />
            </Field>

            <Field
              label="Phone number"
              htmlFor="phone"
              error={form.formState.errors.phone?.message}
            >
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0815 447 1570"
                invalid={Boolean(form.formState.errors.phone)}
                {...form.register("phone")}
              />
            </Field>

            <Button
              type="submit"
              block
              size="lg"
              loading={lookup.isPending}
              loadingText="Looking…"
              className="bg-hero-tint text-white hover:bg-hero-tint/90"
            >
              <Search aria-hidden />
              Find my booking
            </Button>
          </form>
        </Card>

        {booking && (
          <div className="mt-8 animate-fade-up">
            {booking.status === "cancelled" ? (
              <Alert variant="error" title="This booking was cancelled">
                <p>
                  The seats have been released. Any payment is refunded to the original method
                  within 3–5 working days.
                </p>
              </Alert>
            ) : booking.status === "pending_payment" ? (
              <Alert variant="warning" title="Payment isn't complete">
                <p>
                  Your seats are only held briefly. Start a new booking if the hold has already
                  lapsed.
                </p>
              </Alert>
            ) : (
              <QrTicket booking={booking} />
            )}

            <div className="mt-6 space-y-2">
              {["confirmed", "checked_in"].includes(booking.status) && (
                <Button
                  block
                  variant="outline"
                  size="lg"
                  onClick={() => resend.mutate()}
                  loading={resend.isPending}
                  loadingText="Sending…"
                >
                  <Send aria-hidden />
                  Resend by email and SMS
                </Button>
              )}

              {canCancel &&
                (confirmCancel ? (
                  <Alert variant="warning" title="Cancel this booking?">
                    <p className="mb-3">
                      This releases your seat{booking.seats > 1 ? "s" : ""} and can&apos;t be
                      undone. Refunds take 3–5 working days.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancel.mutate()}
                        loading={cancel.isPending}
                        loadingText="Cancelling…"
                      >
                        Yes, cancel it
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmCancel(false)}>
                        Keep my booking
                      </Button>
                    </div>
                  </Alert>
                ) : (
                  <Button block variant="ghost" size="lg" onClick={() => setConfirmCancel(true)}>
                    <XCircle aria-hidden />
                    Cancel this booking
                  </Button>
                ))}

              <Button asChild block variant="ghost">
                <Link href="/search">Book another trip</Link>
              </Button>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-xs leading-relaxed text-ink-soft">
          Lost your reference? Call us on{" "}
          <a href="tel:+2348154471570" className="font-semibold text-moss hover:underline">
            +234 815 447 1570
          </a>{" "}
          with the phone number you booked with.
        </p>
      </div>
    </div>
  );
}
