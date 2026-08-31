import { resetPassword } from "@/lib/actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-warm-900">
          Missing reset link
        </h1>
        <p className="mt-2 text-sm text-warm-600">
          This page needs a valid reset link from your email.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-warm-900">Set a new password</h1>

      {error === "invalid" && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Please check your passwords and try again — must be at least 8
          characters and match.
        </div>
      )}

      <form action={resetPassword} className="mt-6 space-y-3">
        <input type="hidden" name="token" value={token} />
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="New password"
          className="w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          placeholder="Confirm new password"
          className="w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Set password
        </button>
      </form>
    </div>
  );
}
