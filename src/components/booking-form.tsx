"use client";

import { useState } from "react";
import type { SitterProfile } from "@/lib/types";
import { formatCurrency } from "@/lib/mock-data";
import { requestBooking } from "@/lib/actions";

// Real booking request form — posts to requestBooking (src/lib/actions.ts),
// which creates a Booking + PENDING Payment row and redirects to
// /bookings/[id]. Push notifications on booking creation are still stubbed
// — see src/lib/push.ts and the roadmap doc.
export function BookingForm({ sitter }: { sitter: SitterProfile }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(3);

  const estimateCents = sitter.hourlyRateCents * hours;

  return (
    <form action={requestBooking} className="mt-4 space-y-4">
      <input type="hidden" name="sitterId" value={sitter.id} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Start time
          </label>
          <input
            type="time"
            name="startTime"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-700">
          Duration (hours)
        </label>
        <input
          type="number"
          name="hours"
          min={1}
          max={12}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-1 w-32 rounded-md border border-warm-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center justify-between rounded-md bg-warm-50 px-3 py-2 text-sm">
        <span className="text-warm-600">Estimated total</span>
        <span className="font-medium text-warm-900">
          {formatCurrency(estimateCents)}
        </span>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        Send booking request
      </button>
    </form>
  );
}
