import { applyAsSitter } from "@/lib/actions";

export default async function SitterApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">
        Become a sitter
      </h1>
      <p className="mt-2 text-sm text-warm-600">
        This app is kept local to people Ella knows in Bundeena &amp;
        Maianbar — no formal background check required. Ella reviews and
        approves every sitter application personally before your profile
        can accept bookings, so let her know how you two know each other.
      </p>

      {success && (
        <div className="mt-6 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Application sent — Ella will review it and you&apos;ll be able to
          sign in with this email once approved.
        </div>
      )}
      {error === "exists" && (
        <div className="mt-6 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          That email already has an application or account —{" "}
          <a href="/signin" className="underline">
            try signing in
          </a>{" "}
          instead.
        </div>
      )}
      {error === "invalid" && (
        <div className="mt-6 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          Please fill in all fields — bio, rate, and years of experience are
          required.
        </div>
      )}

      <form action={applyAsSitter} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Full name
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Suburb
          </label>
          <select
            name="suburb"
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
          >
            <option>Bundeena</option>
            <option>Maianbar</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            How does Ella know you?
          </label>
          <input
            type="text"
            name="note"
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="e.g. neighbour, friend of Maya T., school parent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Years of childcare experience
          </label>
          <input
            type="number"
            name="yearsExperience"
            min={0}
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Hourly rate (AUD)
          </label>
          <input
            type="number"
            name="hourlyRate"
            min={0}
            step={0.5}
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="28"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Short bio
          </label>
          <textarea
            name="bio"
            rows={4}
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="Tell parents about your experience with kids..."
          />
        </div>

        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          This creates your profile as PENDING — it won&apos;t be bookable or
          visible with rates until Ella approves it in /admin. Stripe Connect
          payout onboarding still needs to be wired up separately (see
          README).
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Submit application
        </button>
      </form>
    </div>
  );
}
