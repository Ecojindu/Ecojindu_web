import type { ReactNode } from "react";
import Link from "next/link";

import { config } from "@/lib/config";

export const LEGAL_LAST_UPDATED = "29 October 2026";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white py-8 sm:py-12 lg:py-14">
      <div className="container">
        <article className="mx-auto max-w-3xl text-hero-tint">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-hero-tint/80">Last updated {LEGAL_LAST_UPDATED}</p>
          <p className="mt-5 text-base leading-relaxed">{intro}</p>
          <div className="mt-8 space-y-8 text-[15px] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_li]:mt-1.5 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
          <p className="mt-10 border-t border-hero-tint/15 pt-6 text-sm">
            Questions? Email{" "}
            <a className="font-semibold underline underline-offset-2" href={`mailto:${config.contactEmail}`}>
              {config.contactEmail}
            </a>{" "}
            or call {config.contactPhone}. See also our{" "}
            <Link className="font-semibold underline underline-offset-2" href="/terms">
              Terms
            </Link>
            ,{" "}
            <Link className="font-semibold underline underline-offset-2" href="/privacy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="font-semibold underline underline-offset-2" href="/refunds">
              Refund &amp; Cancellation Policy
            </Link>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
