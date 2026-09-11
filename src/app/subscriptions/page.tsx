"use client";

import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, CreditCard, Sparkles, X } from "lucide-react";

import { SectionHeading } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { openCheckout } from "@/lib/paystack";
import { naira } from "@/lib/utils";
import { subscriptionSchema } from "@/lib/validation";
import type { Plan } from "@/lib/types";
import { z } from "zod";

type FormValues = z.input<typeof subscriptionSchema>;

const COMPARISON = [
  { feature: "Ride credits", tier1: "12 rides", tier2: "50 rides" },
  { feature: "Validity", tier1: "3 months", tier2: "12 months" },
  { feature: "Effective fare per ride", tier1: "₦16,667", tier2: "₦20,000" },
  { feature: "Zero-payment booking", tier1: true, tier2: true },
  { feature: "Priority boarding", tier1: true, tier2: true },
  { feature: "Free rescheduling", tier1: true, tier2: true },
  { feature: "Named account manager", tier1: false, tier2: true },
  { feature: "Monthly usage reporting", tier1: false, tier2: true },
  { feature: "Transferable credits", tier1: false, tier2: true },
];

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = React.useState<Plan | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: api.plans,
    staleTime: 10 * 60_000,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { full_name: "", phone: "", email: "" },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!user) return;
    form.reset({ full_name: user.full_name, phone: user.phone, email: user.email ?? "" });
  }, [user, form]);

  const purchase = useMutation({
    mutationFn: async (values: FormValues) => {
      const parsed = subscriptionSchema.parse(values);
      return api.purchaseSubscription({ plan_id: selected!.id, ...parsed });
    },
  });

  async function submit(values: FormValues) {
    setSubmitting(true);
    try {
      const result = await purchase.mutateAsync(values);
      await openCheckout(result.payment, {
        onSuccess: (reference) => {
          window.location.href = `/booking/callback?reference=${reference}`;
        },
        onCancel: () => {
          setSubmitting(false);
          toast("Payment cancelled — your plan hasn't been activated.", "info");
        },
        onError: (message) => {
          setSubmitting(false);
          toast(message, "error");
        },
      });
    } catch (error) {
      setSubmitting(false);
      toast(
        error instanceof ApiError ? error.message : "We couldn't start that purchase.",
        "error",
      );
    }
  }

  return (
    <div className="py-10 lg:py-16">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Ride subscriptions"
          title="Buy your rides upfront. Then just book."
          description="Built for the people who make this trip every month — a block of rides that turns booking into two taps and no payment step at all."
        />

        {/* Plans */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          {isLoading
            ? [0, 1].map((i) => <Skeleton key={i} className="h-[440px] rounded-3xl" />)
            : (plans ?? []).map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  featured={index === 0}
                  onChoose={() => {
                    setSelected(plan);
                    // Give the form a moment to mount before scrolling to it.
                    requestAnimationFrame(() =>
                      document
                        .getElementById("checkout")
                        ?.scrollIntoView({ behavior: "smooth", block: "center" }),
                    );
                  }}
                />
              ))}
        </div>

        {/* Checkout */}
        {selected && (
          <Card id="checkout" className="mx-auto mt-10 max-w-lg scroll-mt-24 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-moss">Purchasing</p>
                <h2 className="mt-1 text-xl font-extrabold text-forest">{selected.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {selected.ride_credits} rides · {selected.validity_days} days
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="tap-target -m-2 grid place-items-center rounded-xl text-ink-soft transition-colors hover:text-forest"
                aria-label="Choose a different plan"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
              <Field
                label="Full name"
                htmlFor="full_name"
                error={form.formState.errors.full_name?.message}
              >
                <Input
                  autoComplete="name"
                  placeholder="Amaka Obi"
                  invalid={Boolean(form.formState.errors.full_name)}
                  {...form.register("full_name")}
                />
              </Field>

              <Field
                label="Phone number"
                htmlFor="phone"
                hint="Your credits are tied to this number — it's how WhatsApp bookings find them."
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

              <Field
                label="Email address"
                htmlFor="email"
                hint="We'll create your account here so you can book from the dashboard."
                error={form.formState.errors.email?.message}
              >
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email")}
                />
              </Field>

              <div className="flex items-baseline justify-between rounded-xl bg-cream-100 px-4 py-4">
                <span className="text-sm font-semibold text-ink-muted">Total today</span>
                <span className="tabular text-3xl font-extrabold text-forest">
                  {naira(selected.price_kobo)}
                </span>
              </div>

              <Button
                type="submit"
                size="xl"
                block
                loading={submitting}
                loadingText="Opening checkout…"
              >
                <CreditCard aria-hidden />
                Pay {naira(selected.price_kobo)}
              </Button>

              <p className="text-center text-xs leading-relaxed text-ink-soft">
                Credits are activated the moment payment clears. Secure checkout by Paystack.
              </p>
            </form>
          </Card>
        )}

        {/* Comparison */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-center text-xl font-extrabold text-forest">
            Compare the two tiers
          </h2>
          <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-soft">
            <table className="w-full text-sm">
              <caption className="sr-only">Feature comparison of Tier 1 and Tier 2</caption>
              <thead>
                <tr className="border-b border-cream-300 bg-cream-100">
                  <th scope="col" className="px-4 py-3.5 text-left font-bold text-forest sm:px-6">
                    Feature
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center font-bold text-forest">
                    Tier 1
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center font-bold text-forest">
                    Tier 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-cream-200 last:border-0">
                    <th scope="row" className="px-4 py-3.5 text-left font-medium text-ink sm:px-6">
                      {row.feature}
                    </th>
                    <Cell value={row.tier1} />
                    <Cell value={row.tier2} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-ink-muted">
          Buying for a company or a delegation? Email{" "}
          <a href="mailto:jinduinc@gmail.com" className="font-semibold text-moss hover:underline">
            jinduinc@gmail.com
          </a>{" "}
          and we&apos;ll set up an invoiced corporate account.
        </p>
      </div>
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <td className="px-3 py-3.5 text-center font-semibold text-forest">{value}</td>;
  }
  return (
    <td className="px-3 py-3.5 text-center">
      {value ? (
        <>
          <Check className="mx-auto size-5 text-moss" aria-hidden />
          <span className="sr-only">Included</span>
        </>
      ) : (
        <>
          <X className="mx-auto size-4 text-cream-400" aria-hidden />
          <span className="sr-only">Not included</span>
        </>
      )}
    </td>
  );
}

