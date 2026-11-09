import { Upload, Bus, CheckCircle2, QrCode } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload your ticket",
    body: "Snap a photo, upload a PDF, or paste your booking code. We pull your flight time and route so you are not retyping details.",
  },
  {
    step: "02",
    icon: Bus,
    title: "We pick your shuttle",
    body: "We match you to the next scheduled electric run from Umuahia or Aba — the right direction for your flight, with live seat counts.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Confirm details",
    body: "Review passengers, pickup city, travel date, and your mobile number on one screen. Adjust anything before you continue to payment.",
  },
  {
    step: "04",
    icon: QrCode,
    title: "Pay & get QR",
    body: "Pay with card, bank transfer, or USSD. Your QR boarding pass is ready right away — show it when you board the shuttle.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="snap-start bg-hero-tint/90 py-10 sm:py-12 lg:py-16"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container px-4 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto w-full max-w-[62rem] xl:max-w-[72rem]">
          <h2
            id="how-it-works-heading"
            className="text-center text-display-sm font-extrabold tracking-tight text-white sm:text-display-md"
          >
            How it works
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex flex-col justify-between rounded-2xl border border-cream-300/80 bg-white p-6 shadow-soft transition-all hover:shadow-md dark:border-white/10 dark:bg-[var(--card-bg)]"
                >
                  <div>
                    <span className="flex size-11 items-center justify-center rounded-full bg-hero-tint/90 text-white">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-hero-tint dark:text-white sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-xs text-hero-tint/70 dark:text-white/60">
                      Step {item.step}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-hero-tint/80 dark:text-white/70 sm:text-sm">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
