"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarPlus,
  Check,
  History,
  Sparkles,
  Ticket as TicketIcon,
  User as UserIcon,
} from "lucide-react";

import { CreditMeter } from "@/components/credit-meter";
import { QrTicket } from "@/components/qr-ticket";
import { SearchWidget } from "@/components/search-widget";
import { Alert, EmptyState } from "@/components/ui/alert";
import { BookingStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BookingCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { ApiError, api } from "@/lib/api";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { formatDateTime, naira } from "@/lib/utils";
import type { Booking } from "@/lib/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    </div>
  );
}

type Tab = "upcoming" | "history" | "profile";

function Dashboard() {
  const { user, loading } = useRequireAuth();
  const params = useSearchParams();
  const [tab, setTab] = React.useState<Tab>("upcoming");

  const subscription = useQuery({
    queryKey: ["active-subscription"],
    queryFn: api.myActiveSubscription,
    enabled: Boolean(user),
  });

  const bookings = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.myBookings(false),
    enabled: Boolean(user),
  });

  if (loading || !user) return <DashboardSkeleton />;

  const all = bookings.data ?? [];
  const now = Date.now();
  const upcoming = all.filter(
    (b) =>
      b.trip &&
      new Date(b.trip.departure_datetime).getTime() > now &&
      ["confirmed", "checked_in", "pending_payment"].includes(b.status),
  );
  const history = all.filter((b) => !upcoming.includes(b));

  return (
    <div className="container py-8 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-7">
          <p className="text-sm font-semibold text-moss dark:text-leaf">Welcome back</p>
          <h1 className="mt-1 text-balance text-display-sm font-extrabold text-forest dark:text-cream-50">
            {user.full_name.split(" ")[0]}
          </h1>
        </header>

        {params.get("subscribed") === "1" && (
          <Alert variant="success" title="Your subscription is active" className="mb-6">
            <p>Your ride credits are ready. Schedule a trip below and pay nothing at checkout.</p>
          </Alert>
        )}

        {/* Credits */}
        {subscription.isLoading ? (
          <Skeleton className="h-[196px] w-full rounded-2xl" />
        ) : subscription.data ? (
          <CreditMeter subscription={subscription.data} />
        ) : (
          <Card className="bg-gradient-to-br from-teal/10 to-leaf/10 dark:from-teal/20 dark:to-leaf/20 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-base font-extrabold text-forest dark:text-cream-50">
                  <Sparkles className="size-4 text-teal dark:text-teal/90" aria-hidden />
                  No active subscription
                </h2>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-muted dark:text-cream-100/70">
                  Travel often? Buy rides upfront and skip the payment step entirely.
                </p>
              </div>
              <Button asChild variant="accent">
                <Link href="/subscriptions">
                  See the tiers
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Schedule a trip */}
        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-forest dark:text-cream-50">
            <CalendarPlus className="size-5 text-moss dark:text-leaf" aria-hidden />
            Schedule a trip
          </h2>
          {subscription.data && subscription.data.credits_remaining > 0 && (
            <p className="mb-3 text-sm text-ink-muted dark:text-cream-100/70">
              Bookings you make will use your ride credits — nothing to pay at checkout.
            </p>
          )}
          <SearchWidget compact />
        </section>

        {/* Tabs */}
        <div
          className="mt-9 flex gap-1 rounded-full bg-white dark:bg-forest-light/30 dark:border dark:border-white/10 p-1 shadow-soft"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {(
            [
              { id: "upcoming", label: "Upcoming", icon: TicketIcon, count: upcoming.length },
              { id: "history", label: "History", icon: History, count: history.length },
              { id: "profile", label: "Profile", icon: UserIcon },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`tap-target flex flex-1 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? "bg-forest text-white dark:bg-leaf dark:text-forest"
                  : "text-ink-muted hover:text-forest dark:text-cream-100/70 dark:hover:text-cream-50"
              }`}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
              {"count" in item && item.count > 0 && (
                <span
                  className={`tabular rounded-full px-1.5 text-[11px] ${
                    tab === item.id ? "bg-white/20 dark:bg-forest/20" : "bg-cream-200 dark:bg-white/10 dark:text-cream-100"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "upcoming" && (
            <BookingList
              bookings={upcoming}
              loading={bookings.isLoading}
              emptyTitle="No upcoming trips"
              emptyBody="When you book a departure it will appear here with its QR ticket."
            />
          )}
          {tab === "history" && (
            <BookingList
              bookings={history}
              loading={bookings.isLoading}
              emptyTitle="Nothing here yet"
              emptyBody="Your completed and cancelled trips will be listed here."
            />
          )}
          {tab === "profile" && <ProfilePanel />}
        </div>
      </div>
    </div>
  );
}

function BookingList({
  bookings,
  loading,
  emptyTitle,
  emptyBody,
}: {
  bookings: Booking[];
  loading: boolean;
  emptyTitle: string;
  emptyBody: string;
}) {
  const [openRef, setOpenRef] = React.useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={TicketIcon}
        title={emptyTitle}
        description={emptyBody}
        action={
          <Button asChild>
            <Link href="/search">Find a departure</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const open = openRef === booking.booking_ref;
        const hasTicket = ["confirmed", "checked_in"].includes(booking.status);

        return (
          <Card key={booking.id} className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold tracking-wider text-forest dark:text-cream-50">
                    {booking.booking_ref}
                  </p>
                  <p className="mt-1.5 truncate text-sm font-semibold text-ink dark:text-cream-100">
                    {booking.trip?.route_name ?? "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft dark:text-cream-100/70">
                    {booking.trip ? formatDateTime(booking.trip.departure_datetime) : "—"}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-cream-200 dark:border-white/10 pt-3">
                <p className="text-xs text-ink-soft dark:text-cream-100/70">
                  {booking.seats} seat{booking.seats === 1 ? "" : "s"} ·{" "}
                  {booking.subscription_id ? "Ride credit" : naira(booking.amount_kobo)}
                </p>
                {hasTicket ? (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setOpenRef(open ? null : booking.booking_ref)}
                    aria-expanded={open}
                  >
                    {open ? "Hide ticket" : "Show ticket"}
                  </Button>
                ) : booking.status === "pending_payment" ? (
                  <Button asChild size="xs">
                    <Link href={`/booking/${booking.booking_ref}`}>Complete payment</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            {open && hasTicket && (
              <div className="animate-fade-up border-t border-cream-200 dark:border-white/10 bg-cream-50 dark:bg-forest/40 p-5">
                <QrTicket booking={booking} showActions />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function ProfilePanel() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = React.useState(user?.full_name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");

  const update = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.updateProfile(body),
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast("Profile updated.", "success");
    },
    onError: (error) =>
      toast(error instanceof ApiError ? error.message : "We couldn't save that.", "error"),
  });

  if (!user) return null;

  const prefs = [
    { key: "notify_email" as const, label: "Email", hint: "Tickets, reminders and receipts" },
    { key: "notify_sms" as const, label: "SMS", hint: "Booking confirmations and departure reminders" },
    { key: "notify_whatsapp" as const, label: "WhatsApp", hint: "Tickets sent to your WhatsApp thread" },
  ];

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-bold text-forest dark:text-cream-50">Your details</h2>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate({ full_name: name, email: email || undefined });
          }}
        >
          <Field label="Full name" htmlFor="profile_name">
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email address" htmlFor="profile_email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field
            label="Phone number"
            htmlFor="profile_phone"
            hint="Your phone number is your account ID — call us to change it."
          >
            <Input value={user.phone} disabled />
          </Field>
          <Button type="submit" loading={update.isPending} loadingText="Saving…">
            <Check aria-hidden />
            Save changes
          </Button>
        </form>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-bold text-forest dark:text-cream-50">How we reach you</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-cream-100/70">
          Trip reminders go out 24 hours and 2 hours before you travel.
        </p>
        <ul className="mt-5 space-y-1">
          {prefs.map((pref) => (
            <li
              key={pref.key}
              className="flex items-center justify-between gap-4 border-b border-cream-200 dark:border-white/10 py-3.5 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink dark:text-cream-100">{pref.label}</p>
                <p className="text-xs text-ink-soft dark:text-cream-100/70">{pref.hint}</p>
              </div>
              <Switch
                checked={user[pref.key]}
                onCheckedChange={(checked) => update.mutate({ [pref.key]: checked })}
                aria-label={`${pref.label} notifications`}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
