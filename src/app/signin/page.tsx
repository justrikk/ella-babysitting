import Link from "next/link";
import { signInWithPassword } from "@/lib/actions";
import { TurnstileWidget } from "@/components/turnstile-widget";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Incorrect email or password.",
  captcha: "Please complete the verification check and try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-warm-900">Sign in</h1>
      <p className="mt-2 text-sm text-warm-600">
        Use the same email you applied with on{" "}
        <Link href="/join" className="text-primary-700 underline">
          Request access
        </Link>{" "}
        or{" "}
        <Link href="/sitters/apply" className="text-primary-700 underline">
          Become a sitter
        </Link>
        .
      </p>

      {success === "passwordset" && (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Password set — sign in below.
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {ERROR_MESSAGES[error] ?? "Something went wrong — please try again."}
        </div>
      )}

      <form action={signInWithPassword} className="mt-6 space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="jane@example.com"
          className="w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
        <TurnstileWidget />
        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Sign in
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-warm-600">
        <Link href="/signin/forgot-password" className="text-primary-700 underline">
          Forgot your password?
        </Link>
      </p>
    </div>
  );
}
