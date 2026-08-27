// Web Push helpers — STUBBED.
//
// Real wiring needed before launch:
//   1. Generate VAPID keys (`npx web-push generate-vapid-keys`), store as
//      NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY.
//   2. Call subscribeToPush() after a meaningful user action (e.g. right
//      after they confirm/request a booking) — not on page load, or the
//      permission prompt trains users to reflexively deny it.
//   3. POST the resulting subscription to /api/push/subscribe, store it as
//      a PushSubscription row (see prisma/schema.prisma).
//   4. Server-side, use the `web-push` npm package to send notifications
//      (new message, booking confirmed, etc.) to stored subscriptions.
//
// iOS caveat (important): Safari only allows web push after the user adds
// this app to their home screen (Add to Home Screen), iOS 16.4+. There is
// no way to trigger the install prompt programmatically on iOS — the UI
// needs to explicitly instruct/nudge users to do it manually.

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    nav.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

// STUB — wire up once VAPID keys + /api/push/subscribe exist.
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("NEXT_PUBLIC_VAPID_PUBLIC_KEY not set — push disabled.");
    return null;
  }
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  });
  // TODO: POST `subscription` to /api/push/subscribe
  return subscription;
}
