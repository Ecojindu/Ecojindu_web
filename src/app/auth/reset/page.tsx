"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyRound } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { resetSchema } from "@/lib/validation";

type FormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = params.get("token") ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { new_password: "", confirm: "" },
  });

  const reset = useMutation({
    mutationFn: (values: FormValues) => api.resetPassword(token, values.new_password),
    onSuccess: (result) => {
      toast(result.message, "success");
      router.push("/auth/login");
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "That link didn't work.";
      form.setError("new_password", { message });
      toast(message, "error");
    },
  });

  if (!token) {
    return (
      <div className="container flex min-h-[70vh] items-center py-12">
        <Card className="mx-auto w-full max-w-md p-8 text-center">
          <h1 className="text-xl font-extrabold text-forest">This link is incomplete</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Open the reset link from your email exactly as we sent it, or request a new one.
          </p>
          <Button asChild block className="mt-7">
            <Link href="/auth/forgot">Request a new link</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-leaf/15">
            <KeyRound className="size-7 text-moss" aria-hidden />
          </span>
          <h1 className="mt-5 text-display-sm font-extrabold text-forest">Set a new password</h1>
        </div>

        <Card className="p-6 sm:p-8">
          <form className="space-y-4" onSubmit={form.handleSubmit((v) => reset.mutate(v))} noValidate>
            <Field
              label="New password"
              htmlFor="new_password"
              hint="At least 8 characters."
              error={form.formState.errors.new_password?.message}
            >
              <Input
                type="password"
                autoComplete="new-password"
                invalid={Boolean(form.formState.errors.new_password)}
                {...form.register("new_password")}
              />
            </Field>

            <Field
              label="Confirm new password"
              htmlFor="confirm"
              error={form.formState.errors.confirm?.message}
            >
              <Input
                type="password"
                autoComplete="new-password"
                invalid={Boolean(form.formState.errors.confirm)}
                {...form.register("confirm")}
              />
            </Field>

            <Button type="submit" block size="lg" loading={reset.isPending} loadingText="Saving…">
              Update password
            </Button>
          </form>

          <Alert variant="info" className="mt-5" icon={false}>
            <p className="text-xs">
              Reset links expire 60 minutes after they&apos;re sent and work only once.
            </p>
          </Alert>
        </Card>
      </div>
    </div>
  );
}
