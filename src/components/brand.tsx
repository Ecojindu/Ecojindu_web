import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark. The leaf sits in the counter of the "j" — a small nod to the EV story. */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Ecojindu Shuttle — home"
    >
      <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-forest transition-transform duration-200 group-hover:scale-105">
        <LeafMark className="size-5 text-leaf" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[17px] font-extrabold tracking-tight",
            variant === "dark" ? "text-forest" : "text-white",
          )}
        >
          Ecojindu
          <span className="text-leaf">.</span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
            variant === "dark" ? "text-ink-soft" : "text-leaf-light",
          )}
        >
          Shuttle
        </span>
      </span>
    </Link>
  );
}

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 4C20 4 18.5 3 14.5 3C8.7 3 4 7.7 4 13.5C4 17.6 6.4 20 6.4 20L20 4Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M6.4 20C6.4 20 9 21 12.5 20.2C17.5 19 21 14.5 21 9.5C21 6.5 20 4 20 4L6.4 20Z"
        fill="currentColor"
      />
      <path d="M6 20L12 12" stroke="#2F5233" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The transit-map motif from the pitch deck: a route line with stop nodes.
 * Decorative only — hidden from assistive tech.
 */
export function RouteLine({
  className,
  animate = false,
  stops = 4,
}: {
  className?: string;
  animate?: boolean;
  stops?: number;
}) {
  const nodes = Array.from({ length: stops }, (_, i) => 60 + (i * 680) / (stops - 1));

  return (
    <svg
      viewBox="0 0 800 120"
      fill="none"
      className={cn("w-full", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M60 78 C 180 78, 200 30, 320 30 S 500 92, 620 92 S 720 44, 740 44"
        stroke="url(#routeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={animate ? "1000" : undefined}
        className={animate ? "animate-draw-line" : undefined}
      />
      {nodes.map((x, i) => {
        const y = [78, 30, 92, 44][i % 4];
        return (
          <g key={x}>
            <circle cx={x} cy={y} r="9" fill="#EAE8DB" />
            <circle cx={x} cy={y} r="5.5" fill={i === nodes.length - 1 ? "#2BAE8E" : "#7CB342"} />
          </g>
        );
      })}
      <defs>
        <linearGradient id="routeGradient" x1="60" y1="0" x2="740" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7CB342" />
          <stop offset="1" stopColor="#2BAE8E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Origin → destination connector used inside trip cards. */
export function StopConnector({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} aria-hidden>
      <span className="size-2.5 rounded-full border-2 border-leaf bg-white" />
      <span className="route-connector h-2.5" />
      <span className="size-2.5 rounded-full bg-teal" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-moss">{eyebrow}</p>
      )}
      <h2 className="text-balance text-display-sm font-extrabold text-forest sm:text-display-md">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
