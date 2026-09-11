# Ecojindu Shuttle — Customer Website

The face of the company. A passenger should get from the landing page to a paid QR
ticket in **under 90 seconds on a mid-range Android over 3G** — everything here is
built around that target.

```
ecojindu-backend                    FastAPI · owns Postgres · :8000
ecojindu-api                        FastAPI · WhatsApp + agent gateway · :8001
ecojindu-web       ← you are here   Next.js · customer site · :3000
ecojindu-admin                      Next.js · operations + driver portal · :3001
```

---

## Setup

**Requires** Node 18.17+ (built on Node 22) and `ecojindu-backend` running on :8000.

```bash
cd ~/Desktop/ecojindu-web

npm install
cp .env.example .env.local

npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint
```

---

## Environment

Everything is `NEXT_PUBLIC_*` — this app holds no secrets. It talks to the backend
directly from the browser, so the backend's `CORS_ORIGINS` must list `http://localhost:3000`.

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Where `ecojindu-backend` lives |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Publishable key for the inline popup. Leave blank while the backend runs with `PAYSTACK_MOCK=true` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only — used to build `wa.me` deep links |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `_SOCIAL_HANDLE` | Footer and support links |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for OpenGraph tags |

> `NEXT_PUBLIC_*` values are **inlined at build time**, not read at runtime. Changing
> one means rebuilding the image — see the `ARG`s in the Dockerfile.

---

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, route search widget, how-it-works, EV story, fare comparison, subscription teaser, FAQs |
| `/search` | Departure results with a date strip, live seat counts and sold-out states |
| `/book/[tripId]` | The 3-step booking flow: details → seats → pay |
| `/booking/callback` | Verifies the Paystack transaction server-side and routes onward |
| `/booking/[ref]` | Confirmation with the QR ticket, downloadable |
| `/subscriptions` | Both tiers, a comparison table, and checkout |
| `/dashboard` | Ride-credit meter, credit booking, upcoming trips with tickets, history, profile |
| `/manage` | Look up any booking by reference + phone; view QR, resend, cancel |
| `/auth/login` · `/register` · `/verify` · `/forgot` · `/reset` | Minimal-friction auth |

---

## Design system

Drawn from Ecojindu's identity. Tokens live in `tailwind.config.ts`.

| Token | Hex | Used for |
|---|---|---|
| `cream` | `#EAE8DB` | Page background — warm, not clinical |
| `leaf` | `#7CB342` | Primary green, badges, accents |
| `moss` | `#4C8C2B` | Buttons, links, focus rings |
| `forest` | `#2F5233` | Headings, header bar, footer |
| `teal` | `#2BAE8E` | Secondary accent, used sparingly |
| `ink` | `#15181A` | Body text |
| `clay` | `#C4562F` | **Errors only** — never decorative |

**Type** is Plus Jakarta Sans via `next/font` (self-hosted, `display: swap`), with
tightened tracking on display sizes so headings read confident rather than shouty.

**The transit-line motif** from the pitch deck appears as `<RouteLine />` behind the
hero and as `<StopConnector />` inside every trip card — a dashed line between an
origin node and a destination node.

### Performance

* **Zero layout shift.** Skeletons carry the exact dimensions of the content they
  stand in for; number displays use `tabular-nums` so digits never reflow.
* **Nothing loads that isn't needed.** The Paystack script is fetched lazily, only
  when the passenger reaches the seats step — never on the landing page.
* Shared JS is ~87 kB gzipped; the heaviest route is the dashboard at ~154 kB first load.
* Route search results are cached for 20 s so a back-navigation is instant, while
  seat counts stay honest.

### Accessibility (WCAG 2.1 AA)

* Skip link is the first tab stop on every page.
* Every interactive target clears **48 × 48 px** (`.tap-target`, and the button sizes).
* Focus is never suppressed — `:focus-visible` gets a 2px moss ring with an offset.
* Form errors are announced through `aria-live` regions and tied to inputs with
  `aria-describedby` (see `<Field>`).
