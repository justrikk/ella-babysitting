// Types mirror prisma/schema.prisma. Once a real database is wired up,
// these can be replaced by `@prisma/client`'s generated types directly.

export type Role = "PARENT" | "SITTER" | "ADMIN";

// Admin-approval gate (Ella approves every account) — this replaced an
// earlier background-check-based verification model, since this app is
// closed to known people in Bundeena / Maianbar and formal checks aren't
// required. See prisma/schema.prisma for the full note.
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type BookingStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "DECLINED"
  | "CANCELLED"
  | "COMPLETED";

export interface SitterProfile {
  id: string;
  userId: string;
  name: string;
  suburb?: string;
  avatarUrl?: string;
  bio: string;
  hourlyRateCents: number;
  yearsExperience: number;
  approvalStatus: ApprovalStatus;
  backgroundCheckAt?: string; // optional, not required for this app
  idVerifiedAt?: string; // optional, not required for this app
  avgRating: number;
  reviewCount: number;
}

export interface Booking {
  id: string;
  parentName: string;
  sitterId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  numChildren: number;
  notes?: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderName: string;
  body: string;
  createdAt: string;
}
