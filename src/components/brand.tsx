import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Official eShuttle aerodynamic speed-leaf emblem mark.
 * Uses the exact graphic from the official logo asset.
 */
export function EShuttleMark({ className }: { className?: string; colorMode?: string }) {
  return (
    <img
      src="/images/logo-mark.png"
      alt="eShuttle"
      className={cn("h-7 w-auto object-contain", className)}
    />
  );
}

/** Legacy alias for backwards compatibility */
export const LeafMark = EShuttleMark;

/**
 * Official eShuttle brand logo component.
 * Uses the exact official artwork (emblem + typography) provided.
 */
export function Logo({
  className,
  variant = "dark",
  layout = "horizontal",
}: {
  className?: string;
  variant?: "dark" | "light";
  layout?: "horizontal" | "stacked";
}) {
  const isLight = variant === "light";
  const imgSrc =
    layout === "stacked"
      ? "/images/logo.png"
      : isLight
      ? "/images/logo-horizontal-light.png"
      : "/images/logo-horizontal.png";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center transition-opacity hover:opacity-95", className)}
      aria-label="eShuttle — home"
    >
      <img
        src={imgSrc}
        alt="eShuttle"
        className={cn(
          "w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]",
          layout === "stacked" ? "h-12" : "h-7 sm:h-8"
        )}
      />
    </Link>
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
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-forest dark:text-cream-100/75">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-display-sm font-extrabold text-forest dark:text-cream-50 sm:text-display-md">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-muted dark:text-cream-100/80 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
