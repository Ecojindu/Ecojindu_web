"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = { q: string; a: string };

interface FaqAccordionCardProps {
  items: readonly FaqItem[];
  defaultValue?: string;
}

export function FaqAccordionCard({ items, defaultValue }: FaqAccordionCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 text-hero-tint shadow-soft sm:p-6 lg:p-7">
      <Accordion type="single" collapsible defaultValue={defaultValue}>
        {items.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-hero-tint hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-hero-tint/85">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
