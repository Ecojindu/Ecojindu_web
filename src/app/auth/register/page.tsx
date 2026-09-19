"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

type FormValues = z.input<typeof registerSchema>;

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", phone: "", email: "", password: "" },
    mode: "onBlur",
  });

  async function submit(values: FormValues) {
    setSubmitting(true);
    try {
      const parsed = registerSchema.parse(values);
      await signUp({
        full_name: parsed.full_name,
        phone: parsed.phone,
        email: parsed.email,
        password: parsed.password,
      });
      toast("Account created. Welcome aboard.", "success");
      router.push(params.get("next") ?? "/dashboard");
    } catch (error) {
      setSubmitting(false);
      const message =
        error instanceof ApiError ? error.message : "We couldn't create that account.";
      toast(message, "error");
      if (error instanceof ApiError && error.code === "conflict") {
        form.setError("phone", { message });
      }
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-display-sm font-extrabold text-forest dark:text-cream-50">Create your account</h1>
          <p className="mt-2 text-sm text-ink-muted dark:text-cream-100/70">
            Keep all your trips, tickets and ride credits in one place.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
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
              hint="This is how you'll sign in, and where tickets are texted."
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
              optional
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

            <Field
              label="Password"
              htmlFor="password"
              hint="At least 8 characters."
              error={form.formState.errors.password?.message}
            >
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-14"
                  invalid={Boolean(form.formState.errors.password)}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1 grid size-12 place-items-center rounded-lg text-ink-soft dark:text-cream-100/70 transition-colors hover:text-forest dark:hover:text-cream-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
                </button>
              </div>
            </Field>

            <Button type="submit" block size="lg" loading={submitting} loadingText="Creating…">
              <UserPlus aria-hidden />
              Create account
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-cream-100/70">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-moss dark:text-leaf hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
