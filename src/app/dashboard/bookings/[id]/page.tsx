import { notFound } from "next/navigation";
import {
  bookings,
  getSitterById,
  getMessagesForBooking,
} from "@/lib/mock-data";
import { MessageThread } from "@/components/message-thread";

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
      <h1 className="text-2xl font-semibold text-neutral-900">
        {booking.parentName} & {sitter?.name}
      </h1>
      <p className="text-sm text-neutral-500">
        {new Date(booking.startTime).toLocaleString()} —{" "}
        {new Date(booking.endTime).toLocaleTimeString()}
      </p>
      {booking.notes && (
        <p className="mt-2 rounded-md bg-neutral-50 p-3 text-sm text-neutral-700">
          {booking.notes}
        </p>
      )}

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-medium text-neutral-900">Messages</h2>
        </div>
        <MessageThread bookingId={booking.id} initialMessages={initialMessages} />
      </div>
    </div>
  );
}
