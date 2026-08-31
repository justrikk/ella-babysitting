import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/avatar";
import {
  updateSitterProfile,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
} from "@/lib/actions";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function minutesToTime(min: number) {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function toDateInputValue(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : "";
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid:
    "Please fill in a bio and a valid hourly rate — and check your age range (min must be less than or equal to max).",
  phototype: "Photo must be a JPEG, PNG, or WebP image.",
  photosize: "Photo must be 5MB or smaller.",
  upload: "Photo upload failed — please try again.",
  invalidslot: "Please pick a valid day and time range (end after start).",
};

export default async function SitterProfileEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const session = await auth();

  // proxy.ts already requires an APPROVED session for /dashboard/*, but
  // that gate is approval-based, not role-based — parents land here too
  // unless redirected explicitly. Admins are allowed through too, since an
  // admin can also be a listed sitter (e.g. Ella's own profile).
  if (
    !session ||
    (session.user.role !== "SITTER" && session.user.role !== "ADMIN")
  ) {
    redirect("/dashboard");
  }

  const profile = await prisma.sitterProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true, availability: { orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }] } },
  });
  if (!profile) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">Your profile</h1>
      <p className="mt-1 text-sm text-warm-600">
        This is what parents see on{" "}
        <a href={`/sitters/${profile.id}`} className="text-primary-700 underline">
          your public listing
        </a>
        .
      </p>

      {success && (
        <div className="mt-6 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Profile updated.
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {ERROR_MESSAGES[error] ?? "Something went wrong — please try again."}
        </div>
      )}

      <form
        action={updateSitterProfile}
        encType="multipart/form-data"
        className="mt-6 space-y-4 rounded-lg border border-warm-200 bg-white p-5"
      >
        <div className="flex items-center gap-4">
          <Avatar name={profile.user.name ?? profile.user.email} imageUrl={profile.user.image} className="h-16 w-16 text-xl" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-warm-700">
              Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 w-full text-sm"
            />
            <p className="mt-1 text-xs text-warm-500">JPEG, PNG, or WebP — up to 5MB.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700">
            Short bio
          </label>
          <textarea
            name="bio"
            rows={4}
            required
            defaultValue={profile.bio ?? ""}
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="Tell parents about your experience with kids..."
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
            defaultValue={profile.hourlyRateCents ? profile.hourlyRateCents / 100 : ""}
            className="mt-1 w-40 rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="28"
          />
        </div>

        <div className="rounded-md border border-warm-200 p-3">
          <p className="text-sm font-medium text-warm-800">
            Working with Children Check (WWCC)
          </p>
          <p className="mt-1 text-xs text-warm-500">
            Required in NSW for sitters 18+.{" "}
            <a
              href="https://www.service.nsw.gov.au/transaction/apply-for-a-working-with-children-check"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Apply for a WWCC
            </a>{" "}
            ·{" "}
            <a
              href="https://ocg.nsw.gov.au/working-children-check/who-needs-check"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Learn more
            </a>
          </p>
          <label className="mt-3 flex items-start gap-2 text-sm text-warm-700">
            <input
              type="checkbox"
              name="wwccConfirmed"
              defaultChecked={profile.wwccConfirmed}
              className="mt-1"
            />
            <span>I hold a valid Working with Children Check (WWCC).</span>
          </label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-warm-700">
                WWCC number (optional)
              </label>
              <input
                type="text"
                name="wwccNumber"
                defaultValue={profile.wwccNumber ?? ""}
                className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700">
                Expiry date (optional)
              </label>
              <input
                type="date"
                name="wwccExpiry"
                defaultValue={toDateInputValue(profile.wwccExpiry)}
                className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-warm-200 p-3">
          <label className="flex items-start gap-2 text-sm text-warm-700">
            <input
              type="checkbox"
              name="firstAidCertified"
              defaultChecked={profile.firstAidCertified}
              className="mt-1"
            />
            <span>
              I hold Nationally Recognised First Aid — HLTAID011 Provide
              First Aid.
            </span>
          </label>
          <div className="mt-3">
            <label className="block text-sm font-medium text-warm-700">
              Other certificates (optional)
            </label>
            <textarea
              name="otherCertifications"
              rows={2}
              defaultValue={profile.otherCertifications ?? ""}
              className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
              placeholder="Certificate name and expiry date, e.g. CPR — HLTAID009, exp. 06/2027"
            />
          </div>
        </div>

        <div className="rounded-md border border-warm-200 p-3">
          <p className="text-sm font-medium text-warm-800">
            Best with — age range (optional)
          </p>
          <p className="mt-1 text-xs text-warm-500">
            Shown on your listing and used in the age filter on the sitter
            directory.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-warm-700">
                Min age
              </label>
              <input
                type="number"
                name="bestWithAgeMin"
                min={0}
                defaultValue={profile.bestWithAgeMin ?? ""}
                className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700">
                Max age
              </label>
              <input
                type="number"
                name="bestWithAgeMax"
                min={0}
                defaultValue={profile.bestWithAgeMax ?? ""}
                className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex items-start gap-2 text-sm text-warm-700">
              <input
                type="checkbox"
                name="offersSchoolPickup"
                defaultChecked={profile.offersSchoolPickup}
                className="mt-1"
              />
              <span>I&apos;m available for school pickup.</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-warm-700">
              <input
                type="checkbox"
                name="offersEveningCare"
                defaultChecked={profile.offersEveningCare}
                className="mt-1"
              />
              <span>I&apos;m available for evening care.</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Save profile
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-warm-900">
          Weekly availability
        </h2>
        <p className="mt-1 text-sm text-warm-600">
          Recurring time slots parents can search against. This isn&apos;t
          checked against your existing bookings — just your general
          availability.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DAYS.map((dayName, dayOfWeek) => {
            const slots = profile.availability.filter((a) => a.dayOfWeek === dayOfWeek);
            return (
              <div key={dayOfWeek} className="rounded-lg border border-warm-200 bg-white p-4">
                <p className="text-sm font-medium text-warm-800">{dayName}</p>

                {slots.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {slots.map((slot) => (
                      <li
                        key={slot.id}
                        className="flex items-center justify-between rounded-md bg-warm-50 px-2.5 py-1.5 text-sm text-warm-700"
                      >
                        <span>
                          {minutesToTime(slot.startMinute)} – {minutesToTime(slot.endMinute)}
                        </span>
                        <form action={deleteAvailabilitySlot}>
                          <input type="hidden" name="slotId" value={slot.id} />
                          <button
                            type="submit"
                            className="text-xs text-warm-400 hover:text-red-600"
                            aria-label="Remove slot"
                          >
                            ✕
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                <form action={addAvailabilitySlot} className="mt-3 flex items-center gap-1.5">
                  <input type="hidden" name="dayOfWeek" value={dayOfWeek} />
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="w-full min-w-0 rounded-md border border-warm-300 px-2 py-1 text-xs"
                  />
                  <span className="text-xs text-warm-400">–</span>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="w-full min-w-0 rounded-md border border-warm-300 px-2 py-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-md bg-warm-100 px-2 py-1 text-xs font-medium text-warm-700 hover:bg-warm-200"
                  >
                    Add
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
