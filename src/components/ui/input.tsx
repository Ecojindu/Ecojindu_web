"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Rendered inside the field, before the text (e.g. a "+234" addon). */
  leadingAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, leadingAddon, ...props }, ref) => {
    const field = (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-14 w-full rounded-xl border-2 bg-white px-4 text-base text-ink",
          "placeholder:text-ink-soft/70",
          "transition-colors duration-150",
          "focus:outline-none focus-visible:ring-0",
          "dark:bg-forest/50 dark:border-white/15 dark:text-cream-50 dark:placeholder:text-cream-100/40 dark:focus:border-leaf",
          invalid
            ? "border-clay focus:border-clay dark:border-clay"
            : "border-cream-300 focus:border-moss",
          "disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60 dark:disabled:bg-forest-dark/50",
          leadingAddon && "rounded-l-none border-l-0 pl-2",
          className,
        )}
        {...props}
      />
    );

    if (!leadingAddon) return field;

    return (
      <div className="flex">
        <span
          className={cn(
            "flex h-14 items-center rounded-l-xl border-2 border-r-0 bg-cream-100 px-3",
            "text-base font-medium text-ink-muted",
            "dark:bg-forest/70 dark:border-white/15 dark:text-cream-100/80",
            invalid ? "border-clay" : "border-cream-300",
          )}
          aria-hidden
        >
          {leadingAddon}
        </span>
        {field}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
