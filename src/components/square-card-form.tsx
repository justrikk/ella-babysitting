"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { payBookingFeeAction } from "@/lib/actions";

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: { message: string }[];
  }>;
}

declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string
      ) => Promise<{ card: () => Promise<SquareCard> }>;
    };
  }
}

const APPLICATION_ID = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!;
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;
// Square app ids are prefixed "sandbox-" in sandbox, unprefixed in
// production — deriving from that avoids a second env var that has to stay
// in sync with SQUARE_ENVIRONMENT.
const IS_SANDBOX = APPLICATION_ID.startsWith("sandbox-");
const SQUARE_SDK_SRC = IS_SANDBOX
  ? "https://sandbox.web.squarecdn.com/v1/square.js"
  : "https://web.squarecdn.com/v1/square.js";

export function SquareCardForm({ bookingId }: { bookingId: string }) {
  const cardRef = useRef<SquareCard | null>(null);
  // Guards against a double-init race: Script's onReady fires immediately
  // on mount whenever square.js is already cached from a previous page, and
  // React dev-mode double-invokes effects — either can otherwise trigger
  // two concurrent payments.card()/attach() calls on the same container,
  // which breaks the SDK ("unable to be initialized in time"). Set
  // synchronously, before any await, so it closes the race regardless of
  // how close together the two calls land.
  const attachStartedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function attachCard() {
    if (!window.Square || attachStartedRef.current) return;
    attachStartedRef.current = true;
    const payments = await window.Square.payments(APPLICATION_ID, LOCATION_ID);
    const card = await payments.card();
    await card.attach("#square-card-container");
    cardRef.current = card;
    setReady(true);
  }

  async function handlePay() {
    if (!cardRef.current) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        setError(result.errors?.[0]?.message ?? "Card declined — please try a different card.");
        return;
      }
      const formData = new FormData();
      formData.set("bookingId", bookingId);
      formData.set("sourceId", result.token);
      await payBookingFeeAction(formData);
    } catch (err) {
      // payBookingFeeAction redirects on both success and decline (see
      // src/lib/actions.ts) — redirect() throws a special NEXT_REDIRECT
      // error to trigger navigation, which isn't a real failure. Only show
      // our own message for an actual unexpected error.
      const digest = (err as { digest?: string })?.digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setError("Payment failed — please try again.");
    } finally {
      // On a decline, the redirect lands back on this same component
      // instance (same route, only ?error= changes) rather than unmounting
      // it, so the button needs resetting here to stay retry-able. On
      // success the parent stops rendering this component once paid, so
      // this is a harmless no-op there.
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-3">
      <Script src={SQUARE_SDK_SRC} onReady={() => void attachCard()} />

      {IS_SANDBOX && (
        <p className="mb-2 rounded-md bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">
          Test mode — this won&apos;t charge a real card. Use a{" "}
          <a
            href="https://developer.squareup.com/docs/testing/test-values"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Square sandbox test card
          </a>{" "}
          (e.g. 4111 1111 1111 1111, any future expiry, any CVV).
        </p>
      )}

      <div id="square-card-container" className="rounded-md border border-warm-300 p-3" />

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <button
        type="button"
        onClick={handlePay}
        disabled={!ready || submitting}
        className="mt-3 w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        {submitting ? "Processing…" : "Pay AUD $4.95"}
      </button>
    </div>
  );
}
