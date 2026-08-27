import Link from "next/link";
import { bookings, getSitterById, formatCurrency } from "@/lib/mock-data";
import { Avatar } from "@/components/avatar";
import { IconCalendarHeart } from "@/components/icons";

const statusStyles: Record<string, string> = {
  REQUESTED: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-800",
  CANCELLED: "bg-warm-100 text-warm-600",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">
        Your bookings
      </h1>
      <p className="mt-1 text-sm text-warm-600">
        Showing mock data for Ella&apos;s sitter dashboard. In production this
        filters by the signed-in user (parent or sitter).
      </p>

      {bookings.length > 0 ? (
        <div className="mt-6 space-y-3">
          {bookings.map((booking) => {
            const sitter = getSitterById(booking.sitterId);
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const hours =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="block rounded-xl border border-warm-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {sitter && <Avatar name={sitter.name} />}
                    <div>
                      <p className="font-medium text-warm-900">
                        {booking.parentName} → {sitter?.name}
                      </p>
                      <p className="text-sm text-warm-500">
                        {start.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {start.toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        – {hours}h · {booking.numChildren} child
                        {booking.numChildren > 1 ? "ren" : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[booking.status]
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                {sitter && (
                  <p className="mt-2 text-sm text-warm-600">
                    Est. {formatCurrency(sitter.hourlyRateCents * hours)}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-warm-300 bg-warm-50 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <IconCalendarHeart className="h-6 w-6" />
          </div>
          <p className="text-sm text-warm-500">
            No bookings yet —{" "}
            <Link href="/sitters" className="text-primary-700 underline">
              find a sitter
            </Link>{" "}
            to get started.
          </p>
        </div>
      )}
    </div>
  );
}
