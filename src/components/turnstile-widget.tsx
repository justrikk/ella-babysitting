"use client";

import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

// Cloudflare bot-check widget for the auth forms (sign in, forgot/reset
// password). Cloudflare's script implicitly renders any ".cf-turnstile"
// element and injects a "cf-turnstile-response" hidden input into it, so no
// extra wiring is needed to include the token in the surrounding form's
// submission — src/lib/turnstile.ts verifies it server-side.
//
// Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured, so
// auth keeps working (unprotected) before Cloudflare keys are set up.
export function TurnstileWidget() {
  if (!SITE_KEY) return null;

  return (
    <>
      <Script src={TURNSTILE_SRC} async defer />
      <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="light" />
    </>
  );
}
