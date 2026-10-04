import Image from "next/image";

const HERO_IMAGE = "/images/hero-airport-shuttle.png";
const HERO_IMAGE_MOBILE = "/images/hero-airport-shuttle-mobile.png";
const HERO_ALT =
  "Passenger aircraft and Ecojindu shuttle at Sam Mbakwe Airport — Umuahia and Aba airport transfers";

function HeroCopy({ centered }: { centered?: boolean }) {
  return (
    <div className={centered ? "mx-auto max-w-md text-center" : "max-w-xl"}>
      <h1 className="text-balance text-display-sm font-extrabold tracking-tight text-white sm:text-display-md">
        Plan.Book.Travel
      </h1>
      <p className="mt-3 text-pretty text-base leading-snug text-white/90 sm:leading-relaxed">
        Plan or book your shuttle to airport by uploading your ticket or booking code for a
        matched departure. Or plan city, date, and seats—one checkout, QR pass to board.
      </p>
    </div>
  );
}

/** Mobile: full first screen — 40% copy / 60% band; photo shifted up, size unchanged. */
export function HomeHeroMobile() {
  return (
    <section
      className="flex h-[calc(100svh-60px)] min-h-0 snap-start flex-col overflow-hidden bg-[#009E61] sm:h-[calc(100svh-68px)] md:hidden"
      aria-label="Plan, book, and travel — Ecojindu airport shuttle"
    >
      <div className="flex h-[40%] min-h-0 flex-col justify-center px-5">
        <HeroCopy centered />
      </div>

      <div className="relative h-[60%] min-h-0 px-4 pb-5">
        <div className="absolute left-4 right-4 top-3 bottom-5 mx-auto max-w-lg -translate-y-5 overflow-hidden rounded-[1.75rem] shadow-soft ring-1 ring-white/10">
          <Image
            src={HERO_IMAGE_MOBILE}
            alt={HERO_ALT}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 0px"
          />
        </div>
      </div>
    </section>
  );
}

/** Full-viewport hero for tablet and desktop. */
export function HomeHeroDesktop() {
  return (
    <section
      className="relative hidden h-[calc(100svh-60px)] snap-start overflow-hidden md:block md:h-[calc(100svh-68px)]"
      aria-label="Plan, book, and travel — Ecojindu airport shuttle"
    >
      <Image
        src={HERO_IMAGE}
        alt={HERO_ALT}
        fill
        priority
        className="z-0 object-cover object-[center_28%]"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-hero-tint/[0.52]"
        aria-hidden
      />
      <div className="container relative z-[2] flex h-full flex-col justify-center py-10 sm:py-12">
        <HeroCopy />
      </div>
    </section>
  );
}

export function HomeHeroSection() {
  return (
    <>
      <HomeHeroMobile />
      <HomeHeroDesktop />
    </>
  );
}
