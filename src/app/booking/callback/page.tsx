"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function CallbackPage() {
  return (
    <Suspense fallback={<Verifying />}>
      <PaymentCallback />
    </Suspense>
  );
}

function Verifying() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-moss" aria-hidden />
        <h1 className="mt-6 text-xl font-extrabold text-forest">Confirming your payment…</h1>
        <p className="mt-2 text-sm text-ink-muted">This usually takes a second or two.</p>
      </div>
    </div>
  );
}

/**
 * Paystack returns here after checkout. We verify server-side rather than
 * trusting the redirect — the webhook may well have settled it already, and
 * verification is idempotent either way.
 */
function PaymentCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference") ?? params.get("trxref") ?? "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["verify", reference],
    queryFn: () => api.verifyPayment(reference),
    enabled: Boolean(reference),
    // The webhook and this call can race; a couple of retries covers the gap.
    retry: 3,
    retryDelay: (attempt) => Math.min(1200 * 2 ** attempt, 5000),
  });

  React.useEffect(() => {
    if (data?.paid && data.booking_ref) {
      router.replace(`/booking/${data.booking_ref}?new=1`);
    } else if (data?.paid && data.subscription_id) {
      router.replace("/dashboard?subscribed=1");
    }
  }, [data, router]);

  if (!reference) {
    return (
      <Outcome
        title="Missing payment reference"
        body="We couldn't tell which payment this was. If you were charged, your ticket has still been emailed to you."
      />
    );
  }

  if (isLoading || data?.paid) return <Verifying />;

  if (isError) {
    return (
      <Outcome
        title="We couldn't verify that payment"
        body={
          (error as Error)?.message ??
          "Something went wrong while checking with Paystack. If you were charged, your ticket is on its way by email and SMS."
        }
      />
    );
  }

  return (
    <Outcome
      title="Payment not completed"
      body={data?.message ?? "This payment wasn't completed, so no seats were reserved and you haven't been charged."}
    />
  );
}

function Outcome({ title, body }: { title: string; body: string }) {
  return (
    <div className="container py-16">
      <Card className="mx-auto max-w-md p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-clay-light">
          <XCircle className="size-7 text-clay" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-extrabold text-forest">{title}</h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">{body}</p>
        <div className="mt-7 flex flex-col gap-2">
          <Button asChild block>
            <Link href="/search">Find another departure</Link>
          </Button>
          <Button asChild block variant="outline">
            <Link href="/manage">Look up a booking</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
