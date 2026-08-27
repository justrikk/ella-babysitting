# Ella's Babysitting — MVP Scaffold

A closed, local app connecting known parents and sitters in Bundeena &amp;
Maianbar — not an open marketplace. Built as an installable Progressive Web
App (PWA) rather than a native iOS/Android app — see "Why web app, not
native" below for the reasoning.

## Status: real DB + auth + approval queue wired up, not launch-ready

Database, authentication, and the admin approval queue are now real —
Supabase Postgres via Prisma 7, Auth.js (v5) magic-link sign-in via Resend,
`/join` and `/sitters/apply` create real `PENDING` `User` rows, `/admin`
approves/rejects them for real, and `/sitters` reads real sitter profiles.
Payments, push notifications, and the booking/messaging backend are still
mock/stubbed — see "What's stubbed" below.

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET, RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAILS
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000. Sign in at `/signin` with an email in
`ADMIN_EMAILS` to land in `/admin` as an approved admin automatically.

## Trust model: admin approval, not background checks

Decided 2026-08-18. This app is scoped to people Ella already knows
locally, so formal background checks are explicitly **not required**.
Instead, the trust gate is manual admin approval: every parent and sitter
account sits as `PENDING` until Ella approves it via `/admin`. Anyone can
browse sitter profiles and check availability without an account, but
booking and messaging require an approved account.

- `prisma/schema.prisma` — `ApprovalStatus` on `User` (`PENDING` /
  `APPROVED` / `REJECTED`), set by an admin. `SitterProfile` still has
  optional `backgroundCheckAt` / `idVerifiedAt` fields in case a specific
  sitter situation ever calls for one — they're not required or displayed
  unless present.
- `src/components/approval-badge.tsx` — reflects Ella's approval, not a
  background check outcome.
- `/admin` — Ella's approval queue, backed by real Prisma queries and a
  server action (`decideApproval` in `src/lib/actions.ts`). Locked to
  `ADMIN`-role sessions by `src/proxy.ts` (Next 16's renamed
  `middleware.ts` — everyone else is redirected to `/signin`).
- `/join` — parent-facing "request access" form (mirrors `/sitters/apply`
  for sitters); both write a real `PENDING` `User` row via server actions.

One thing worth getting a straight answer on before this goes live, not
after: money changing hands through an app you operate carries some
liability exposure even in an informal local arrangement, regardless of
how well everyone knows each other. Not something to guess your way
through — worth a short conversation with someone qualified to advise on
it.

## What's built

- **Real database** — `prisma/schema.prisma` targets Supabase Postgres.
  Prisma 7 moved connection config out of the schema file: runtime queries
  use the pooled `DATABASE_URL` via a driver adapter
  (`src/lib/prisma.ts`, `@prisma/adapter-pg`), while `prisma migrate` uses
  the direct `DIRECT_URL` (`prisma.config.ts`) since PgBouncer's
  transaction pooling doesn't support the prepared statements migrations
  need.
- **Auth + access control** — Auth.js v5, magic-link sign-in via Resend
  (`src/auth.ts`, `/signin`). `src/proxy.ts` (Next 16 renamed
  `middleware.ts` → `proxy.ts`) locks `/admin` to `ADMIN`-role sessions and
  `/dashboard` to approved accounts. Anyone whose email is in the
  `ADMIN_EMAILS` env var is auto-promoted to `ADMIN` + `APPROVED` on their
  first sign-in, so Ella doesn't have to approve herself.
- **Sitter application flow** — `/sitters/apply` — writes a real `PENDING`
  `User` + `SitterProfile` row (`src/lib/actions.ts`).
- **Parent access request flow** — `/join` — same idea, for parents.
- **Admin approval queue, persisted** — `/admin` reads real pending/decided
  users from Postgres; approve/reject calls a server action
  (`decideApproval`) that updates `approvalStatus` / `approvedById` /
  `approvedAt` for real.
- **Public browsing, gated booking** — `/sitters`, `/sitters/[id]` — reads
  real `SitterProfile` rows (`src/lib/sitters.ts`); anyone can view
  profiles and rates, the booking form only shows for approved sitters and
  links unapproved visitors to `/join`.
- **Booking request flow** — `src/components/booking-form.tsx` — date/time/
  duration picker with a live price estimate. Still submits nowhere (no
  backend — launch blocker #4 below).
- **In-app messaging** — `/dashboard/bookings/[id]` — a message thread tied
  to a booking. Still backed by `src/lib/mock-data.ts`, not the database
  (launch blocker #4).
- **PWA plumbing** — `public/manifest.webmanifest`, `public/sw.js`,
  service worker registration in the root layout. The app is installable
  today (Add to Home Screen on iOS, install prompt on Android/desktop
  Chrome).

## What's stubbed (launch blockers, in priority order)

1. **Payments.** `src/lib/payments.ts` has the intended interface
   (quote → PaymentIntent → Connect transfer) but throws on every call.
   Needs: Stripe account, Connect Express onboarding flow per sitter,
   PaymentIntent creation on booking confirmation, and a webhook handler
   for payment status updates.
2. **Push notifications.** `src/lib/push.ts` + `public/sw.js` have the
   client/SW plumbing but no VAPID keys, no `/api/push/subscribe` route,
   and no server-side send logic. Important caveat: **iOS only delivers web
   push after the user manually adds the app to their home screen**
   (iOS 16.4+) — there's no programmatic install prompt on iOS like there
   is on Android, hence the install banner in
   `src/components/ios-install-banner.tsx`. Trigger the subscribe flow
   right after a meaningful action (booking confirmed), not on page load.
3. **Booking/messaging backend.** `/dashboard` and
   `/dashboard/bookings/[id]` still read `src/lib/mock-data.ts` — needs
   real `Booking`/`Message` Prisma models (already in the schema) wired
   into server actions or API routes, scoped to the signed-in user, plus
   a notification (push/email) on new messages and booking status changes.
4. **Applicant notification on approval decision.** `decideApproval` in
   `src/lib/actions.ts` updates the database but doesn't yet email/notify
   the applicant that they were approved or rejected.

## Why web app, not native

Decision made 2026-08-18, revisit if app-store presence becomes a real
requirement.

- Users: parents + multiple sitters, closed to known locals in Bundeena &
  Maianbar — not an open public marketplace.
- Must-have features at launch: booking/calendar, in-app messaging,
  payments, push notifications.
- Membership: admin-approved (Ella approves every account), with public
  browsing of who's available.
- No stated need for app-store discoverability or credibility as a growth
  channel.

Given that, a PWA covers every required feature (push notifications work on
Android natively; iOS works once installed to home screen) at roughly half
the build/maintenance cost of native or React Native, with no app-store
review cycle blocking updates and no 30% platform payment cut.

Revisit native only if: (a) app-store review/rating signals become a
meaningful trust or acquisition channel, or (b) a feature genuinely
requires native capability (e.g. reliable background GPS tracking for
"sitter en route" alerts) that the web platform can't deliver well.

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma 7 + `@prisma/adapter-pg`, against Supabase Postgres
- Auth.js v5 (`next-auth@beta`) + `@auth/prisma-adapter`, magic-link
  sign-in via Resend
- Stripe Connect (Express) for marketplace payments — not yet installed
- Web Push API — not yet installed (`web-push` npm package recommended
  server-side)

## Next steps

See the numbered launch-blocker list above. Recommended order: payments →
push notifications → booking/messaging backend, since payments and
messaging both hang off a real `Booking` record existing.
