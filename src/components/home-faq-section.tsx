import Link from "next/link";

import { FaqAccordionCard } from "@/components/faq-accordion-card";
import { FaqSectionLayout } from "@/components/faq-section-layout";
import { Button } from "@/components/ui/button";
import { productConfig } from "@/lib/product-config";

export function HomeFaqSection() {
  return (
    <section id="faq" className="bg-white py-10 sm:py-12 lg:py-14">
      <div className="container">
        <FaqSectionLayout
          heading="Questions"
          headingId="home-faq-heading"
          description="Quick answers about boarding, luggage, and booking — before you upload your ticket."
          footer={
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="min-w-[min(100%,18rem)] bg-hero-tint text-white hover:bg-hero-tint/90"
              >
                <Link href="/help">Full help &amp; FAQ</Link>
              </Button>
            </div>
          }
        >
          <FaqAccordionCard items={productConfig.faq.slice(0, 5)} />
        </FaqSectionLayout>
      </div>
    </section>
  );
}
