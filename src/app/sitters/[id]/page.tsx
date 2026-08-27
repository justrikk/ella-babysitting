import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/mock-data";
import { getSitterById } from "@/lib/sitters";
import { ApprovalBadge } from "@/components/approval-badge";
import { BookingForm } from "@/components/booking-form";

export default async function SitterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sitter = await getSitterById(id);
  if (!sitter) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {sitter.name}
          </h1>
          <p className="text-sm text-neutral-500">
            {sitter.suburb ? `${sitter.suburb} · ` : ""}
            {sitter.yearsExperience} yrs experience ·{" "}
            {formatCurrency(sitter.hourlyRateCents)}/hr
          </p>
        </div>
        <ApprovalBadge status={sitter.approvalStatus} />
      </div>

      {(sitter.backgroundCheckAt || sitter.idVerifiedAt) && (
        <div className="mt-3 flex gap-4 text-xs text-neutral-500">
          {sitter.backgroundCheckAt && (
            <span>
              ✓ Background check on file{" "}
              {new Date(sitter.backgroundCheckAt).toLocaleDateString()}
            </span>
          )}
          {sitter.idVerifiedAt && (
            <span>
              ✓ ID verified{" "}
              {new Date(sitter.idVerifiedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      <p className="mt-6 text-neutral-700">{sitter.bio}</p>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-medium text-neutral-900">
          Request a booking
        </h2>
        {sitter.approvalStatus !== "APPROVED" ? (
          <p className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            {sitter.name} is still awaiting Ella&apos;s approval and
            can&apos;t accept bookings yet.
          </p>
        ) : (
          <>
            <p className="mt-1 text-xs text-neutral-500">
              You&apos;ll need an Ella-approved account to send a request —
              new here?{" "}
              <a href="/join" className="text-violet-700 underline">
                Request access
              </a>
              .
            </p>
            <BookingForm sitter={sitter} />
          </>
        )}
      </div>
    </div>
  );
}
