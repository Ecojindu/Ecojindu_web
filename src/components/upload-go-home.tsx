"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Loader2, Upload } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanTripHomeFoam } from "@/components/plan-trip-home-foam";
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
  /** When false, only the upload card and actions (headline lives elsewhere). */
  showIntro?: boolean;
  /** Section heading on #1E4927 background (duplicate of hero copy for now). */
  introOnDark?: boolean;
}

interface UploadFoamCardProps {
  inputRef: React.RefObject<HTMLInputElement>;
  reading: boolean;
  dragOver: boolean;
  pnr: string;
  setPnr: (value: string) => void;
  setDragOver: (value: boolean) => void;
  runRead: (file?: File | null) => Promise<void>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadFoamCard({
  inputRef,
  reading,
  dragOver,
  pnr,
  setPnr,
  setDragOver,
  runRead,
  onFileChange,
}: UploadFoamCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-dashed bg-white p-5 shadow-soft transition-colors dark:bg-forest/40",
        dragOver ? "border-moss bg-leaf/10" : "border-cream-400 dark:border-white/20",
        reading && "pointer-events-none opacity-80",
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
        <div className="flex flex-col items-center gap-3 py-8 text-center" role="status">
          <Loader2 className="size-10 animate-spin text-moss" aria-hidden />
          <p className="text-base font-bold text-forest dark:text-cream-50">Reading your ticket…</p>
          <p className="text-sm text-ink-muted dark:text-cream-100/70">
            Extracting flight details. This usually takes a few seconds.
          </p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="tap-target flex w-full flex-col items-center gap-3 rounded-2xl py-6 text-center"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-forest text-leaf">
              <Upload className="size-7" aria-hidden />
            </span>
            <span className="text-base font-bold text-forest dark:text-cream-50">
              Upload your flight ticket
            </span>
            <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium text-ink-muted dark:text-cream-100/60">
              <span className="inline-flex items-center gap-1">
                <ImageIcon className="size-3.5" aria-hidden /> Photo
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText className="size-3.5" aria-hidden /> PDF
              </span>
              <span>· max 10 MB</span>
            </span>
          </button>

          <div className="mt-2 flex items-center gap-3">
            <div className="h-px flex-1 bg-cream-400 dark:bg-white/15" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">or</span>
            <div className="h-px flex-1 bg-cream-400 dark:bg-white/15" />
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
  );
}

