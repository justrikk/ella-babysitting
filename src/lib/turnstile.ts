const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Verifies a Cloudflare Turnstile token from the auth forms (src/app/signin,
// forgot-password, reset-password). Without TURNSTILE_SECRET_KEY configured
// (e.g. local dev before Cloudflare keys are set up) this passes every
// request through rather than locking everyone out of sign-in.
export async function verifyTurnstileToken(
  token: string | null,
  remoteIp?: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
