import * as React from "react";
import { Upload, Bus, QrCode } from "lucide-react";

const STEPS = [
  {
    step: "Step 01",
    title: "Upload your ticket",
    body: "Snap a photo or paste your code. We pull your flight + route.",
    bgColor: "bg-[#C9FDD7]",
    icon: <Upload className="size-6 sm:size-6 stroke-[2.2] text-white" aria-hidden="true" />,
  },
  {
    step: "Step 02",
    title: "We pick your shuttle",
    body: "Matched to the next electric run from Umuahia or Aba.",
    bgColor: "bg-[#A4CDA1]",
    icon: <Bus className="size-6 sm:size-6 stroke-[2] text-white" aria-hidden="true" />,
  },
  {
    step: "Step 03",
    title: "Confirm & Pay",
    body: "Review, pay with card / transfer / USSD, get your QR instantly.",
    bgColor: "bg-[#D8F2A9]",
    icon: <QrCode className="size-6 sm:size-6 stroke-[2] text-white" aria-hidden="true" />,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="snap-start bg-hero-tint py-14 sm:py-20 lg:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2
            id="how-it-works-heading"
            className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            How it works
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-3 lg:gap-8">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className={`flex flex-col items-start justify-between rounded-[28px] sm:rounded-[32px] ${item.bgColor} p-6 sm:p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                {/* Compact icon placed top-left */}
                <span className="grid size-12 sm:size-14 place-items-center rounded-2xl bg-hero-tint text-white shadow-soft">
                  {item.icon}
                </span>

                {/* Content Block */}
                <div className="mt-6 flex flex-1 flex-col items-start sm:mt-8">
                  <h3 className="text-xl font-extrabold tracking-tight text-[#0F291B] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm font-bold text-[#0F291B] sm:text-base">
                    {item.step}
                  </p>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-[#1C3E2A]/90 sm:text-sm">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
