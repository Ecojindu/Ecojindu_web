"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}

const RESEND_SECONDS = 45;

function VerifyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const phone = params.get("phone") ?? user?.phone ?? "";
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [cooldown, setCooldown] = React.useState(0);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const send = useMutation({
    mutationFn: () => api.requestOtp(phone),
    onSuccess: (result) => {
      toast(result.message, "success");
      setCooldown(RESEND_SECONDS);
    },
    onError: (e) =>
      toast(e instanceof ApiError ? e.message : "We couldn't send that code.", "error"),
  });

  const verify = useMutation({
    mutationFn: () => api.verifyOtp(phone, code),
    onSuccess: async () => {
      toast("Phone number verified.", "success");
      await refreshUser();
      router.push("/dashboard");
    },
    onError: (e) => {
      const message = e instanceof ApiError ? e.message : "That code didn't work.";
      setError(message);
    },
  });

  if (!phone) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-extrabold text-forest">No phone number to verify</h1>
        <Button asChild className="mt-6">
          <Link href="/auth/login">Sign in first</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-leaf/15">
            <ShieldCheck className="size-7 text-moss" aria-hidden />
          </span>
          <h1 className="mt-5 text-display-sm font-extrabold text-forest">Verify your number</h1>
          <p className="mt-2 text-sm text-ink-muted">
            We&apos;ll text a 6-digit code to <strong className="text-ink">{phone}</strong>.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(undefined);
              verify.mutate();
            }}
            noValidate
          >
            <Field label="6-digit code" htmlFor="code" error={error}>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-2xl tracking-[0.5em]"
                invalid={Boolean(error)}
              />
            </Field>

            <Button
              type="submit"
              block
              size="lg"
              disabled={code.length < 4}
              loading={verify.isPending}
              loadingText="Checking…"
            >
              <CheckCircle2 aria-hidden />
              Verify
            </Button>
          </form>

          <div className="mt-5 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => send.mutate()}
              disabled={cooldown > 0 || send.isPending}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Send me a code"}
            </Button>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-soft">
          Codes expire after 10 minutes. Never share yours — we&apos;ll never ask for it.
        </p>
      </div>
    </div>
  );
}
