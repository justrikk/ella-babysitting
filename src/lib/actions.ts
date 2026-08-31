"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getSupabaseServiceClient, SITTER_AVATARS_BUCKET } from "@/lib/supabase";
import { payBookingFee } from "@/lib/payments";

const BOOKING_FEE_CENTS = 495;

const suburbSchema = z.enum(["Bundeena", "Maianbar"]);

const joinSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  suburb: suburbSchema,
  note: z.string().trim().optional(),
});

export async function requestParentAccess(formData: FormData) {
  const parsed = joinSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    suburb: formData.get("suburb"),
    note: formData.get("note"),
  });

  if (!parsed.success) redirect("/join?error=invalid");
  const { name, email, suburb, note } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/join?error=exists");

  await prisma.user.create({
    data: {
      name,
      email,
      suburb,
      referralNote: note || null,
      role: "PARENT",
      approvalStatus: "PENDING",
    },
  });

  redirect("/join?success=1");
}

// A local network where teenage sitters are normal and expected — so there's
// no hard legal minimum age. The bounds below just catch fat-fingered dates
// (e.g. a typo'd birth year), and under-16 sitters must supply a parent/
// guardian contact instead of being blocked outright.
const MIN_AGE_YEARS = 12;
const MAX_AGE_YEARS = 100;
const PARENT_CONSENT_AGE_YEARS = 16;
// NSW requires a Working with Children Check for child-related work at 18+
// (https://ocg.nsw.gov.au/working-children-check/who-needs-check).
const WWCC_REQUIRED_AGE_YEARS = 18;

function ageInYears(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const monthDay = now.getMonth() - dob.getMonth() || now.getDate() - dob.getDate();
  if (monthDay < 0) age--;
  return age;
}

const sitterApplySchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(1),
    suburb: suburbSchema,
    note: z.string().trim().optional(),
    dateOfBirth: z.coerce.date().refine((d) => {
      const age = ageInYears(d);
      return age >= MIN_AGE_YEARS && age <= MAX_AGE_YEARS;
    }, "Please double-check the date of birth."),
    emergencyContact1Name: z.string().trim().min(1),
    emergencyContact1Phone: z.string().trim().min(1),
    emergencyContact2Name: z.string().trim().min(1),
    emergencyContact2Phone: z.string().trim().min(1),
    parentGuardianName: z.string().trim().optional(),
    parentGuardianPhone: z.string().trim().optional(),
    wwccConfirmed: z.literal("on").optional(),
    wwccNumber: z.string().trim().optional(),
    wwccExpiry: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
    firstAidCertified: z.literal("on").optional(),
    otherCertifications: z.string().trim().optional(),
    termsAccepted: z.literal("on", {
      message: "You must accept the terms to sign up.",
    }),
  })
  .refine(
    (data) =>
      ageInYears(data.dateOfBirth) >= PARENT_CONSENT_AGE_YEARS ||
      (!!data.parentGuardianName && !!data.parentGuardianPhone),
    {
      message: "A parent/guardian name and phone are required under 16.",
      path: ["parentGuardianName"],
    }
  )
  .refine(
    (data) =>
      ageInYears(data.dateOfBirth) < WWCC_REQUIRED_AGE_YEARS || data.wwccConfirmed === "on",
    {
      message: "A Working with Children Check is required for sitters 18 and over.",
      path: ["wwccConfirmed"],
    }
  );

