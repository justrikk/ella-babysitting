import { SitterApplyForm } from "@/components/sitter-apply-form";

export default async function SitterApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">
        Become a Sitter Sister
      </h1>
      <p className="mt-2 text-sm text-warm-600">
        This app is kept local to people our team knows in Bundeena &amp;
        Maianbar — no formal background check required. Our team reviews
        and approves every sitter application personally before your
        profile can accept bookings, so let us know how you know us.
      </p>

      {success && (
        <div className="mt-6 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Application sent — our team will review it and you&apos;ll be able
          to sign in with this email once approved.
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
          Please fill in all fields, including both emergency contacts, the
          terms checkbox, and a matching password of at least 8 characters.
        </div>
      )}

      <SitterApplyForm />
    </div>
  );
}
