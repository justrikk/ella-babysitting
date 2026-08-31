import type { SitterAvailabilitySlot } from "@/lib/types";

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Morning/afternoon/evening bucketing by start time — matches how a parent
// would casually describe a slot, not exact hours.
function periodFor(startMinute: number): "morning" | "afternoon" | "evening" {
  if (startMinute < 12 * 60) return "morning";
  if (startMinute < 17 * 60) return "afternoon";
  return "evening";
}

function minutesToTime(min: number): string {
  const h24 = Math.floor(min / 60);
  const m = min % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 ? "am" : "pm";
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

// Short summary for the sitter card, e.g. "Fri evening · Sat afternoon".
// Groups by day (a day with multiple slots spanning periods just shows the
// first), caps at 3 day/period pairs so the card stays scannable.
export function summarizeAvailability(slots: SitterAvailabilitySlot[]): string {
  if (slots.length === 0) return "By request";

  const seenDays = new Set<number>();
  const parts: string[] = [];
  const sorted = [...slots].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  for (const slot of sorted) {
    if (seenDays.has(slot.dayOfWeek)) continue;
    seenDays.add(slot.dayOfWeek);
    parts.push(`${DAY_ABBR[slot.dayOfWeek]} ${periodFor(slot.startMinute)}`);
    if (parts.length === 3) break;
  }

  return parts.join(" · ");
}

// Fuller day-by-day listing for the sitter profile page.
export function formatWeeklyAvailability(
  slots: SitterAvailabilitySlot[]
): { day: string; times: string }[] {
  const byDay = new Map<number, SitterAvailabilitySlot[]>();
  for (const slot of slots) {
    const existing = byDay.get(slot.dayOfWeek) ?? [];
    existing.push(slot);
    byDay.set(slot.dayOfWeek, existing);
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a - b)
    .map(([dayOfWeek, daySlots]) => ({
      day: DAY_FULL[dayOfWeek],
      times: daySlots
        .sort((a, b) => a.startMinute - b.startMinute)
        .map((s) => `${minutesToTime(s.startMinute)}–${minutesToTime(s.endMinute)}`)
        .join(", "),
    }));
}
