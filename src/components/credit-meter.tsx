"use client";

import { CalendarClock, Sparkles } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import type { Subscription } from "@/lib/types";

/**
 * Ride-credit balance as a segmented meter — one segment per credit, so a
 * subscriber reads their balance at a glance instead of parsing "10 / 12".
 * Falls back to a continuous bar above 24 credits (Tier 2 has 50).
 */
export function CreditMeter({
  subscription,
  className,
}: {
  subscription: Subscription;
  className?: string;
}) {
  const { credits_total, credits_used, credits_remaining } = subscription;
  const pct = credits_total ? (credits_remaining / credits_total) * 100 : 0;
  const segmented = credits_total <= 24;

  const daysLeft = subscription.expires_at
    ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / 86_400_000)
    : null;
  const expiringSoon = daysLeft !== null && daysLeft <= 14;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-gradient-to-br from-forest to-forest-light p-6 text-white shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-leaf-light">
            Ride credits
          </p>
          <p className="mt-1.5 flex items-baseline gap-1.5">
            <span className="tabular text-5xl font-extrabold leading-none">{credits_remaining}</span>
            <span className="text-lg font-semibold text-cream-100/60">/ {credits_total}</span>
          </p>
          <p className="mt-1.5 text-sm text-cream-100/75">{subscription.plan_name}</p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
          <Sparkles className="size-5 text-leaf" aria-hidden />
        </span>
      </div>

      {/* Meter */}
      <div
        className="mt-6"
        role="meter"
        aria-valuenow={credits_remaining}
        aria-valuemin={0}
        aria-valuemax={credits_total}
        aria-label={`${credits_remaining} of ${credits_total} ride credits remaining`}
      >
        {segmented ? (
          <div className="flex gap-1">
            {Array.from({ length: credits_total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2.5 flex-1 rounded-full transition-colors duration-500",
                  i < credits_remaining ? "bg-leaf" : "bg-white/15",
                )}
              />
            ))}
          </div>
        ) : (
          <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
            <span
              className="block h-full rounded-full bg-leaf transition-[width] duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-cream-100/70">
          {credits_used} used · {credits_remaining} left
        </span>
        {subscription.expires_at && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold",
              expiringSoon ? "bg-[#F6E7C4] text-[#7A5A12]" : "bg-white/10 text-cream-100/80",
            )}
          >
            <CalendarClock className="size-3.5" aria-hidden />
            {expiringSoon && daysLeft !== null
              ? `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
              : `Valid to ${formatDate(subscription.expires_at)}`}
          </span>
        )}
      </div>
    </div>
  );
}
