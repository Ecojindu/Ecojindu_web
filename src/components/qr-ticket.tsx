"use client";

import * as React from "react";
import { Download, Mail, MessageSquare, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { cn, formatDateLong, formatTime, naira } from "@/lib/utils";
import type { Booking } from "@/lib/types";

/**
 * The boarding pass. Styled as a physical ticket stub — the notch and the
 * perforation line make it read as something you present, not a receipt.
 */
export function QrTicket({
  booking,
  className,
  showActions = true,
}: {
  booking: Booking;
  className?: string;
  showActions?: boolean;
}) {
  const trip = booking.trip;
  const imageUrl = api.ticketImageUrl(booking.booking_ref);
  const [imageFailed, setImageFailed] = React.useState(false);

  async function download() {
    // Fetch → blob → object URL, because a cross-origin <a download> is ignored.
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ecojindu-ticket-${booking.booking_ref}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank", "noopener");
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-sm", className)}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-lift dark:border dark:border-white/10 dark:bg-forest-light/30 dark:shadow-none">
        {/* Stub header */}
        <div className="bg-forest px-6 py-5 text-white dark:bg-forest-light">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-leaf-light">
                Boarding pass
              </p>
              <p className="mt-1 text-lg font-extrabold tracking-tight text-white">Ecojindu Shuttle</p>
            </div>
            <Ticket className="size-6 text-leaf" aria-hidden />
          </div>
        </div>

        {/* Reference */}
        <div className="border-b border-dashed border-cream-400 px-6 py-5 text-center dark:border-white/15">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-moss dark:text-leaf-light">
            Booking reference
          </p>
          <p className="tabular mt-1 font-mono text-3xl font-extrabold tracking-[0.12em] text-forest dark:text-cream-50">
            {booking.booking_ref}
          </p>
          <div className="mt-3 flex justify-center">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        {/* QR */}
        <div className="relative px-6 py-6">
          {/* Perforation notches */}
          <span
            className="absolute -left-3 top-0 size-6 -translate-y-1/2 rounded-full bg-white dark:bg-forest-dark"
            aria-hidden
          />
          <span
            className="absolute -right-3 top-0 size-6 -translate-y-1/2 rounded-full bg-white dark:bg-forest-dark"
            aria-hidden
          />

          <div className="mx-auto grid aspect-square w-full max-w-[240px] place-items-center rounded-2xl border-2 border-dashed border-cream-400 bg-white p-3 dark:border-white/20">
            {imageFailed ? (
              <p className="px-4 text-center text-xs text-ink-soft dark:text-forest">
                The QR image couldn&apos;t load. Your reference above is still valid at the gate.
              </p>
            ) : (
              <img
                src={imageUrl}
                alt={`QR boarding pass for booking ${booking.booking_ref}`}
                width={240}
                height={240}
                className="size-full object-contain"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft dark:text-cream-100/70">
            Show this at the Nnenna Otti Bus Terminal gate
          </p>
        </div>

        {/* Trip detail */}
        {trip && (
          <dl className="border-t border-cream-200 px-6 py-5 text-sm dark:border-white/10">
            <Row label="Passenger" value={booking.passenger_name} />
            <Row label="Route" value={trip.route_name} />
            <Row label="Date" value={formatDateLong(trip.departure_datetime)} />
            <Row label="Departs" value={formatTime(trip.departure_datetime)} emphasis />
            <Row
              label="Seats"
              value={
                booking.seat_numbers.length
                  ? `${booking.seats} (${booking.seat_numbers.join(", ")})`
                  : String(booking.seats)
              }
            />
            <Row
              label="Paid"
              value={booking.subscription_id ? "Ride credit" : naira(booking.amount_kobo)}
            />
          </dl>
        )}
      </div>

      {showActions && (
        <div className="mt-4 space-y-2">
          <Button onClick={download} block variant="outline" size="md">
            <Download aria-hidden />
            Download ticket
          </Button>
          <p className="flex items-center justify-center gap-4 pt-1 text-xs text-ink-soft dark:text-cream-100/70">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" aria-hidden />
              Emailed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare className="size-3.5" aria-hidden />
              Sent by SMS
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-cream-200 py-2.5 last:border-0 dark:border-white/10">
      <dt className="shrink-0 text-xs text-ink-soft dark:text-cream-100/70">{label}</dt>
      <dd
        className={cn(
          "text-right text-sm font-semibold text-ink dark:text-cream-50",
          emphasis && "text-base font-extrabold text-forest dark:text-leaf-light",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
