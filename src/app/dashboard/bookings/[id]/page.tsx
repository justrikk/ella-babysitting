import { notFound } from "next/navigation";
import {
  bookings,
  getSitterById,
  getMessagesForBooking,
} from "@/lib/mock-data";
import { MessageThread } from "@/components/message-thread";
import { Avatar } from "@/components/avatar";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) notFound();

  const sitter = getSitterById(booking.sitterId);
  const initialMessages = getMessagesForBooking(booking.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-3">
        {sitter && <Avatar name={sitter.name} className="h-12 w-12" />}
        <div>
          <h1 className="text-2xl font-semibold text-warm-900">
            {booking.parentName} &amp; {sitter?.name}
          </h1>
          <p className="text-sm text-warm-500">
            {new Date(booking.startTime).toLocaleString()} —{" "}
            {new Date(booking.endTime).toLocaleTimeString()}
          </p>
        </div>
      </div>
      {booking.notes && (
        <p className="mt-4 rounded-md bg-warm-50 p-3 text-sm text-warm-700">
          {booking.notes}
        </p>
      )}

      <div className="mt-6 rounded-xl border border-warm-200 bg-white">
        <div className="border-b border-warm-200 px-4 py-3">
          <h2 className="text-sm font-medium text-warm-900">Messages</h2>
        </div>
        <MessageThread bookingId={booking.id} initialMessages={initialMessages} />
      </div>
    </div>
  );
}
