import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-cream-200 text-ink-muted",
        leaf: "bg-leaf/15 text-moss-dark",
        forest: "bg-forest text-white",
        teal: "bg-teal/15 text-teal-dark",
        amber: "bg-[#F6E7C4] text-[#8A6414]",
        clay: "bg-clay-light text-clay-dark",
        outline: "border border-cream-400 bg-white text-ink-muted",
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
