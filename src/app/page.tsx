import type { Metadata } from "next";
import { BatteryCharging } from "lucide-react";

import { HomeHeroSection } from "@/components/home-hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { UploadGoHome } from "@/components/upload-go-home";
import { HomeFaqSection } from "@/components/home-faq-section";
import { HomeSubscriptionsSection } from "@/components/home-subscriptions-section";
import { config } from "@/lib/config";
import { productConfig } from "@/lib/product-config";

export const metadata: Metadata = {
  title: "Ecojindu Shuttle — Umuahia & Aba to Sam Mbakwe Airport",
  description:
    "Scheduled 100% electric shuttles between Umuahia, Aba and Sam Mbakwe Airport. Upload your ticket or plan your trip, confirm, and pay — QR boarding pass ready to board.",
  openGraph: {
    title: "Ecojindu Shuttle",
    description:
      "Electric airport shuttles across Abia State. Book a seat, confirm, and get a QR boarding pass.",
    url: config.siteUrl,
  },
};

export default function HomePage() {
  return (
    <div className="snap-y snap-proximity">
      <HomeHeroSection />

      <HowItWorksSection fareLabel={naira(sampleFare)} />

      <section
        className="snap-start border-b border-white/10 bg-[#009E61] py-8 sm:py-12 lg:py-14"
        id="upload-go"
        aria-labelledby="upload-go-heading"
      >
        <div className="container">
          <UploadGoHome showIntro introOnDark />
        </div>
      </section>

      <HomeSubscriptionsSection />

      <section className="bg-[#009E61] py-10 sm:py-14" id="green">
        <div className="container">
          <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-mint-section text-hero-tint">
              <BatteryCharging className="size-7" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                100% electric · 14-seat Wuling EVs
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Quiet, zero-tailpipe rides between Abia cities and Sam Mbakwe Airport, Owerri.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-6" id="faq">
        <div className="max-w-xl">
          <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">Questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {productConfig.faq.slice(0, 5).map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="dark:text-cream-50">{item.q}</AccordionTrigger>
                <AccordionContent className="dark:text-cream-100/80">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild variant="link" className="mt-2 px-0 font-semibold">
            <Link href="/help">Full help &amp; FAQ</Link>
          </Button>
        </div>
      </section>

      <section className="section-shell pb-10">
        <div className="max-w-xl rounded-3xl border border-cream-300 bg-white px-5 py-8 dark:border-white/15 dark:bg-[var(--surface-raised)] sm:px-8">
          <h2 className="text-xl font-extrabold text-forest dark:text-cream-50">Prefer WhatsApp?</h2>
          <p className="mt-2 text-sm text-ink-muted dark:text-cream-100/80">
            Message {config.contactPhone} — same booking API as the web.
          </p>
          <Button asChild variant="whatsapp" size="lg" className="mt-5">
            <a
              href={whatsappLink("Hi Ecojindu, I'd like to book a seat.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden />
              Book on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
