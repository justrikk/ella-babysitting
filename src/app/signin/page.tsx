import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-warm-900">Sign in</h1>
      <p className="mt-2 text-sm text-warm-600">
        Enter your email and we&apos;ll send you a magic link — no password
        needed. Use the same email you applied with on /join or
        /sitters/apply.
      </p>

      <form
        action={async (formData) => {
          "use server";
          await signIn("resend", formData);
        }}
        className="mt-6 space-y-3"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="jane@example.com"
          className="w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Send magic link
        </button>
      </form>
    </div>
  );
}
