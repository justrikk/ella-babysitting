"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

const sitterApplySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  suburb: suburbSchema,
  note: z.string().trim().optional(),
  yearsExperience: z.coerce.number().int().min(0),
  hourlyRate: z.coerce.number().positive(),
  bio: z.string().trim().min(1),
});

export async function applyAsSitter(formData: FormData) {
  const parsed = sitterApplySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    suburb: formData.get("suburb"),
    note: formData.get("note"),
    yearsExperience: formData.get("yearsExperience"),
    hourlyRate: formData.get("hourlyRate"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) redirect("/sitters/apply?error=invalid");
  const { name, email, suburb, note, yearsExperience, hourlyRate, bio } =
    parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/sitters/apply?error=exists");

  await prisma.user.create({
    data: {
      name,
      email,
      suburb,
      referralNote: note || null,
      role: "SITTER",
      approvalStatus: "PENDING",
      sitterProfile: {
        create: {
          bio,
          yearsExperience,
          hourlyRateCents: Math.round(hourlyRate * 100),
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