function PlanCard({
  plan,
  featured,
  onChoose,
}: {
  plan: Plan;
  featured: boolean;
  onChoose: () => void;
}) {
  const perRide = Math.round(plan.price_kobo / plan.ride_credits);
  const perks = (plan.perks ?? "").split("·").map((p) => p.trim()).filter(Boolean);

  return (
    <div
      className={`relative flex flex-col rounded-3xl border-2 p-7 sm:p-8 ${
        featured ? "border-moss bg-white shadow-lift" : "border-cream-300 bg-white/80 shadow-soft"
      }`}
    >
      {featured && (
        <Badge variant="forest" className="absolute -top-3 left-7">
          <Sparkles className="size-3.5" aria-hidden />
          Most popular
        </Badge>
      )}

      <h3 className="text-lg font-extrabold text-forest">{plan.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{plan.description}</p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-display-md font-extrabold tracking-tight text-forest">
          {naira(plan.price_kobo)}
        </span>
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        {naira(perRide)} per ride · {plan.ride_credits} rides · {plan.validity_days} days
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-sm text-ink-muted">
            <Check className="mt-0.5 size-4 shrink-0 text-moss" aria-hidden />
            {perk}
          </li>
        ))}
      </ul>

      <Button
        onClick={onChoose}
        size="lg"
        block
        variant={featured ? "primary" : "outline"}
        className="mt-7"
      >
        Choose {plan.name.split("—")[1]?.trim() ?? plan.name}
        <ArrowRight aria-hidden />
      </Button>
    </div>
  );
}
