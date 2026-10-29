const STEPS = [
  {
    step: "01",
    title: "Upload your ticket",
    body: "Snap a photo, upload a PDF, or paste your booking code. We pull your flight time and route so you are not retyping details.",
  },
  {
    step: "02",
    title: "We pick your shuttle",
    body: "We match you to the next scheduled electric run from Umuahia or Aba — the right direction for your flight, with live seat counts.",
  },
  {
    step: "03",
    title: "Confirm details",
    body: "Review passengers, pickup city, travel date, and your mobile number on one screen. Adjust anything before you continue to payment.",
  },
  {
    step: "04",
    title: "Pay & get QR",
    body: "Pay with card, bank transfer, or USSD. Your QR boarding pass is ready right away — show it when you board the shuttle.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="snap-start bg-mint-section py-10 sm:py-12 lg:py-14"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container px-4 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto w-full max-w-[62rem] xl:max-w-[66rem]">
          <h2
            id="how-it-works-heading"
            className="text-center text-display-sm font-extrabold tracking-tight text-hero-tint sm:text-display-md"
          >
            How it works
          </h2>

          <ul className="mx-auto mt-5 grid w-full max-w-lg grid-cols-1 gap-3 sm:max-w-2xl sm:grid-cols-2 sm:gap-3 md:max-w-4xl lg:mt-6 lg:max-w-none lg:gap-4 xl:gap-5">
              {STEPS.map((item) => (
                <li
                  key={item.step}
                  className="flex flex-col rounded-xl bg-white p-4 text-hero-tint shadow-soft sm:min-h-[11.5rem] sm:rounded-2xl sm:p-5 lg:min-h-[12rem] lg:p-6"
                >
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center self-start rounded-full bg-mint-section text-[0.6875rem] font-bold tabular tracking-wide text-hero-tint sm:size-10 sm:text-xs"
                    aria-hidden
                  >
                    {item.step}
                  </span>
                  <div className="mt-3 flex flex-1 flex-col items-start text-left sm:mt-3.5 sm:items-center sm:text-center">
                    <h3 className="text-sm font-bold leading-snug sm:text-base lg:text-lg">{item.title}</h3>
                    <p className="mt-2 text-[0.6875rem] leading-relaxed text-hero-tint/85 sm:text-xs sm:leading-relaxed lg:text-sm lg:leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