export function UploadGoHome({ className, showIntro = true, introOnDark }: UploadGoHomeProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [pnr, setPnr] = React.useState("");
  const [reading, setReading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [foamMode, setFoamMode] = React.useState<"upload" | "plan">("upload");
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [foamShellHeight, setFoamShellHeight] = React.useState<number | null>(null);
  const uploadFaceRef = React.useRef<HTMLDivElement>(null);
  const planFaceRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const syncFoamShellHeight = React.useCallback(() => {
    const active =
      foamMode === "upload" ? uploadFaceRef.current : planFaceRef.current;
    if (!active) return;
    setFoamShellHeight(active.scrollHeight);
  }, [foamMode]);

  React.useLayoutEffect(() => {
    syncFoamShellHeight();
  }, [syncFoamShellHeight, reading, foamMode]);

  React.useEffect(() => {
    const nodes = [uploadFaceRef.current, planFaceRef.current].filter(Boolean);
    if (!nodes.length) return;
    const observer = new ResizeObserver(() => syncFoamShellHeight());
    nodes.forEach((node) => observer.observe(node!));
    return () => observer.disconnect();
  }, [syncFoamShellHeight]);

  function switchFoam(mode: "upload" | "plan") {
    setFoamMode(mode);
    if (mode === "plan") setError(null);
  }

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
      <div className="mx-auto w-full min-w-0 max-w-lg">
        {showIntro ? (
          <>
            {introOnDark ? (
              <h2
                id="upload-go-heading"
                className="max-w-xl text-balance text-display-sm font-extrabold tracking-tight text-white sm:text-display-md"
              >
                Book your airport shuttle
              </h2>
            ) : (
              <h1 className="max-w-xl text-balance text-display-sm font-extrabold tracking-tight text-forest dark:text-cream-50 sm:text-display-md">
                Book your airport shuttle
              </h1>
            )}
            <p
              className={cn(
                "mt-3 max-w-lg text-pretty text-base leading-snug sm:leading-relaxed",
                introOnDark ? "text-white/90" : "text-ink-muted dark:text-cream-100/75",
              )}
            >
              Upload a ticket photo, PDF, or booking code—we match your flight from Umuahia or Aba.
              No ticket? Plan city, date, and seats below, then pay and board with your QR pass.
            </p>
          </>
        ) : (
          <h2 id="upload-go-heading" className="sr-only">
            Upload your flight ticket
          </h2>
        )}

        <div
          className={cn("relative w-full", showIntro ? "mt-6" : "mt-0")}
          aria-live="polite"
        >
          {reduceMotion ? (
            foamMode === "upload" ? (
              <UploadFoamCard
                inputRef={inputRef}
                reading={reading}
                dragOver={dragOver}
                pnr={pnr}
                setPnr={setPnr}
                setDragOver={setDragOver}
                runRead={runRead}
                onFileChange={onFileChange}
              />
            ) : (
              <PlanTripHomeFoam />
            )
          ) : (
            <div
              className="w-full overflow-hidden [perspective:1200px]"
              style={{
                height: foamShellHeight ?? undefined,
                transition: "height 560ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div
                className={cn(
                  "relative w-full transition-transform duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]",
                  foamMode === "plan" && "[transform:rotateY(180deg)]",
                )}
                style={{ height: foamShellHeight ?? undefined }}
              >
                <div
                  ref={uploadFaceRef}
                  aria-hidden={foamMode !== "upload"}
                  className={cn(
                    "absolute inset-x-0 top-0 [backface-visibility:hidden]",
                    foamMode !== "upload" && "pointer-events-none",
                  )}
                >
                  <UploadFoamCard
                    inputRef={inputRef}
                    reading={reading}
                    dragOver={dragOver}
                    pnr={pnr}
                    setPnr={setPnr}
                    setDragOver={setDragOver}
                    runRead={runRead}
                    onFileChange={onFileChange}
                  />
                </div>
                <div
                  ref={planFaceRef}
                  aria-hidden={foamMode !== "plan"}
                  className={cn(
                    "absolute inset-x-0 top-0 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    foamMode !== "plan" && "pointer-events-none",
                  )}
                >
                  <PlanTripHomeFoam />
                </div>
              </div>
            </div>
          )}
        </div>

        {foamMode === "upload" ? (
          <p
            className={cn(
              "mt-3 text-xs leading-relaxed",
              introOnDark ? "text-white/75" : "text-ink-muted dark:text-cream-100/60",
            )}
          >
            Your uploaded ticket is deleted after we read it. We only keep the passenger and flight
            fields you confirm before paying.
          </p>
        ) : null}

        {error ? (
          <Alert variant="error" className="mt-4" title="Couldn't read that ticket">
            {error}{" "}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() => router.push("/search")}
            >
              Book without a flight ticket
            </button>
          </Alert>
        ) : null}

        <div className="mt-6 flex flex-col gap-2">
          <Button
            asChild
            size="lg"
            block
            className="bg-hero-tint text-white hover:bg-hero-tint/90"
          >
            <a href="/search">Book without a flight ticket</a>
          </Button>
          {foamMode === "upload" ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              block
              className={cn(
                introOnDark && "text-white/90 hover:bg-white/10 hover:text-white",
              )}
              onClick={() => switchFoam("plan")}
            >
              Plan a trip here
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              block
              className={cn(
                introOnDark && "text-white/90 hover:bg-white/10 hover:text-white",
              )}
              onClick={() => switchFoam("upload")}
            >
              Back to upload ticket
            </Button>
          )}
        </div>

        <p
          className={cn(
            "mt-5 text-center text-sm",
            introOnDark ? "text-white/80" : "text-ink-muted dark:text-cream-100/65",
          )}
        >
          Fixed fare from{" "}
          <span
            className={cn(
              "font-bold tabular",
              introOnDark ? "text-white" : "text-forest dark:text-cream-50",
            )}
          >
            ₦{(productConfig.singleFareKobo / 100).toLocaleString("en-NG")}
          </span>{" "}
          · 4 departures daily · 100% electric
        </p>
      </div>
    </section>
  );
}
