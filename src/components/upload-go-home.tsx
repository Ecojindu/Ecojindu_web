"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  ImageIcon,
  Loader2,
  Plane,
  QrCode,
  Search,
  ShieldCheck,
  Upload,
  Zap,
} from "lucide-react";

import { SearchWidget } from "@/components/search-widget";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";
import type { PickupCity } from "@/lib/product-config";
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

/** Home hero: 2-column desktop layout with rich supporting content and accessible form. */
export function BookHome({ className }: { className?: string }) {
  const [uploadOpen, setUploadOpen] = React.useState(false);

  return (
    <section className={cn("relative", className)}>
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        {/* Left Column: Hero Copy & Value Props */}
        <div className="lg:col-span-6 lg:pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E481A]/20 bg-[#1E481A]/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1E481A] dark:border-leaf-light/30 dark:bg-leaf-light/15 dark:text-leaf-light">
            <Plane className="size-3.5" aria-hidden />
            Upload &amp; Go · Airport Shuttles
          </div>

          <h1 className="mt-3 text-balance text-display-sm font-extrabold tracking-tight text-forest dark:text-cream-50 sm:text-display-md lg:text-display-lg">
            100% Electric Airport Transfers
          </h1>

          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-ink-muted dark:text-cream-100/80 sm:text-lg">
            Fast, zero-tailpipe electric shuttles between <strong>Umuahia</strong>, <strong>Aba</strong>, and <strong>Sam Mbakwe Airport, Owerri</strong>. Choose your scheduled departure or upload your flight ticket to get your boarding QR code in seconds.
          </p>

          {/* Key Value Props Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 rounded-2xl border border-cream-300 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[var(--surface-raised)]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss dark:bg-leaf/20 dark:text-leaf-light">
                <Zap className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold text-forest dark:text-cream-50">100% Electric Fleet</p>
                <p className="text-[11px] text-ink-muted dark:text-cream-100/70">Quiet, zero emissions</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl border border-cream-300 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[var(--surface-raised)]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss dark:bg-leaf/20 dark:text-leaf-light">
                <ShieldCheck className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold text-forest dark:text-cream-50">₦15,000 Fixed Fare</p>
                <p className="text-[11px] text-ink-muted dark:text-cream-100/70">No surge or haggling</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl border border-cream-300 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[var(--surface-raised)]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss dark:bg-leaf/20 dark:text-leaf-light">
                <Clock className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold text-forest dark:text-cream-50">4 Runs Daily</p>
                <p className="text-[11px] text-ink-muted dark:text-cream-100/70">Timed for flights</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl border border-cream-300 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[var(--surface-raised)]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss dark:bg-leaf/20 dark:text-leaf-light">
                <QrCode className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold text-forest dark:text-cream-50">Instant QR Pass</p>
                <p className="text-[11px] text-ink-muted dark:text-cream-100/70">SMS &amp; WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Search & Booking Card */}
        <div className="lg:col-span-6">
          <SearchWidget />

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setUploadOpen((v) => !v)}
              className="tap-target flex w-full items-center justify-between gap-3 rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-left text-sm font-bold text-forest shadow-soft transition-colors hover:border-cream-400 dark:border-white/15 dark:bg-[var(--surface-raised)] dark:text-cream-50 dark:hover:border-white/25"
              aria-expanded={uploadOpen}
            >
              <span className="inline-flex items-center gap-2">
                <Upload className="size-4 shrink-0 text-moss dark:text-leaf-light" aria-hidden />
                Have a flight ticket? Upload &amp; Go
              </span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-ink-muted transition-transform dark:text-cream-100/70",
                  uploadOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {uploadOpen ? <UploadGoPanel className="mt-3" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Optional Upload & Go panel — only after the traveller opts in. */
function UploadGoPanel({ className }: { className?: string }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [pnr, setPnr] = React.useState("");
  const [reading, setReading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

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
          : "We couldn't read that ticket. Try again or book with the form above.",
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
    <div className={cn(className)}>
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
              type="button"
              onClick={() => inputRef.current?.click()}
              className="tap-target flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-cream-400 bg-cream-50 py-6 text-center transition-colors hover:border-moss dark:border-white/20 dark:bg-[var(--surface)] dark:hover:border-leaf-light"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-moss text-white dark:bg-white dark:text-[#0A2411]">
                <Upload className="size-7" aria-hidden />
              </span>
              <span className="text-base font-bold text-forest dark:text-cream-50">
                Upload your flight ticket
              </span>
              <span className="flex items-center gap-3 text-xs font-semibold text-ink-muted dark:text-cream-100/75">
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
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-cream-100/80">
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
          {error}
        </Alert>
      ) : null}
    </div>
  );
}

/** @deprecated Prefer BookHome — kept so older imports keep working. */
export const UploadGoHome = BookHome;
