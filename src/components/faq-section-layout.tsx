import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FaqSectionLayoutProps {
  heading: string;
  headingId: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Use h1 on standalone pages (e.g. Help). */
  headingLevel?: "h1" | "h2";
  className?: string;
}

export function FaqSectionLayout({
  heading,
  headingId,
  description,
  children,
  footer,
  headingLevel = "h2",
  className,
}: FaqSectionLayoutProps) {
  const Heading = headingLevel;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-white sm:rounded-[2rem] lg:rounded-[2.25rem]",
        className,
      )}
      aria-labelledby={headingId}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.92)_0%,rgba(197,237,203,0.55)_22%,#C5EDCB_48%,#C5EDCB_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[5%] left-[5%] h-[75%] w-[45%] rounded-full bg-mint-section/90 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[70%] w-[55%] translate-x-[8%] rounded-full bg-leaf/30 blur-3xl"
        aria-hidden
      />

      <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <Heading
          id={headingId}
          className="text-center text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
        >
          {heading}
        </Heading>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-hero-tint/85 sm:text-base">
          {description}
        </p>

        <div className="mx-auto mt-8 max-w-2xl sm:mt-10">{children}</div>

        {footer ? (
          <div className="mx-auto mt-8 max-w-2xl sm:mt-10">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
