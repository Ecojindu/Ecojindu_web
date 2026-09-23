import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { FaqAccordionCard } from "@/components/faq-accordion-card";
import { FaqSectionLayout } from "@/components/faq-section-layout";
import { Button } from "@/components/ui/button";
import { config, whatsappLink } from "@/lib/config";
import { productConfig } from "@/lib/product-config";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Answers about Ecojindu Shuttle routes, fares, cancellations and QR tickets.",
};

/** FAQ answers are in the server HTML — not loaded after hydration. */
export default function HelpPage() {
  return (
    <div className="bg-white py-8 sm:py-12 lg:py-14">
      <div className="container">
        <FaqSectionLayout
          heading="Help"
          headingId="help-heading"
          headingLevel="h1"
          description="Plain answers for travellers. Still stuck? WhatsApp or email us."
          footer={
            <>
              {!productConfig.railTransfersLive ? (
                <div className="rounded-2xl border border-dashed border-hero-tint/25 bg-white/80 p-5 text-hero-tint shadow-soft">
                  <h2 className="font-bold">Rail transfers</h2>
                  <p className="mt-1 text-sm text-hero-tint/85">
                    Coming soon — we will open this when the route is live.
                  </p>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild variant="whatsapp" size="lg" className="sm:min-w-[14rem]">
                  <a
                    href={whatsappLink("Hi Ecojindu, I need help with a booking.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden />
                    WhatsApp {config.contactPhone}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-hero-tint/30 text-hero-tint sm:min-w-[14rem]">
                  <a href={`mailto:${config.contactEmail}`}>Email {config.contactEmail}</a>
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-hero-tint/90">
                <Link
                  href="/manage"
                  className="font-semibold text-hero-tint underline-offset-2 hover:underline"
                >
                  Manage a booking without signing in
                </Link>
              </p>
            </>
          }
        >
          <FaqAccordionCard items={productConfig.faq} defaultValue="faq-0" />
        </FaqSectionLayout>
      </div>
    </div>
  );
}
