"use client";

import Link from "next/link";
import { UserCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function BookAuthBanner() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-leaf/30 bg-leaf/10 p-4 text-hero-tint sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-leaf/20 text-hero-tint">
            <UserCheck className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-medium">
            Signed in as <span className="font-bold">{user.full_name}</span>{" "}
            <span className="text-xs text-hero-tint/75">({user.email || user.phone})</span>
          </p>
        </div>
        <Link
          href="/trips"
          className="text-xs font-bold text-hero-tint underline underline-offset-4 hover:opacity-80 sm:text-sm"
        >
          View your trips &amp; credits &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-cream-300/90 bg-white p-4 text-hero-tint shadow-soft sm:flex-row sm:items-center sm:px-5 dark:border-white/10 dark:bg-[var(--card-bg)]">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hero-tint/10 text-hero-tint dark:bg-white/10 dark:text-white">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <p className="text-xs text-hero-tint/90 sm:text-sm dark:text-white/90">
          Have an Ecojindu account or subscription pass?
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login?next=/book"
          className="rounded-full bg-hero-tint/90 px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 dark:bg-leaf dark:text-hero-tint"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register?next=/book"
          className="rounded-full border border-hero-tint/20 px-3.5 py-1.5 text-xs font-semibold text-hero-tint hover:bg-hero-tint/5 dark:border-white/20 dark:text-white"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
