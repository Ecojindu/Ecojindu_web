import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <div className="container max-w-2xl py-8 sm:py-12">
      <h1 className="text-display-sm font-extrabold text-forest dark:text-cream-50">Help</h1>
      <p className="mt-2 text-ink-muted">
        Plain answers for travellers. Still stuck? WhatsApp or email us.
      </p>

      <Accordion type="single" collapsible className="mt-8" defaultValue="faq-0">
        {productConfig.faq.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {!productConfig.railTransfersLive ? (
        <div className="mt-8 rounded-2xl border border-dashed border-cream-400 bg-white/70 p-5 dark:border-white/20 dark:bg-forest/40">
          <h2 className="font-bold text-forest dark:text-cream-50">Rail transfers</h2>
          <p className="mt-1 text-sm text-ink-muted">Coming soon — we will open this when the route is live.</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="whatsapp" size="lg" block>
          <a href={whatsappLink("Hi Ecojindu, I need help with a booking.")} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden />
            WhatsApp {config.contactPhone}
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" block>
          <a href={`mailto:${config.contactEmail}`}>Email {config.contactEmail}</a>
        </Button>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href="/manage" className="font-semibold text-moss underline-offset-2 hover:underline">
          Manage a booking without signing in
        </Link>
      </p>
    </div>
  );
}
