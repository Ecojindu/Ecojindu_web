import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { productConfig } from "@/lib/product-config";

export function HomeFaqSection() {
  return (
    <section
      id="faq"
      className="bg-white py-10 sm:py-12 lg:py-14"
      aria-labelledby="home-faq-heading"
    >
      <div className="container">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-white sm:rounded-[2rem] lg:rounded-[2.25rem]">
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
            <h2
              id="home-faq-heading"
              className="text-center text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
            >
              Questions
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-hero-tint/85 sm:text-base">
              Quick answers about boarding, luggage, and booking — before you upload your ticket.
            </p>

            <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
              <div className="rounded-2xl bg-white p-5 text-hero-tint shadow-soft sm:p-6 lg:p-7">
                <Accordion type="single" collapsible>
                  {productConfig.faq.slice(0, 5).map((item, i) => (
                    <AccordionItem key={item.q} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-hero-tint hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-hero-tint/85">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="mt-8 flex justify-center sm:mt-10">
              <Button
                asChild
                size="lg"
                className="min-w-[min(100%,18rem)] bg-hero-tint text-white hover:bg-hero-tint/90"
              >
                <Link href="/help">Full help &amp; FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
