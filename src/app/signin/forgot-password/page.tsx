import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions";
import { TurnstileWidget } from "@/components/turnstile-widget";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-warm-900">Forgot password</h1>
      <p className="mt-2 text-sm text-warm-600">
        Enter your email and, if you have an account, we&apos;ll send you a
        link to set a new password.
      </p>

      {success && (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          If that email has an account, a reset link is on its way — check
          your inbox.
        </div>
      )}
      {error === "captcha" && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Please complete the verification check and try again.
        </div>
      )}
      {error === "expired" && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          That reset link expired — request a new one below.
        </div>
      )}

      <form action={requestPasswordReset} className="mt-6 space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="jane@example.com"
          className="w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
        <TurnstileWidget />
        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Send reset link
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-warm-600">
        <Link href="/signin" className="text-primary-700 underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
