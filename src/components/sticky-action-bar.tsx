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
  /** Hide the bar (e.g. while the in-page CTA is still visible). */
  hidden?: boolean;
}

/**
 * Thumb-reachable primary actions for booking steps.
 * Sets --sticky-action-h so main content clears both this bar and the tab bar.
 */
export function StickyActionBar({
  children,
  meta,
  className,
  aboveNav = true,
  hidden = false,
}: StickyActionBarProps) {
  React.useEffect(() => {
    if (hidden) {
      document.documentElement.style.setProperty("--sticky-action-h", "0px");
      return;
    }
    // ~81px content + safe area is already on the nav; sticky sits above nav on mobile.
    document.documentElement.style.setProperty(
      "--sticky-action-h",
      aboveNav ? "5.25rem" : "5.25rem",
    );
    return () => {
      document.documentElement.style.setProperty("--sticky-action-h", "0px");
    };
  }, [hidden, aboveNav]);

  if (hidden) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-30 border-t border-cream-300 bg-white/95 backdrop-blur-md lg:hidden",
        "dark:border-white/15 dark:bg-[var(--surface-raised)]/95",
        aboveNav ? "bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom,0px))]" : "bottom-0",
        className,
      )}
      style={aboveNav ? undefined : { paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="section-shell flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        {meta ? (
          <div className="min-w-0 text-sm text-ink-muted dark:text-cream-100/75">{meta}</div>
        ) : null}
        <div className={cn("flex w-full gap-2", meta && "sm:w-auto sm:min-w-[280px]")}>{children}</div>
      </div>
    </div>
  );
}
