// Stripe Connect (Express) marketplace payment helpers — STUBBED.
//
// Real wiring needed before launch:
//   1. `npm install stripe`
//   2. Set STRIPE_SECRET_KEY in env.
//   3. Sitter onboarding: create a Connect Express account per sitter
//      (stripe.accounts.create + accountLinks.create), store the account id
//      on SitterProfile.stripeConnectAccountId.
//   4. On booking confirmation: create a PaymentIntent with
//      `application_fee_amount` (platform cut) and
//      `transfer_data.destination` (sitter's connected account).
//   5. Webhook endpoint (/api/webhooks/stripe) to update Payment.status on
//      payment_intent.succeeded / .payment_failed events.
//
// This file defines the interface so the rest of the app (booking flow,
// dashboard) can be built against a stable contract now, and the real
// Stripe calls dropped in later without touching calling code.

export const PLATFORM_FEE_PERCENT = 15; // Ella's cut, adjust as needed

export interface PaymentQuote {
  amountCents: number;
  platformFeeCents: number;
  sitterPayoutCents: number;
}

export function quotePayment(hourlyRateCents: number, hours: number): PaymentQuote {
  const amountCents = Math.round(hourlyRateCents * hours);
  const platformFeeCents = Math.round((amountCents * PLATFORM_FEE_PERCENT) / 100);
  const sitterPayoutCents = amountCents - platformFeeCents;
  return { amountCents, platformFeeCents, sitterPayoutCents };
}

// STUB — replace with a real Stripe PaymentIntent call.
export async function createBookingPaymentIntent(_opts: {
  bookingId: string;
  amountCents: number;
  sitterStripeAccountId: string;
}): Promise<{ clientSecret: string }> {
  throw new Error(
    "Stripe not wired up yet. See comments in src/lib/payments.ts for the integration steps."
  );
}

// STUB — replace with stripe.accountLinks.create() for sitter onboarding.
export async function createSitterOnboardingLink(_opts: {
  sitterId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  throw new Error(
    "Stripe Connect onboarding not wired up yet. See comments in src/lib/payments.ts."
  );
}
