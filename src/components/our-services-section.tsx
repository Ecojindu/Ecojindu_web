import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldCheck, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

const SERVICES = [
  { label: "Airport shuttle", icon: ShieldCheck },
  { label: "Fixed fare", icon: Wallet },
  { label: "Daily departures", icon: Clock },
] as const;

export function OurServicesSection() {
  return (
    <section
      id="our-services"
      className="bg-[#009E61] py-10 sm:py-12 lg:py-14"
      aria-labelledby="our-services-heading"
    >
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-sm font-medium text-white/85">Our services</p>
              <h2
                id="our-services-heading"
                className="mt-3 max-w-md text-balance text-2xl font-extrabold leading-snug tracking-tight text-white sm:text-3xl lg:text-[2.15rem]"
              >
                We get you to Sam Mbakwe on a fixed timetable — no waiting, no haggling.
              </h2>

              <ul className="mt-6 flex flex-wrap gap-2.5">
                {SERVICES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-[#1E4927]"
                    >
                      <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                      {item.label}
                    </li>
                  );
                })}
              </ul>

              <Button
                asChild
                size="lg"
                className="mt-8 border-0 bg-white text-[#1E4927] hover:bg-white/90"
              >
                <Link href="#upload-go">Get started</Link>
              </Button>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/our-services-shuttles-cropped.png"
                alt="Ecojindu shuttle fleet — white and dark vehicles"
                width={534}
                height={302}
                sizes="(max-width: 1024px) 90vw, 480px"
                className="h-auto w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.22)]"
              />
            </div>
        </div>
      </div>
    </section>
  );
}