export async function applyAsSitter(formData: FormData) {
  const parsed = sitterApplySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    suburb: formData.get("suburb"),
    note: formData.get("note"),
    dateOfBirth: formData.get("dateOfBirth"),
    emergencyContact1Name: formData.get("emergencyContact1Name"),
    emergencyContact1Phone: formData.get("emergencyContact1Phone"),
    emergencyContact2Name: formData.get("emergencyContact2Name"),
    emergencyContact2Phone: formData.get("emergencyContact2Phone"),
    parentGuardianName: formData.get("parentGuardianName") || undefined,
    parentGuardianPhone: formData.get("parentGuardianPhone") || undefined,
    wwccConfirmed: formData.get("wwccConfirmed") || undefined,
    wwccNumber: formData.get("wwccNumber") || undefined,
    wwccExpiry: formData.get("wwccExpiry") || undefined,
    firstAidCertified: formData.get("firstAidCertified") || undefined,
    otherCertifications: formData.get("otherCertifications") || undefined,
    termsAccepted: formData.get("termsAccepted"),
  });

  if (!parsed.success) redirect("/sitters/apply?error=invalid");
  const {
    name,
    email,
    phone,
    suburb,
    note,
    dateOfBirth,
    emergencyContact1Name,
    emergencyContact1Phone,
    emergencyContact2Name,
    emergencyContact2Phone,
    parentGuardianName,
    parentGuardianPhone,
    wwccConfirmed,
    wwccNumber,
    wwccExpiry,
    firstAidCertified,
    otherCertifications,
  } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/sitters/apply?error=exists");

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      suburb,
      referralNote: note || null,
      role: "SITTER",
      approvalStatus: "PENDING",
      sitterProfile: {
        create: {
          dateOfBirth,
          emergencyContact1Name,
          emergencyContact1Phone,
          emergencyContact2Name,
          emergencyContact2Phone,
          parentGuardianName: parentGuardianName || null,
          parentGuardianPhone: parentGuardianPhone || null,
          wwccConfirmed: wwccConfirmed === "on",
          wwccNumber: wwccNumber || null,
          wwccExpiry: wwccExpiry ?? null,
          firstAidCertified: firstAidCertified === "on",
          otherCertifications: otherCertifications || null,
          termsAcceptedAt: new Date(),
        },
      },
    },
  });

  redirect("/sitters/apply?success=1");
}

export async function decideApproval(
  userId: string,
  decision: "APPROVED" | "REJECTED"
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      approvalStatus: decision,
      approvedById: session.user.id,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/admin");
}

// Self-service profile editor (src/app/dashboard/profile) — only reachable
// by a signed-in, APPROVED sitter editing their own profile. proxy.ts
// already gates /dashboard/* on APPROVED sessions; the role + ownership
// checks below are the part it can't express.
async function requireOwnSitterProfile() {
  const session = await auth();
  if (
    !session ||
    session.user.role !== "SITTER" ||
    session.user.approvalStatus !== "APPROVED"
  ) {
    throw new Error("Not authorized");
  }
  const profile = await prisma.sitterProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("No sitter profile found");
  return { session, profile };
}

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const updateSitterProfileSchema = z.object({
  bio: z.string().trim().min(1),
  hourlyRate: z.coerce.number().positive(),
  wwccConfirmed: z.literal("on").optional(),
  wwccNumber: z.string().trim().optional(),
  wwccExpiry: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  firstAidCertified: z.literal("on").optional(),
  otherCertifications: z.string().trim().optional(),
});

export async function updateSitterProfile(formData: FormData) {
  const { session, profile } = await requireOwnSitterProfile();

  const parsed = updateSitterProfileSchema.safeParse({
    bio: formData.get("bio"),
    hourlyRate: formData.get("hourlyRate"),
    wwccConfirmed: formData.get("wwccConfirmed") || undefined,
    wwccNumber: formData.get("wwccNumber") || undefined,
    wwccExpiry: formData.get("wwccExpiry") || undefined,
    firstAidCertified: formData.get("firstAidCertified") || undefined,
    otherCertifications: formData.get("otherCertifications") || undefined,
  });
  if (!parsed.success) redirect("/dashboard/profile?error=invalid");
  const {
    bio,
    hourlyRate,
    wwccConfirmed,
    wwccNumber,
    wwccExpiry,
    firstAidCertified,
    otherCertifications,
  } = parsed.data;

  let imageUrl: string | undefined;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
      redirect("/dashboard/profile?error=phototype");
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      redirect("/dashboard/profile?error=photosize");
    }
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const path = `${session.user.id}/${Date.now()}.${ext}`;
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.storage
      .from(SITTER_AVATARS_BUCKET)
      .upload(path, photo, { contentType: photo.type });
    if (error) redirect("/dashboard/profile?error=upload");
    imageUrl = supabase.storage.from(SITTER_AVATARS_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  await prisma.$transaction([
    prisma.sitterProfile.update({
      where: { id: profile.id },
      data: {
        bio,
        hourlyRateCents: Math.round(hourlyRate * 100),
        wwccConfirmed: wwccConfirmed === "on",
        wwccNumber: wwccNumber || null,
        wwccExpiry: wwccExpiry ?? null,
        firstAidCertified: firstAidCertified === "on",
        otherCertifications: otherCertifications || null,
      },
    }),
    ...(imageUrl
      ? [prisma.user.update({ where: { id: session.user.id }, data: { image: imageUrl } })]
      : []),
  ]);

  revalidatePath("/dashboard/profile");
  revalidatePath("/sitters");
  revalidatePath(`/sitters/${profile.id}`);
  redirect("/dashboard/profile?success=1");
}

const availabilitySlotSchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })
  .refine((d) => timeToMinutes(d.startTime) < timeToMinutes(d.endTime), {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export async function addAvailabilitySlot(formData: FormData) {
  const { profile } = await requireOwnSitterProfile();

  const parsed = availabilitySlotSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });
  if (!parsed.success) redirect("/dashboard/profile?error=invalidslot");
  const { dayOfWeek, startTime, endTime } = parsed.data;

  await prisma.sitterAvailability.create({
    data: {
      sitterProfileId: profile.id,
      dayOfWeek,
      startMinute: timeToMinutes(startTime),
      endMinute: timeToMinutes(endTime),
    },
  });

  revalidatePath("/dashboard/profile");
}

export async function deleteAvailabilitySlot(formData: FormData) {
  const { profile } = await requireOwnSitterProfile();
  const slotId = formData.get("slotId");
  if (typeof slotId !== "string") redirect("/dashboard/profile?error=invalidslot");

  await prisma.sitterAvailability.deleteMany({
    where: { id: slotId, sitterProfileId: profile.id },
  });

  revalidatePath("/dashboard/profile");
}

const requestBookingSchema = z.object({
  sitterId: z.string().trim().min(1),
  date: z.string().trim().min(1),
  startTime: z.string().trim().min(1),
  hours: z.coerce.number().min(1).max(12),
});

// Real booking creation — the form itself (src/components/booking-form.tsx)
// only ever checked the sitter's approval; the caller-side check here is
// what stops an anonymous or PENDING visitor from creating a booking.
export async function requestBooking(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    session.user.role !== "PARENT" ||
    session.user.approvalStatus !== "APPROVED"
  ) {
    throw new Error("Not authorized");
  }

  const parsed = requestBookingSchema.safeParse({
    sitterId: formData.get("sitterId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    hours: formData.get("hours"),
  });
  if (!parsed.success) throw new Error("Invalid booking request");
  const { sitterId, date, startTime, hours } = parsed.data;

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

  const booking = await prisma.booking.create({
    data: {
      parentId: session.user.id,
      sitterId,
      startTime: start,
      endTime: end,
      status: "REQUESTED",
      payment: {
        create: {
          amountCents: BOOKING_FEE_CENTS,
          platformFeeCents: BOOKING_FEE_CENTS,
          sitterPayoutCents: 0,
          status: "PENDING",
        },
      },
    },
  });

  redirect(`/bookings/${booking.id}`);
}

// Charges the real AUD $4.95 booking fee via Square (src/lib/payments.ts —
// not a stub). sourceId is the card token the Web Payments SDK produced
// client-side in src/app/bookings/[id]/page.tsx.
export async function payBookingFeeAction(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/signin");

  const bookingId = formData.get("bookingId");
  const sourceId = formData.get("sourceId");
  if (typeof bookingId !== "string" || typeof sourceId !== "string") {
    throw new Error("Invalid payment request");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });
  if (!booking || !booking.payment || booking.parentId !== session.user.id) {
    throw new Error("Not authorized");
  }
  if (booking.payment.status === "CAPTURED") {
    redirect(`/bookings/${bookingId}`);
  }

  let squarePaymentId: string;
  try {
    ({ squarePaymentId } = await payBookingFee({
      paymentId: booking.payment.id,
      sourceId,
      amountCents: booking.payment.amountCents,
    }));
  } catch {
    // Payment.status stays PENDING — declines/errors are not fatal, the
    // payer can just retry with a different card.
    redirect(`/bookings/${bookingId}?error=payment`);
  }

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: { status: "CAPTURED", squarePaymentId },
  });

  revalidatePath(`/bookings/${bookingId}`);
  redirect(`/bookings/${bookingId}`);
}
