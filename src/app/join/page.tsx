import { requestParentAccess } from "@/lib/actions";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">
        Request access
      </h1>
      <p className="mt-2 text-sm text-warm-600">
        This app is kept local to people Ella knows in Bundeena &amp;
        Maianbar. Anyone can browse sitters, but you&apos;ll need Ella to
        approve your account before you can send a booking request or
        message a sitter.
      </p>

      {success && (
        <div className="mt-6 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Request sent — Ella will review it and you&apos;ll be able to sign
          in with this email once approved.
        </div>
      )}
      {error === "exists" && (
        <div className="mt-6 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          That email already has a request or account —{" "}
          <a href="/signin" className="underline">
            try signing in
          </a>{" "}
          instead.
        </div>
      )}
      {error === "invalid" && (
        <div className="mt-6 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          Please fill in all fields with a valid email.
        </div>
      )}

      <form action={requestParentAccess} className="mt-6 space-y-4">
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
            placeholder="e.g. neighbour, school parent, referred by Sam K."
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Request access
        </button>
      </form>
    </div>
  );
}
