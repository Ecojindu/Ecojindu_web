"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { addDaysISO, cn, humanDayLabel, todayISO } from "@/lib/utils";

/**
 * Horizontal day strip. Seat counts come from the availability calendar so a
 * fully booked day is visible before the passenger taps it.
 */
export function DateSwitcher({
  value,
  onChange,
  availability,
  days = 10,
}: {
  value: string;
  onChange: (date: string) => void;
  availability?: Record<string, number>;
  days?: number;
}) {
  const today = todayISO();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const dates = React.useMemo(
    () => Array.from({ length: days }, (_, i) => addDaysISO(today, i)),
    [today, days],
  );

  // Keep the selected chip in view when the date changes from elsewhere.
  React.useEffect(() => {
    const node = scrollRef.current?.querySelector<HTMLElement>(`[data-date="${value}"]`);
    node?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [value]);

  function nudge(direction: -1 | 1) {
    scrollRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => nudge(-1)}
        className="absolute -left-1 top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white shadow-soft dark:border dark:border-white/10 dark:bg-forest sm:grid"
        aria-label="Scroll to earlier dates"
      >
        <ChevronLeft className="size-4 text-forest dark:text-cream-50" aria-hidden />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Travel date"
      >
        {dates.map((date) => {
          const active = date === value;
          const seatsLeft = availability?.[date];
          const soldOut = seatsLeft === 0;

          return (
            <button
              key={date}
              type="button"
              data-date={date}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(date)}
              disabled={soldOut}
              className={cn(
                "tap-target flex min-w-[92px] shrink-0 flex-col items-center justify-center gap-0.5",
                "rounded-xl border-2 px-3 py-2.5 transition-all",
                active
                  ? "border-moss bg-moss text-white shadow-soft"
                  : soldOut
                    ? "cursor-not-allowed border-cream-300 bg-cream-100 text-ink-soft/60 dark:border-white/10 dark:bg-forest-light/20 dark:text-white/30"
                    : "border-cream-300 bg-white text-forest hover:border-leaf dark:border-white/15 dark:bg-forest-light/40 dark:text-cream-50 dark:hover:border-leaf/60",
              )}
            >
              <span className="text-sm font-bold">{humanDayLabel(date)}</span>
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  active ? "text-white/80" : soldOut ? "text-clay" : "text-ink-soft dark:text-cream-100/70",
                )}
              >
                {seatsLeft === undefined
                  ? " "
                  : soldOut
                    ? "Sold out"
                    : `${seatsLeft} seats`}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => nudge(1)}
        className="absolute -right-1 top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white shadow-soft dark:border dark:border-white/10 dark:bg-forest sm:grid"
        aria-label="Scroll to later dates"
      >
        <ChevronRight className="size-4 text-forest dark:text-cream-50" aria-hidden />
      </button>
    </div>
  );
}
