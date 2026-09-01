import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/mock-data";
import { getSitterById } from "@/lib/sitters";
import { formatWeeklyAvailability } from "@/lib/format-availability";
import { ApprovalBadge } from "@/components/approval-badge";
import { Avatar } from "@/components/avatar";
import { BookingForm } from "@/components/booking-form";
import { ShortlistButton } from "@/components/shortlist-button";
import { IconShieldCheck, IconCalendarHeart } from "@/components/icons";

export default async function SitterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sitter = await getSitterById(id);
  if (!sitter) notFound();

  const hasAgeRange =
    sitter.bestWithAgeMin !== undefined && sitter.bestWithAgeMax !== undefined;
  const weeklyAvailability = formatWeeklyAvailability(sitter.availability);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-xs text-warm-500">
        <Link href="/" className="hover:text-warm-900">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/sitters" className="hover:text-warm-900">
          Find a sitter
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-warm-700">{sitter.name}</span>
      </nav>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={sitter.name} imageUrl={sitter.avatarUrl} className="h-14 w-14 text-lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-warm-900">
              {sitter.name}
            </h1>
            <p className="text-sm text-warm-500">
              {[
                sitter.suburb,
                sitter.yearsExperience > 0
                  ? `${sitter.yearsExperience} yrs experience`
                  : null,
                `${formatCurrency(sitter.hourlyRateCents)}/hr`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ShortlistButton
            sitterId={sitter.id}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-warm-50 text-primary-600 transition hover:bg-warm-100"
          />
          <ApprovalBadge status={sitter.approvalStatus} />
        </div>
      </div>

      {(hasAgeRange || sitter.offersSchoolPickup || sitter.offersEveningCare) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {hasAgeRange && (
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              Best with: Ages {sitter.bestWithAgeMin}–{sitter.bestWithAgeMax}
            </span>
          )}
          {sitter.offersSchoolPickup && (
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              School pickup
            </span>
          )}
          {sitter.offersEveningCare && (
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              Evening care
            </span>
          )}
        </div>
      )}

      {(sitter.backgroundCheckAt || sitter.idVerifiedAt) && (
        <div className="mt-3 flex gap-4 text-xs text-warm-500">
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

      <p className="mt-6 text-warm-700">{sitter.bio}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-warm-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="h-4 w-4 text-primary-600" />
            <h2 className="text-sm font-medium text-warm-900">
              Safety &amp; qualifications
            </h2>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-warm-600">
            <li>
              {sitter.wwccConfirmed ? "✓" : "—"} Working with Children Check
              (WWCC)
            </li>
            <li>
              {sitter.firstAidCertified ? "✓" : "—"} Nationally Recognised
              First Aid
            </li>
          </ul>
          {sitter.otherCertifications && (
            <p className="mt-2 text-xs text-warm-500">
              {sitter.otherCertifications}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-warm-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <IconCalendarHeart className="h-4 w-4 text-primary-600" />
            <h2 className="text-sm font-medium text-warm-900">
              Weekly availability
            </h2>
          </div>
          {weeklyAvailability.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-sm text-warm-600">
              {weeklyAvailability.map((slot) => (
                <li key={slot.day}>
                  <span className="font-medium text-warm-800">{slot.day}:</span>{" "}
                  {slot.times}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-warm-500">
              No recurring availability set yet — ask when messaging.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-warm-200 bg-white p-5">
        <h2 className="text-lg font-medium text-warm-900">
          Request a booking
        </h2>
        {sitter.approvalStatus !== "APPROVED" ? (
          <p className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            {sitter.name} is still awaiting approval and
            can&apos;t accept bookings yet.
          </p>
        ) : (
          <>
            <p className="mt-1 text-xs text-warm-500">
              You&apos;ll need an approved account to send a request —
              new here?{" "}
              <a href="/join" className="text-primary-700 underline">
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
