import { prisma } from "@/lib/prisma";
import type { SitterProfile } from "@/lib/types";
import type {
  SitterProfile as PrismaSitterProfile,
  SitterAvailability,
  User,
  Prisma,
} from "@prisma/client";

export function toSitterProfile(
  p: PrismaSitterProfile & { user: User; availability: SitterAvailability[] }
): SitterProfile {
  return {
    id: p.id,
    userId: p.userId,
    name: p.user.name ?? p.user.email,
    suburb: p.user.suburb ?? undefined,
    avatarUrl: p.user.image ?? undefined,
    bio: p.bio ?? "",
    hourlyRateCents: p.hourlyRateCents ?? 0,
    yearsExperience: p.yearsExperience ?? 0,
    approvalStatus: p.user.approvalStatus,
    backgroundCheckAt: p.backgroundCheckAt?.toISOString(),
    idVerifiedAt: p.idVerifiedAt?.toISOString(),
    avgRating: p.avgRating ?? 0,
    reviewCount: p.reviewCount,
    wwccConfirmed: p.wwccConfirmed,
    firstAidCertified: p.firstAidCertified,
    bestWithAgeMin: p.bestWithAgeMin ?? undefined,
    bestWithAgeMax: p.bestWithAgeMax ?? undefined,
    offersSchoolPickup: p.offersSchoolPickup,
    offersEveningCare: p.offersEveningCare,
    availability: p.availability.map((a) => ({
      dayOfWeek: a.dayOfWeek,
      startMinute: a.startMinute,
      endMinute: a.endMinute,
    })),
  };
}

// Default duration (minutes) used to check a sitter's recurring weekly
// availability against a searched date+time — the booking form itself still
// lets the parent pick a real start/end afterward. This only checks general
// availability, not existing bookings (no double-booking detection).
const SEARCH_WINDOW_MINUTES = 60;

const WEEKEND_DAYS = [0, 6]; // Sun, Sat

export type AgeBand = "infants" | "toddlers" | "primary" | "teens";

// Fixed age bands for the /sitters age filter — no numeric range picker UI
// exists in this app, so bands keep the filter a simple pill like suburb/sort.
export const AGE_BANDS: Record<AgeBand, { label: string; min: number; max: number }> = {
  infants: { label: "Infants 0–2", min: 0, max: 2 },
  toddlers: { label: "Toddlers 2–5", min: 2, max: 5 },
  primary: { label: "Primary 5–12", min: 5, max: 12 },
  teens: { label: "Teens 12+", min: 12, max: 100 },
};

export async function getAllSitters(filters?: {
  date?: string; // "YYYY-MM-DD"
  time?: string; // "HH:MM" — optional; when omitted, matches any slot that day
  wwcc?: boolean;
  firstAid?: boolean;
  schoolPickup?: boolean;
  eveningCare?: boolean;
  weekend?: boolean;
  ageBand?: AgeBand;
}): Promise<SitterProfile[]> {
  const { date, time, wwcc, firstAid, schoolPickup, eveningCare, weekend, ageBand } =
    filters ?? {};

  let availabilityWhere;
  if (date) {
    const [y, m, d] = date.split("-").map(Number);
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
      const dayOfWeek = new Date(y, m - 1, d).getDay();
      if (time) {
        const [h, min] = time.split(":").map(Number);
        if (!Number.isNaN(h)) {
          const startMinute = h * 60 + min;
          availabilityWhere = {
            availability: {
              some: {
                dayOfWeek,
                startMinute: { lte: startMinute },
                endMinute: { gte: startMinute + SEARCH_WINDOW_MINUTES },
              },
            },
          };
        }
      } else {
        // Date given without a time (e.g. a calendar-day click) — match any
        // slot that day of the week, regardless of time.
        availabilityWhere = { availability: { some: { dayOfWeek } } };
      }
    }
  }

  const andClauses: Prisma.SitterProfileWhereInput[] = [];
  if (availabilityWhere) andClauses.push(availabilityWhere);
  if (wwcc) andClauses.push({ wwccConfirmed: true });
  if (firstAid) andClauses.push({ firstAidCertified: true });
  if (schoolPickup) andClauses.push({ offersSchoolPickup: true });
  if (eveningCare) andClauses.push({ offersEveningCare: true });
  if (weekend) {
    andClauses.push({ availability: { some: { dayOfWeek: { in: WEEKEND_DAYS } } } });
  }
  if (ageBand) {
    const band = AGE_BANDS[ageBand];
    andClauses.push({
      bestWithAgeMin: { lte: band.max },
      bestWithAgeMax: { gte: band.min },
    });
  }

  const profiles = await prisma.sitterProfile.findMany({
    where: andClauses.length > 0 ? { AND: andClauses } : undefined,
    include: { user: true, availability: true },
    orderBy: { user: { createdAt: "asc" } },
  });
  return profiles.map(toSitterProfile);
}

// Which days of the week (0=Sun..6=Sat) have at least one APPROVED, bookable
// sitter with a recurring availability slot — used by the homepage calendar.
// Availability is a weekly recurring pattern with no date-specific
// exceptions, so this is inherently a day-of-week aggregate, not a lookup
// of specific calendar dates.
export async function getAvailableDaysOfWeek(): Promise<Set<number>> {
  const rows = await prisma.sitterAvailability.findMany({
    where: {
      sitterProfile: { user: { approvalStatus: "APPROVED" } },
    },
    select: { dayOfWeek: true },
    distinct: ["dayOfWeek"],
  });
  return new Set(rows.map((r) => r.dayOfWeek));
}

export async function getSitterById(
  id: string
): Promise<SitterProfile | null> {
  const profile = await prisma.sitterProfile.findUnique({
    where: { id },
    include: { user: true, availability: true },
  });
  return profile ? toSitterProfile(profile) : null;
}

export async function getSittersByIds(ids: string[]): Promise<SitterProfile[]> {
  if (ids.length === 0) return [];
  const profiles = await prisma.sitterProfile.findMany({
    where: { id: { in: ids } },
    include: { user: true, availability: true },
  });
  return profiles.map(toSitterProfile);
}
