"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold " +
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
    "disabled:pointer-events-none active:scale-[0.98] [&_svg]:size-[1.15em] [&_svg]:shrink-0 " +
    /* Disabled reads as disabled — neutral fill, not faded primary green */
    "disabled:bg-cream-300 disabled:text-ink-soft disabled:shadow-none disabled:opacity-100 " +
    "dark:disabled:bg-white/10 dark:disabled:text-cream-100/45",
  {
    variants: {
      variant: {
        primary:
          "bg-moss text-white shadow-soft hover:bg-moss-dark hover:shadow-lift enabled:dark:bg-moss enabled:dark:hover:bg-moss-dark",
        forest:
          "bg-forest text-white shadow-soft hover:bg-forest-light hover:shadow-lift dark:bg-forest-light dark:hover:bg-forest",
        accent: "bg-teal text-white shadow-soft hover:bg-teal-dark hover:shadow-lift",
        outline:
          "border-2 border-forest/25 bg-transparent text-forest hover:border-forest/45 hover:bg-white " +
          "dark:border-white/25 dark:text-cream-50 dark:hover:bg-white/10 dark:hover:border-white/40 " +
          "disabled:border-cream-400 disabled:bg-transparent",
        secondary:
          "bg-white text-forest shadow-soft hover:bg-cream-100 " +
          "dark:bg-[var(--surface-raised)] dark:text-cream-50 dark:hover:bg-[var(--surface)] " +
          "disabled:bg-cream-200",
        ghost:
          "text-forest hover:bg-forest/[0.06] dark:text-cream-50 dark:hover:bg-white/10 " +
          "disabled:bg-transparent disabled:text-ink-soft",
        link:
          "text-moss underline-offset-4 hover:underline dark:text-[#B8E08A] " +
          "disabled:bg-transparent disabled:no-underline",
        danger: "bg-clay text-white shadow-soft hover:bg-clay-dark",
        /* WhatsApp brand green needs dark text for contrast (~7:1 vs white's 1.98) */
        whatsapp:
          "bg-[#25D366] text-[#0B3D1F] shadow-soft hover:bg-[#1EBE5A] hover:text-[#062816] " +
          "disabled:bg-[#25D366]/40 disabled:text-[#0B3D1F]/50",
      },
      size: {
        sm: "h-11 px-4 text-[13px]",
        md: "h-12 px-6",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-12 w-12",
        xs: "h-9 px-3 text-xs",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, block, asChild = false, loading, loadingText, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, block, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, block, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