* The step indicator, credit meter, date strip and tabs all carry proper roles
  (`step`, `meter`, `tablist`).
* `maximum-scale=5` — pinch-zoom is never blocked.
* Colour is never the only signal: sold-out states carry text, not just a red badge.

---

## Payments

`src/lib/paystack.ts` opens Paystack's inline popup with the publishable key.

Three fallbacks, in order:

1. **Mock mode** — if the backend returns a `/mock-pay/` URL (or no key is set), the
   browser is redirected to the backend's own checkout page. The full flow —
   confirmation, QR issue, email and SMS — still runs. **This means the whole site
   works end to end with no Paystack account.**
2. **Popup blocked or script blocked** — falls back to Paystack's hosted checkout URL.
3. **Everything fails** — a toast, and the booking stays recoverable under its reference.

After checkout the browser lands on `/booking/callback`, which verifies the
transaction **server-side** rather than trusting the redirect. Verification is
idempotent and races safely against the webhook.

---

## Auth

JWT access + refresh tokens in `localStorage`, with a transparent one-shot refresh
inside the fetch wrapper (`src/lib/api.ts`). Signing out in one tab signs out the
rest via a `storage` event.

**Booking never requires an account.** Guests need only a name and phone number. If a
guest supplies an email, the backend quietly links the booking to an account they can
claim later — no data is lost when they eventually register.

---

## Project layout

```
src/
  app/
    layout.tsx            fonts, metadata, header/footer, skip link
    providers.tsx         TanStack Query, auth, toasts
    page.tsx              landing
    search/               results + date switcher
    book/[tripId]/        3-step booking flow
    booking/[ref]/        confirmation + QR ticket
    booking/callback/     Paystack return handler
    subscriptions/        tiers + checkout
    dashboard/            credits, trips, profile
    manage/               guest booking lookup
    auth/                 login, register, verify, forgot, reset
  components/
    ui/                   shadcn-style primitives (button, card, input, field, …)
    brand.tsx             logo, route-line motif, section heading
    search-widget.tsx     the front door
    trip-card.tsx         one departure
    date-switcher.tsx     day strip with per-day seat counts
    qr-ticket.tsx         the boarding pass
    credit-meter.tsx      segmented ride-credit balance
  lib/
    api.ts                fetch wrapper, token store, typed endpoints
    auth.tsx              AuthProvider + useRequireAuth
    paystack.ts           lazy inline checkout with fallbacks
    validation.ts         Zod schemas (incl. Nigerian phone normalisation)
    utils.ts              cn, naira, Lagos-timezone date helpers
    types.ts              mirrors the backend's response models
```

---

## Deploying to Cloud Run

```bash
PROJECT=your-gcp-project
REGION=africa-south1

gcloud builds submit --tag gcr.io/$PROJECT/ecojindu-web \
  --substitutions _API_URL=https://ecojindu-backend-xxxx.run.app

# or with plain docker:
docker build -t gcr.io/$PROJECT/ecojindu-web \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://ecojindu-backend-xxxx.run.app \
  --build-arg NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxx \
  --build-arg NEXT_PUBLIC_SITE_URL=https://ecojindu.ng .

gcloud run deploy ecojindu-web \
  --image gcr.io/$PROJECT/ecojindu-web \
  --region $REGION --platform managed --allow-unauthenticated \
  --min-instances 1 --max-instances 20 --cpu 1 --memory 512Mi
```

Checklist:

1. `NEXT_PUBLIC_*` are **build args**, not runtime env vars — rebuild to change them.
2. Add the deployed origin to the backend's `CORS_ORIGINS`.
3. Set the backend's `PAYSTACK_CALLBACK_URL` to `https://<web-url>/booking/callback`.
4. Put Cloud CDN in front for static assets; `.next/static` is immutable and
   content-hashed.
5. `--min-instances 1` keeps the landing page off a cold start.

---

Ecojindu Shuttle · Nnenna Otti Bus Terminal, Umuahia, Abia State
`jinduinc@gmail.com` · +234 815 447 1570 · @ecojindu.ng
*Bridging Cities, Powering Green Mobility.*
