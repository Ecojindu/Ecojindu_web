import Link from "next/link";
import { Compass } from "lucide-react";

import { RouteLine } from "@/components/brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] items-center py-16">
      <div className="mx-auto max-w-md text-center">
        <RouteLine className="mx-auto mb-6 h-20 opacity-60" />
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-leaf/15">
          <Compass className="size-7 text-moss" aria-hidden />
        </span>
        <h1 className="mt-5 text-display-sm font-extrabold text-forest">
          This stop isn&apos;t on our route
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
          The page you were after doesn&apos;t exist. Let&apos;s get you back on board.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/search">Find a departure</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
