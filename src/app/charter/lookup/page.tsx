"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Bus, CheckCircle2, CreditCard, Search } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { openCheckout } from "@/lib/paystack";
import { formatDate, naira } from "@/lib/utils";
import { phoneSchema } from "@/lib/validation";
import type { CharterResponse } from "@/lib/types";

const STATUS: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  requested: { label: "Awaiting quote", variant: "amber" },
  quoted: { label: "Quote ready", variant: "teal" },
  confirmed: { label: "Paid & confirmed", variant: "leaf" },
  assigned: { label: "Vehicle assigned", variant: "leaf" },
  completed: { label: "Completed", variant: "neutral" },
  cancelled: { label: "Cancelled", variant: "clay" },
  declined: { label: "Declined", variant: "clay" },
};

export default function CharterLookupPage() {
  return (
    <Suspense fallback={null}>
      <CharterLookup />
    </Suspense>
  );
}

function CharterLookup() {
  const params = useSearchParams();
  const { toast } = useToast();

  const [reference, setReference] = React.useState(params.get("ref") ?? "");
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState<{ reference?: string; phone?: string }>({});
  const [result, setResult] = React.useState<CharterResponse | null>(null);
  const [paying, setPaying] = React.useState(false);

  const lookup = useMutation({
    mutationFn: ({ ref, tel }: { ref: string; tel: string }) => api.lookupCharter(ref, tel),
    onSuccess: setResult,
    onError: (error) =>
      toast(
        error instanceof ApiError ? error.message : "We couldn't find that charter.",
        "error",
      ),
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsedPhone = phoneSchema.safeParse(phone);
    const next: typeof errors = {};
    if (reference.trim().length < 4) next.reference = "Enter your charter reference";
    if (!parsedPhone.success) next.phone = parsedPhone.error.issues[0]?.message;
    setErrors(next);
    if (Object.keys(next).length) return;

    lookup.mutate({ ref: reference.trim().toUpperCase(), tel: parsedPhone.data! });
  }

  async function pay() {
    if (!result?.payment) return;
    setPaying(true);
    await openCheckout(result.payment, {
      onSuccess: (ref) => {
        window.location.href = `/booking/callback?reference=${ref}`;
      },
      onCancel: () => {
        setPaying(false);
        toast("Payment cancelled — your charter is still awaiting payment.", "info");
      },
      onError: (message) => {
        setPaying(false);
        toast(message, "error");
      },
    });
  }

  const charter = result?.charter;
  const badge = charter ? (STATUS[charter.status] ?? { label: charter.status, variant: "neutral" as const }) : null;

  return (
    <div className="container py-10 lg:py-14">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-leaf/15">
            <Bus className="size-7 text-moss dark:text-leaf-light" aria-hidden />
          </span>
          <h1 className="mt-5 text-display-sm font-extrabold text-forest dark:text-cream-50">Your charter</h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted dark:text-cream-100/75">
            Enter your reference and the phone number you booked with to see your quote.
          </p>
        </div>

        <Card className="mt-8 p-6 sm:p-7">
          <form className="space-y-4" onSubmit={submit} noValidate>
            <Field
              label="Charter reference"
              htmlFor="reference"
              hint="Looks like EJC-8K3F2 — it's in the email we sent you."
              error={errors.reference}
            >
              <Input
                id="reference"
                placeholder="EJC-8K3F2"
                autoCapitalize="characters"
                className="font-mono uppercase tracking-widest"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                invalid={Boolean(errors.reference)}
              />
            </Field>

            <Field label="Phone number" htmlFor="phone" error={errors.phone}>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0815 447 1570"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                invalid={Boolean(errors.phone)}
              />
            </Field>

            <Button type="submit" block size="lg" loading={lookup.isPending} loadingText="Looking…">
              <Search aria-hidden />
              Find my charter
            </Button>
          </form>
        </Card>

        {charter && badge && (
          <Card className="mt-6 animate-fade-up p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-lg font-extrabold tracking-wider text-forest dark:text-cream-50">
                  {charter.reference}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted dark:text-cream-100/75">
                  {charter.origin_text} → {charter.destination_text}
                </p>
              </div>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>

            <dl className="mt-5 divide-y divide-cream-200 text-sm dark:divide-white/10">
              <Row label="Date" value={formatDate(`${charter.service_date}T09:00:00+01:00`)} />
              {charter.preferred_time && (
                <Row label="Preferred time" value={charter.preferred_time.slice(0, 5)} />
              )}
              <Row label="Passengers" value={String(charter.passengers)} />
              {charter.return_trip && <Row label="Return trip" value="Yes" />}
              {charter.vehicle_name && <Row label="Vehicle" value={charter.vehicle_name} />}
              {charter.driver_name && <Row label="Driver" value={charter.driver_name} />}
            </dl>

            {charter.quoted_amount_kobo !== null && (
              <div className="mt-5 flex items-baseline justify-between rounded-xl bg-cream-100 px-4 py-4 dark:bg-forest-dark/70">
                <span className="text-sm font-semibold text-ink-muted dark:text-cream-100/80">
                  {charter.status === "quoted" ? "Your quote" : "Amount"}
                </span>
                <span className="tabular text-3xl font-extrabold text-forest dark:text-cream-50">
                  {naira(charter.quoted_amount_kobo)}
                </span>
              </div>
            )}

            {charter.quote_notes && (
              <Alert variant="info" className="mt-4">
                <p>{charter.quote_notes}</p>
              </Alert>
            )}

            {result.payment && charter.status === "quoted" && (
              <Button size="xl" block className="mt-5" onClick={pay} loading={paying}>
                <CreditCard aria-hidden />
                Pay {naira(charter.quoted_amount_kobo)} to confirm
              </Button>
            )}

            {["confirmed", "assigned"].includes(charter.status) && (
              <Alert variant="success" className="mt-5" title="Confirmed">
                <p>
                  The vehicle is yours for this trip. We&apos;ll send your driver and vehicle
                  details before you travel.
                </p>
              </Alert>
            )}

            {charter.status === "requested" && (
              <Alert variant="info" className="mt-5">
                <p>
                  We&apos;re preparing your price. You&apos;ll get an email and SMS as soon as the
                  quote is ready — usually within one working day.
                </p>
              </Alert>
            )}

            {["cancelled", "declined"].includes(charter.status) && (
              <Alert variant="error" className="mt-5" title="This charter is closed">
                <p>{charter.cancellation_reason ?? "Please get in touch if you'd like to rebook."}</p>
              </Alert>
            )}
          </Card>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-ink-soft dark:text-cream-100/70">
          Need to change something?{" "}
          <a href="tel:+2348154471570" className="font-semibold text-moss hover:underline dark:text-leaf-light">
            Call +234 815 447 1570
          </a>{" "}
          quoting your reference.
        </p>

        <p className="mt-3 text-center text-sm">
          <Link href="/charter" className="font-semibold text-moss hover:underline dark:text-leaf-light">
            Request a new charter
          </Link>
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-xs text-ink-soft dark:text-cream-100/70">{label}</dt>
      <dd className="text-right font-semibold text-ink dark:text-cream-50">{value}</dd>
    </div>
  );
}
