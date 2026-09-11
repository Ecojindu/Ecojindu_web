"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const next = params.get("next") ?? "/dashboard";

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  async function submit(values: FormValues) {
    setSubmitting(true);
    try {
      await signIn(values.identifier, values.password);
      router.push(next);
    } catch (error) {
      setSubmitting(false);
      const message =
        error instanceof ApiError ? error.message : "We couldn't sign you in. Please try again.";
      form.setError("password", { message });
      toast(message, "error");
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-display-sm font-extrabold text-forest">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Sign in to see your trips, tickets and ride credits.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
            <Field
              label="Email or phone number"
              htmlFor="identifier"
              error={form.formState.errors.identifier?.message}
            >
              <Input
                autoComplete="username"
                placeholder="you@example.com or 0815 447 1570"
                invalid={Boolean(form.formState.errors.identifier)}
                {...form.register("identifier")}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              error={form.formState.errors.password?.message}
            >
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-14"
                  invalid={Boolean(form.formState.errors.password)}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1 grid size-12 place-items-center rounded-lg text-ink-soft transition-colors hover:text-forest"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
                </button>
              </div>
            </Field>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot"
                className="text-sm font-semibold text-moss hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" block size="lg" loading={submitting} loadingText="Signing in…">
              <LogIn aria-hidden />
              Sign in
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-muted">
          New here?{" "}
          <Link href="/auth/register" className="font-semibold text-moss hover:underline">
            Create an account
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-ink-soft">
          You don&apos;t need an account to book —{" "}
          <Link href="/search" className="font-semibold text-moss hover:underline">
            book as a guest
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
