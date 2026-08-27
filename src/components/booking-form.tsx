"use client";

import { useState } from "react";
import type { SitterProfile } from "@/lib/types";
import { formatCurrency } from "@/lib/mock-data";

// Client-side booking request form. On submit this should POST to
// /api/bookings (create Booking with status REQUESTED), which in turn
// triggers a push notification + message thread. Both are stubbed —
// see src/lib/push.ts and the roadmap doc.
export function BookingForm({ sitter }: { sitter: SitterProfile }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const estimateCents = sitter.hourlyRateCents * hours;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to /api/bookings once a real backend exists.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
        Booking request sent to {sitter.name}. You&apos;ll get a notification
        once they confirm. (Scaffold only — no backend wired up yet.)
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Start time
          </label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Duration (hours)
        </label>
        <input
          type="number"
          min={1}
          max={12}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-1 w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2 text-sm">
        <span className="text-neutral-600">Estimated total</span>
        <span className="font-medium text-neutral-900">
          {formatCurrency(estimateCents)}
        </span>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
      >
        Send booking request
      </button>
    </form>
  );
}
