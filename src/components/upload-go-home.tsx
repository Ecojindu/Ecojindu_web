"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Loader2, Upload } from "lucide-react";

import { StickyActionBar } from "@/components/sticky-action-bar";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";
import { productConfig, type PickupCity } from "@/lib/product-config";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_BYTES = 10 * 1024 * 1024;
const READ_TIMEOUT_MS = 45_000;

const PICKUP_KEY = "ejs.pickup_city";

export function rememberPickup(city: PickupCity) {
  if (typeof window !== "undefined") window.localStorage.setItem(PICKUP_KEY, city);
}

export function lastPickup(): PickupCity {
  if (typeof window === "undefined") return "Umuahia";
  const raw = window.localStorage.getItem(PICKUP_KEY);
  return raw === "Aba" ? "Aba" : "Umuahia";
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new ApiError("Reading timed out. Enter your details manually.", "timeout", 408)),
      ms,
    );
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

interface UploadGoHomeProps {
  className?: string;
}

export function UploadGoHome({ className }: UploadGoHomeProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uploadCtaRef = React.useRef<HTMLButtonElement>(null);
  const [pnr, setPnr] = React.useState("");
  const [reading, setReading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  /** Sticky bar only appears once the in-card upload CTA scrolls out of view. */
  const [showSticky, setShowSticky] = React.useState(false);

  React.useEffect(() => {
    const node = uploadCtaRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide sticky while the real upload button is on screen (avoids dual chrome).
        setShowSticky(!entry.isIntersecting);
      },
      { root: null, threshold: 0.15, rootMargin: "0px 0px -48px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reading]);

  async function runRead(file?: File | null) {
    setError(null);

    if (file) {
      if (file.size > MAX_BYTES) {
        setError("That file is over 10 MB. Try a clearer photo or a smaller PDF.");
        return;
      }
      if (!ACCEPT.split(",").includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|pdf)$/i)) {
        setError("Upload a photo (JPG, PNG, WebP) or a PDF of your flight ticket.");
        return;
      }
    } else if (!pnr.trim()) {
      setError("Upload a ticket photo or paste your booking code (PNR).");
      return;
    }

    setReading(true);
    try {
      const result = await withTimeout(
        api.readTicket({
          file: file ?? undefined,
          pnr: pnr.trim() || undefined,
          pickup_city: lastPickup(),
        }),
        READ_TIMEOUT_MS,
      );

      sessionStorage.setItem(
        "ejs.upload_go",
        JSON.stringify({
          ...result,
          pickup_city: lastPickup(),
          seats: 1,
        }),
      );
      router.push("/book/confirm");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn't read that ticket. Try again or book without a flight ticket.",
      );
    } finally {
      setReading(false);
    }
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void runRead(file);
  }

  return (
    <section className={cn("relative", className)}>
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Copy column — desktop left */}
        <div className="lg:pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest dark:text-cream-100/75">
            Upload &amp; Go
          </p>
          <h1 className="mt-2 text-balance text-display-sm font-extrabold tracking-tight text-forest dark:text-cream-50 sm:text-display-md">
            Ecojindu Shuttle
          </h1>
          <p className="mt-3 max-w-md text-pretty text-base text-ink-muted dark:text-cream-100/80">
            Upload your flight ticket. We pick the shuttle that gets you to Sam Mbakwe in time —
            then you confirm and pay.
          </p>
          <p className="mt-5 hidden text-sm text-ink-muted dark:text-cream-100/70 lg:block">
            Fixed fare from{" "}
            <span className="font-bold tabular text-forest dark:text-cream-50">
              ₦{(productConfig.singleFareKobo / 100).toLocaleString("en-NG")}
            </span>{" "}
            · 4 departures daily · 100% electric
          </p>
        </div>

        {/* Upload card — desktop right */}
        <div>
          <div
            className={cn(
              "rounded-3xl border border-cream-300 bg-white p-5 shadow-soft transition-colors",
              "dark:border-white/15 dark:bg-[var(--surface-raised)]",
              dragOver && "border-moss ring-2 ring-moss/25",
              reading && "pointer-events-none opacity-90",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void runRead(file);
            }}
          >
            {reading ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center" role="status" aria-live="polite">
                <Loader2 className="size-10 animate-spin text-moss" aria-hidden />
                <p className="text-base font-bold text-forest dark:text-cream-50">Reading your ticket…</p>
                <p className="text-sm text-ink-muted dark:text-cream-100/75">
                  Extracting flight details. This usually takes a few seconds.
                </p>
              </div>
            ) : (
              <>
                <button
                  ref={uploadCtaRef}
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="tap-target flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-cream-400 bg-cream-50 py-6 text-center dark:border-white/20 dark:bg-[var(--surface)]"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-moss text-white">
                    <Upload className="size-7" aria-hidden />
                  </span>
                  <span className="text-base font-bold text-forest dark:text-cream-50">
                    Upload your flight ticket
                  </span>
                  <span className="flex items-center gap-3 text-xs font-medium text-ink-muted dark:text-cream-100/65">
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon className="size-3.5" aria-hidden /> Photo
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="size-3.5" aria-hidden /> PDF
                    </span>
                    <span>· max 10 MB</span>
                  </span>
                </button>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-cream-400 dark:bg-white/20" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-cream-100/70">
                    or
                  </span>
                  <div className="h-px flex-1 bg-cream-400 dark:bg-white/20" />
                </div>

                <label className="mt-3 block">
                  <span className="sr-only">Booking code (PNR)</span>
                  <Input
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                    placeholder="Paste booking code (PNR)"
                    autoComplete="off"
                    className="h-12"
                  />
                </label>
                <Button
                  type="button"
                  block
                  size="lg"
                  className="mt-3"
                  onClick={() => void runRead(null)}
                  disabled={!pnr.trim()}
                >
                  Read booking code
                </Button>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              capture="environment"
              className="sr-only"
              onChange={onFileChange}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-ink-muted dark:text-cream-100/65">
            Your uploaded ticket is deleted after we read it. We only keep the passenger and flight
            fields you confirm before paying.
          </p>

          {error ? (
            <Alert variant="error" className="mt-4" title="Couldn't read that ticket">
              {error}{" "}
              <button
                type="button"
                className="font-semibold text-forest underline underline-offset-2 dark:text-cream-50"
                onClick={() => router.push("/search")}
              >
                Book without a flight ticket
              </button>
            </Alert>
          ) : null}

          <div className="mt-5">
            <Button asChild variant="outline" size="lg" block>
              <a href="/search">Book without a flight ticket</a>
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-ink-muted dark:text-cream-100/70 lg:hidden">
            Fixed fare from{" "}
            <span className="font-bold tabular text-forest dark:text-cream-50">
              ₦{(productConfig.singleFareKobo / 100).toLocaleString("en-NG")}
            </span>{" "}
            · 4 departures daily · 100% electric
          </p>
        </div>
      </div>

      {/* Sticky only after the in-card CTA scrolls away — one chrome band with the tab bar. */}
      {!reading ? (
        <StickyActionBar
          hidden={!showSticky}
          meta={
            <span>
              Total from{" "}
              <strong className="tabular text-forest dark:text-cream-50">
                ₦{(productConfig.singleFareKobo / 100).toLocaleString("en-NG")}
              </strong>
            </span>
          }
        >
          <Button size="lg" block onClick={() => inputRef.current?.click()} className="min-h-12">
            <Upload aria-hidden />
            Upload your flight ticket
          </Button>
        </StickyActionBar>
      ) : null}
    </section>
  );
}
