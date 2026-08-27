import type { Booking, Message, SitterProfile } from "./types";

// Placeholder data standing in for the booking/messaging backend, which is
// still stubbed (see README launch blocker #6). /sitters and /admin now read
// from the real database (src/lib/sitters.ts, prisma) — this file only
// backs the dashboard/booking-thread pages until that backend is wired up.

export const sitters: SitterProfile[] = [
  {
    id: "sit_1",
    userId: "usr_ella",
    name: "Ella R.",
    suburb: "Bundeena",
    bio: "5 years experience with toddlers and infants. First-aid certified, comfortable with pets in the home.",
    hourlyRateCents: 2800,
    yearsExperience: 5,
    approvalStatus: "APPROVED",
    avgRating: 4.9,
    reviewCount: 32,
  },
  {
    id: "sit_2",
    userId: "usr_maya",
    name: "Maya T.",
    suburb: "Maianbar",
    bio: "Early-childhood education student. Great with school-age kids, homework help included.",
    hourlyRateCents: 2400,
    yearsExperience: 2,
    approvalStatus: "APPROVED",
    avgRating: 4.7,
    reviewCount: 11,
  },
  {
    id: "sit_3",
    userId: "usr_jordan",
    name: "Jordan P.",
    suburb: "Bundeena",
    bio: "New to the area — application submitted, waiting on Ella's approval.",
    hourlyRateCents: 2200,
    yearsExperience: 1,
    approvalStatus: "PENDING",
    avgRating: 0,
    reviewCount: 0,
  },
];

export const bookings: Booking[] = [
  {
    id: "bkg_1",
    parentName: "Sam K.",
    sitterId: "sit_1",
    startTime: "2026-08-22T17:00:00.000Z",
    endTime: "2026-08-22T21:00:00.000Z",
    status: "CONFIRMED",
    numChildren: 2,
    notes: "Bedtime is 8pm, allergy to peanuts.",
  },
  {
    id: "bkg_2",
    parentName: "Priya D.",
    sitterId: "sit_1",
    startTime: "2026-08-25T09:00:00.000Z",
    endTime: "2026-08-25T13:00:00.000Z",
    status: "REQUESTED",
    numChildren: 1,
  },
];

export const messages: Message[] = [
  {
    id: "msg_1",
    bookingId: "bkg_1",
    senderName: "Sam K.",
    body: "Hi Ella! Excited to have you watch the kids Saturday.",
    createdAt: "2026-08-18T02:00:00.000Z",
  },
  {
    id: "msg_2",
    bookingId: "bkg_1",
    senderName: "Ella R.",
    body: "Looking forward to it! I'll bring some craft supplies.",
    createdAt: "2026-08-18T02:10:00.000Z",
  },
];

export function getSitterById(id: string) {
  return sitters.find((s) => s.id === id);
}

export function getBookingsForSitter(sitterId: string) {
  return bookings.filter((b) => b.sitterId === sitterId);
}

export function getMessagesForBooking(bookingId: string) {
  return messages.filter((m) => m.bookingId === bookingId);
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}
