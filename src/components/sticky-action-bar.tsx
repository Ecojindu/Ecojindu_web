"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface StickyActionBarProps {
  children: React.ReactNode;
  /** Optional total / status line above the primary button. */
  meta?: React.ReactNode;
  className?: string;
  /** When true, lift above the bottom nav (default). */
  aboveNav?: boolean;
}

/**
 * Thumb-reachable primary actions for every booking step.
 * Always keep the fare visible here — never let the total drop to ₦0.
 */
export function StickyActionBar({ children, meta, className, aboveNav = true }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 z-30 border-t border-cream-300 bg-cream-50/95 backdrop-blur-md dark:border-white/10 dark:bg-forest-dark/95",
        aboveNav ? "bottom-[calc(3.5rem+env(safe-area-inset-bottom))] lg:bottom-0" : "bottom-0",
        className,
      )}
      style={aboveNav ? undefined : { paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        {meta ? <div className="min-w-0 text-sm text-ink-muted dark:text-cream-100/70">{meta}</div> : null}
        <div className={cn("flex w-full gap-2", meta && "sm:w-auto sm:min-w-[280px]")}>{children}</div>
      </div>
    </div>
  );
}
