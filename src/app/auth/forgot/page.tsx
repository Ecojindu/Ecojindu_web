"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MailCheck, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";
import { forgotSchema } from "@/lib/validation";

type FormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const request = useMutation({
    mutationFn: (values: FormValues) => api.forgotPassword(values.email),
    onSuccess: () => setSent(true),
    onError: (error) =>
      form.setError("email", {
        message: error instanceof ApiError ? error.message : "Something went wrong.",
      }),
  });

  if (sent) {
    return (
      <div className="container flex min-h-[70vh] items-center py-12">
        <Card className="mx-auto w-full max-w-md p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-leaf/15">
            <MailCheck className="size-7 text-moss" aria-hidden />
          </span>
          <h1 className="mt-5 text-xl font-extrabold text-forest">Check your inbox</h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
            If <strong className="text-ink">{form.getValues("email")}</strong> has an account,
            a reset link is on its way. It&apos;s valid for 60 minutes.
          </p>
          <Button asChild block className="mt-7">
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-display-sm font-extrabold text-forest">Forgot your password?</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Enter your email address and we&apos;ll send you a link to set a new one.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((v) => request.mutate(v))}
            noValidate
          >
            <Field
              label="Email address"
              htmlFor="email"
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

            <Button type="submit" block size="lg" loading={request.isPending} loadingText="Sending…">
              <Send aria-hidden />
              Send reset link
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Remembered it?{" "}
          <Link href="/auth/login" className="font-semibold text-moss hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
