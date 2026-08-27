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
    bio: p.bio ?? "",
    hourlyRateCents: p.hourlyRateCents,
    yearsExperience: p.yearsExperience ?? 0,
    approvalStatus: p.user.approvalStatus,
    backgroundCheckAt: p.backgroundCheckAt?.toISOString(),
    idVerifiedAt: p.idVerifiedAt?.toISOString(),
    avgRating: p.avgRating ?? 0,
    reviewCount: p.reviewCount,
  };
}

export async function getAllSitters(): Promise<SitterProfile[]> {
  const profiles = await prisma.sitterProfile.findMany({
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
