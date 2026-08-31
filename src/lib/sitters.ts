import { prisma } from "@/lib/prisma";
import type { SitterProfile } from "@/lib/types";
import type {
  SitterProfile as PrismaSitterProfile,
  User,
} from "@prisma/client";

function toSitterProfile(
  p: PrismaSitterProfile & { user: User }
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
  };
}

// Default duration (minutes) used to check a sitter's recurring weekly
// availability against a searched date+time — the booking form itself still
// lets the parent pick a real start/end afterward. This only checks general
// availability, not existing bookings (no double-booking detection).
const SEARCH_WINDOW_MINUTES = 60;

export async function getAllSitters(filters?: {
  date?: string; // "YYYY-MM-DD"
  time?: string; // "HH:MM"
}): Promise<SitterProfile[]> {
  const { date, time } = filters ?? {};

  let availabilityWhere;
  if (date && time) {
    const [y, m, d] = date.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    if (!Number.isNaN(y) && !Number.isNaN(h)) {
      const dayOfWeek = new Date(y, m - 1, d).getDay();
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
  }

  const profiles = await prisma.sitterProfile.findMany({
    where: availabilityWhere,
    include: { user: true },
    orderBy: { user: { createdAt: "asc" } },
  });
  return profiles.map(toSitterProfile);
}

export async function getSitterById(
  id: string
): Promise<SitterProfile | null> {
  const profile = await prisma.sitterProfile.findUnique({
    where: { id },
    include: { user: true },
  });
  return profile ? toSitterProfile(profile) : null;
}
