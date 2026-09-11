import { cn } from "@/lib/utils";

/**
 * Skeletons carry the *exact* dimensions of the content they stand in for,
 * so swapping real data in causes zero layout shift.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shimmer rounded-lg", className)} aria-hidden {...props} />;
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-0.5 flex-1" />
        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function TripListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading departures">
      {Array.from({ length: count }).map((_, i) => (
        <TripCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading departures…</span>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-56" />
      <Skeleton className="mt-2 h-4 w-40" />
    </div>
  );
}
