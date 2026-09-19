"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bus, CheckCircle2, Clock, Search, Send, Users } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { openCheckout } from "@/lib/paystack";
import { addDaysISO, formatDate, naira, todayISO } from "@/lib/utils";
import { phoneSchema } from "@/lib/validation";
import type { CharterRequest } from "@/lib/types";

const charterSchema = z.object({
  contact_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .refine((v) => v.includes(" "), "Please include both first and last name"),
  phone: phoneSchema,
  contact_email: z
    .union([z.string().trim().email("That email doesn't look right"), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  organisation: z.string().trim().max(160).optional(),
  origin_text: z.string().trim().min(2, "Where are you departing from?"),
  destination_text: z.string().trim().min(2, "Where are you going?"),
  service_date: z.string().min(1, "Pick a date"),
  preferred_time: z.string().optional(),
  passengers: z.coerce.number().int().min(1, "At least one passenger").max(60),
  notes: z.string().trim().max(1000).optional(),
});

type FormValues = z.input<typeof charterSchema>;

export function CharterPageClient() {
  return (
    <Suspense
      fallback={
        <div className="container py-10">
          <h1 className="text-display-sm font-extrabold text-forest">Charter a vehicle</h1>
          <p className="mt-2 text-ink-muted">
            Request a private EV for your group — we call you back with a quote.
          </p>
        </div>
      }
    >
      <Charter />
    </Suspense>
  );
}

function Charter() {
  const params = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [submitted, setSubmitted] = React.useState<CharterRequest | null>(null);
  const [estimate, setEstimate] = React.useState<number | null>(null);
  const [routeId, setRouteId] = React.useState(params.get("route") ?? "none");
  const [returnTrip, setReturnTrip] = React.useState(false);

  const { data: routes } = useQuery({ queryKey: ["routes"], queryFn: api.routes });
  const corridors = (routes ?? []).filter((r) => r.is_active);

  // 12 hours' notice, so the earliest sensible date is tomorrow.
  const earliest = addDaysISO(todayISO(), 1);

  const form = useForm<FormValues>({
    resolver: zodResolver(charterSchema),
    defaultValues: {
      contact_name: "",
      phone: "",
      contact_email: "",
      organisation: "",
      origin_text: "",
      destination_text: "",
      service_date: params.get("date") && params.get("date")! > earliest ? params.get("date")! : earliest,
      preferred_time: "",
      passengers: Number(params.get("passengers") ?? 10),
      notes: "",
    },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!user) return;
    form.setValue("contact_name", user.full_name);
    form.setValue("phone", user.phone);
    if (user.email) form.setValue("contact_email", user.email);
  }, [user, form]);

  // Prefill origin/destination when a published corridor is chosen.
  React.useEffect(() => {
    const route = corridors.find((r) => r.id === routeId);
    if (!route) return;
    form.setValue("origin_text", route.origin_terminal);
    form.setValue("destination_text", route.destination);
  }, [routeId, corridors, form]);

  const submit = useMutation({
    mutationFn: async (values: FormValues) => {
      const parsed = charterSchema.parse(values);
      return api.requestCharter({
        contact_name: parsed.contact_name,
        phone: parsed.phone,
        contact_email: parsed.contact_email ?? null,
        organisation: parsed.organisation || null,
        route_id: routeId === "none" ? null : routeId,
        origin_text: parsed.origin_text,
        destination_text: parsed.destination_text,
        service_date: parsed.service_date,
        preferred_time: parsed.preferred_time || null,
        passengers: parsed.passengers,
        return_trip: returnTrip,
        notes: parsed.notes || null,
      });
    },
    onSuccess: (result) => {
      setSubmitted(result.charter);
      setEstimate(result.indicative_amount_kobo);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast(
        error instanceof ApiError ? error.message : "We couldn't submit that request.",
        "error",
      );
    },
  });

  if (submitted) {
    return <Submitted charter={submitted} estimate={estimate} />;
  }

  return (
    <div className="pb-10 lg:pb-14">
      <div className="container">
        <div className="mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="p-6 sm:p-8">
            <form className="space-y-5" onSubmit={form.handleSubmit((v) => submit.mutate(v))} noValidate>
              <div>
                <h2 className="text-base font-extrabold text-forest">Your trip</h2>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-forest">
                      Follow a published route?
                    </label>
                    <Select value={routeId} onValueChange={setRouteId}>
                      <SelectTrigger aria-label="Published route">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No — somewhere else entirely</SelectItem>
                        {corridors.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Pick up from"
                      htmlFor="origin_text"
                      error={form.formState.errors.origin_text?.message}
                    >
                      <Input
                        placeholder="Umuahia Government House"
                        invalid={Boolean(form.formState.errors.origin_text)}
                        {...form.register("origin_text")}
                      />
                    </Field>
                    <Field
                      label="Drop off at"
                      htmlFor="destination_text"
                      error={form.formState.errors.destination_text?.message}
                    >
                      <Input
                        placeholder="Sam Mbakwe Airport"
                        invalid={Boolean(form.formState.errors.destination_text)}
                        {...form.register("destination_text")}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field
                      label="Date"
                      htmlFor="service_date"
                      error={form.formState.errors.service_date?.message}
                    >
                      <Input type="date" min={earliest} {...form.register("service_date")} />
                    </Field>
                    <Field label="Preferred time" htmlFor="preferred_time" optional>
                      <Input type="time" {...form.register("preferred_time")} />
                    </Field>
                    <Field
                      label="Passengers"
                      htmlFor="passengers"
                      error={form.formState.errors.passengers?.message}
                    >
                      <Input
                        type="number"
                        min={1}
                        max={60}
                        invalid={Boolean(form.formState.errors.passengers)}
                        {...form.register("passengers")}
                      />
                    </Field>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-cream-100 p-4 dark:bg-forest-dark/60">
                    <input
                      type="checkbox"
                      checked={returnTrip}
                      onChange={(e) => setReturnTrip(e.target.checked)}
                      className="size-5 accent-moss"
                    />
                    <span className="text-sm">
                      <span className="block font-semibold text-ink dark:text-cream-50">I need a return trip too</span>
                      <span className="block text-xs text-ink-soft dark:text-cream-100/70">
                        We&apos;ll price both legs together.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t border-cream-200 pt-5 dark:border-white/10">
                <h2 className="text-base font-extrabold text-forest dark:text-cream-50">Who should we quote?</h2>

                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      htmlFor="contact_name"
                      error={form.formState.errors.contact_name?.message}
                    >
                      <Input
                        autoComplete="name"
                        placeholder="Chinwe Eze"
                        invalid={Boolean(form.formState.errors.contact_name)}
                        {...form.register("contact_name")}
                      />
                    </Field>
                    <Field
                      label="Phone number"
                      htmlFor="phone"
                      error={form.formState.errors.phone?.message}
                    >
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0815 447 1570"
                        invalid={Boolean(form.formState.errors.phone)}
                        {...form.register("phone")}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Email"
                      htmlFor="contact_email"
                      optional
                      hint="Where we'll send the quote."
                      error={form.formState.errors.contact_email?.message}
                    >
                      <Input
                        type="email"
                        autoComplete="email"
                        invalid={Boolean(form.formState.errors.contact_email)}
                        {...form.register("contact_email")}
                      />
                    </Field>
                    <Field label="Organisation" htmlFor="organisation" optional>
                      <Input placeholder="Ministry of Transport" {...form.register("organisation")} />
                    </Field>
                  </div>

                  <Field
                    label="Anything else we should know?"
                    htmlFor="notes"
                    optional
                    hint="Luggage, accessibility needs, multiple pickups, waiting time."
                  >
                    <textarea
                      id="notes"
                      rows={3}
                      {...form.register("notes")}
                      className="w-full rounded-xl border-2 border-cream-300 bg-white p-3 text-base text-ink focus:border-moss focus:outline-none dark:border-white/15 dark:bg-forest/50 dark:text-cream-50 dark:focus:border-leaf"
                    />
                  </Field>
                </div>
              </div>

              <Button
                type="submit"
                size="xl"
                block
                loading={submit.isPending}
                loadingText="Sending…"
              >
                <Send aria-hidden />
                Request a quote
              </Button>

              <p className="text-center text-xs leading-relaxed text-ink-soft dark:text-cream-100/70">
                No payment now. We&apos;ll send a price within one working day, and you only pay
                if you accept it.
              </p>
            </form>
          </Card>

          <aside className="space-y-4">
            <Card className="bg-gradient-to-br from-forest to-forest-light p-6 text-white">
              <Bus className="size-7 text-leaf" aria-hidden />
              <h2 className="mt-3 text-lg font-extrabold text-white">Whole vehicle, your schedule</h2>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/80">
                A charter takes the entire 14-seat electric minibus, departing when you need it
                rather than on the published timetable.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-cream-100/85">
                {[
                  "Your own departure time",
                  "Door-to-door, not terminal-to-terminal",
                  "One price for the vehicle, not per seat",
                  "Same QR ticket and driver portal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-forest dark:text-cream-50">
                <Clock className="size-4 text-moss dark:text-leaf-light" aria-hidden />
                How it works
              </h3>
              <ol className="mt-3 space-y-3 text-sm text-ink-muted dark:text-cream-100/80">
                {[
                  "You send us the details — no payment.",
                  "We price it and email you a quote.",
                  "You pay to confirm the vehicle.",
                  "We assign your driver and send the ticket.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-forest text-[10px] font-extrabold text-white dark:bg-leaf dark:text-forest-dark">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-forest dark:text-cream-50">Already have a reference?</h3>
              <p className="mt-1 text-sm text-ink-soft dark:text-cream-100/70">
                Check your quote and pay from the charter lookup.
              </p>
              <Button asChild variant="outline" block size="md" className="mt-4">
                <Link href="/charter/lookup">
                  <Search aria-hidden />
                  Look up a charter
                </Link>
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Submitted({ charter, estimate }: { charter: CharterRequest; estimate: number | null }) {
  return (
    <div className="container py-14">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-leaf/20">
          <CheckCircle2 className="size-9 text-moss dark:text-leaf-light" aria-hidden />
        </span>
        <h1 className="mt-5 text-display-sm font-extrabold text-forest dark:text-cream-50">
          Charter request received
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-ink-muted dark:text-cream-100/75">
          Our operations team will price this and send you a quote within one working day.
          Nothing has been charged.
        </p>

        <Card className="mt-7 p-6 text-left">
          <div className="rounded-xl bg-cream-100 p-4 text-center dark:bg-forest-dark/70">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-moss dark:text-leaf-light">
              Charter reference
            </p>
            <p className="tabular mt-1 font-mono text-3xl font-extrabold tracking-[0.12em] text-forest dark:text-cream-50">
              {charter.reference}
            </p>
            <div className="mt-3 flex justify-center">
              <Badge variant="amber">Awaiting quote</Badge>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-cream-200 text-sm dark:divide-white/10">
            <Row label="From" value={charter.origin_text} />
            <Row label="To" value={charter.destination_text} />
            <Row label="Date" value={formatDate(`${charter.service_date}T09:00:00+01:00`)} />
            <Row label="Passengers" value={String(charter.passengers)} />
            {charter.return_trip && <Row label="Return trip" value="Yes" />}
          </dl>

          {estimate !== null && (
            <Alert variant="info" className="mt-5">
              <p>
                As a guide, a whole-vehicle hire on this corridor is around{" "}
                <strong>{naira(estimate)}</strong>. Your quote may differ once we account for
                timing, luggage and the return leg.
              </p>
            </Alert>
          )}
        </Card>

        <div className="mt-6 space-y-2">
          <Button asChild block variant="outline" size="lg">
            <Link href={`/charter/lookup?ref=${charter.reference}`}>Check this charter</Link>
          </Button>
          <Button asChild block variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
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
