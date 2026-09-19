import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-cream-200 text-ink-muted dark:bg-white/10 dark:text-cream-100",
        leaf: "bg-leaf/15 text-moss-dark dark:bg-leaf/25 dark:text-leaf-light",
        forest: "bg-forest text-white dark:bg-forest-light dark:text-cream-50",
        teal: "bg-teal/15 text-teal-dark dark:bg-teal/25 dark:text-teal-light",
        amber: "bg-[#F6E7C4] text-[#8A6414] dark:bg-amber-900/40 dark:text-amber-200",
        clay: "bg-clay-light text-clay-dark dark:bg-clay/20 dark:text-clay-light",
        outline: "border border-cream-400 bg-white text-ink-muted dark:border-white/20 dark:bg-transparent dark:text-cream-100",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px]",
        md: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

/** Booking status → badge styling + human label, used across the site. */
export function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    pending_payment: { label: "Awaiting payment", variant: "amber" },
    confirmed: { label: "Confirmed", variant: "leaf" },
    checked_in: { label: "Checked in", variant: "teal" },
    completed: { label: "Completed", variant: "neutral" },
    cancelled: { label: "Cancelled", variant: "clay" },
  };
  const item = map[status] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export { badgeVariants };
