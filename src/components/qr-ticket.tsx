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
      <div className="overflow-hidden rounded-3xl bg-white shadow-lift">
        {/* Stub header */}
        <div className="bg-forest px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-leaf-light">
                Boarding pass
              </p>
              <p className="mt-1 text-lg font-extrabold tracking-tight">Ecojindu Shuttle</p>
            </div>
            <Ticket className="size-6 text-leaf" aria-hidden />
          </div>
        </div>

        {/* Reference */}
        <div className="border-b border-dashed border-cream-400 px-6 py-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-moss">
            Booking reference
          </p>
          <p className="tabular mt-1 font-mono text-3xl font-extrabold tracking-[0.12em] text-forest">
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
            className="absolute -left-3 top-0 size-6 -translate-y-1/2 rounded-full bg-cream"
            aria-hidden
          />
          <span
            className="absolute -right-3 top-0 size-6 -translate-y-1/2 rounded-full bg-cream"
            aria-hidden
          />

          <div className="mx-auto grid aspect-square w-full max-w-[240px] place-items-center rounded-2xl border-2 border-dashed border-cream-400 p-3">
            {imageFailed ? (
              <p className="px-4 text-center text-xs text-ink-soft">
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
          <p className="mt-3 text-center text-xs text-ink-soft">
            Show this at the Nnenna Otti Bus Terminal gate
          </p>
        </div>

        {/* Trip detail */}
        {trip && (
          <dl className="border-t border-cream-200 px-6 py-5 text-sm">
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
          <p className="flex items-center justify-center gap-4 pt-1 text-xs text-ink-soft">
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
    <div className="flex items-baseline justify-between gap-4 border-b border-cream-200 py-2.5 last:border-0">
      <dt className="shrink-0 text-xs text-ink-soft">{label}</dt>
      <dd
        className={cn(
          "text-right text-sm font-semibold text-ink",
          emphasis && "text-base font-extrabold text-forest",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
