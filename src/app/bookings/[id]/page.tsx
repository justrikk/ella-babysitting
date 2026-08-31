import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/mock-data";
import { Avatar } from "@/components/avatar";
import { SquareCardForm } from "@/components/square-card-form";

// Deliberately outside /dashboard — /dashboard/bookings/[id] is still the
// existing mock-data-driven page; this is the real, Prisma-backed one.
export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const session = await auth();
  if (!session) redirect("/signin");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      parent: true,
      sitter: { include: { user: true } },
      payment: true,
    },
  });
  if (!booking) notFound();

  // proxy.ts can't express per-row ownership — only the parent who made
  // this booking, the assigned sitter, or an admin may view it.
  const isParent = booking.parentId === session.user.id;
  const isSitter = booking.sitter.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isParent && !isSitter && !isAdmin) notFound();

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const paid = booking.payment?.status === "CAPTURED";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <nav className="mb-4 text-xs text-warm-500">
        <Link href="/" className="hover:text-warm-900">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-warm-700">Booking</span>
      </nav>

      <div className="flex items-center gap-3">
        <Avatar
          name={booking.sitter.user.name ?? booking.sitter.user.email}
          imageUrl={booking.sitter.user.image}
          className="h-12 w-12"
        />
        <div>
          <h1 className="text-xl font-semibold text-warm-900">
            Booking with {booking.sitter.user.name ?? booking.sitter.user.email}
          </h1>
          <p className="text-sm text-warm-500">Status: {booking.status}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-warm-200 bg-white p-5 text-sm text-warm-700">
        <p>
          {start.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-1">
          {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} –{" "}
          {end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} ({hours}h)
        </p>
        <p className="mt-1">
          {booking.numChildren} child{booking.numChildren > 1 ? "ren" : ""}
        </p>
        {booking.notes && <p className="mt-1">Notes: {booking.notes}</p>}
      </div>

      {booking.payment && (
        <div className="mt-6 rounded-lg border border-warm-200 bg-white p-5">
          <h2 className="text-lg font-medium text-warm-900">Booking fee</h2>
          <p className="mt-1 text-sm text-warm-600">
            A {formatCurrency(booking.payment.amountCents)} platform fee — required
            before the booking is confirmed and the sitter is assigned. We&apos;ll
            send you the sitter&apos;s contact details, and emergency contacts are
            shared with you. We thank you for booking with Sitter Sisters — the
            booking fee goes towards hosting the website and developing the local
            business.
          </p>

          {error === "payment" && (
            <p className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              That card was declined — please try again.
            </p>
          )}

          {paid ? (
            <p className="mt-3 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              Paid.
            </p>
          ) : isParent ? (
            <SquareCardForm bookingId={booking.id} />
          ) : (
            <p className="mt-3 text-sm text-warm-500">Awaiting payment from the parent.</p>
          )}
        </div>
      )}

      {paid && (
        <div className="mt-6 rounded-lg border border-warm-200 bg-white p-5">
          <h2 className="text-lg font-medium text-warm-900">Emergency contacts</h2>
          <p className="mt-1 text-xs text-warm-500">
            Shared only with you, only after the booking fee is paid.
          </p>
          <div className="mt-3 space-y-2 text-sm text-warm-700">
            <p>
              {booking.sitter.emergencyContact1Name} —{" "}
              {booking.sitter.emergencyContact1Phone}
            </p>
            <p>
              {booking.sitter.emergencyContact2Name} —{" "}
              {booking.sitter.emergencyContact2Phone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
