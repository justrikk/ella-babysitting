import Link from "next/link";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-AU", {
  month: "long",
  year: "numeric",
});

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Builds a Sunday-first grid of cells (nulls for leading/trailing padding)
// for a single calendar month.
function buildMonthGrid(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function MonthGrid({
  year,
  month,
  availableDaysOfWeek,
  todayKey,
}: {
  year: number;
  month: number;
  availableDaysOfWeek: Set<number>;
  todayKey: string;
}) {
  const cells = buildMonthGrid(year, month);

  return (
    <div className="flex-1">
      <p className="text-center text-sm font-semibold text-warm-900">
        {MONTH_FORMATTER.format(new Date(year, month, 1))}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-y-1.5 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <span
            key={i}
            className="text-[11px] font-medium tracking-wide text-warm-400"
          >
            {label}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;

          const dateKey = toDateKey(year, month, day);
          const dayOfWeek = new Date(year, month, day).getDay();
          const isPast = dateKey < todayKey;
          const isAvailable = !isPast && availableDaysOfWeek.has(dayOfWeek);
          const isToday = dateKey === todayKey;

          if (!isAvailable) {
            return (
              <span
                key={i}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                  isPast ? "text-warm-300" : "text-warm-400"
                } ${isToday ? "ring-1 ring-warm-300" : ""}`}
              >
                {day}
              </span>
            );
          }

          return (
            <Link
              key={i}
              href={`/sitters?date=${dateKey}`}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 transition hover:bg-primary-600 hover:text-white ${
                isToday ? "ring-2 ring-primary-400" : ""
              }`}
            >
              {day}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Server-rendered 2-month availability calendar for the homepage. Highlights
// which dates have at least one approved sitter recurringly available, based
// on day-of-week (availability is a weekly pattern, not date-specific), and
// links straight into a date-filtered search.
export function AvailabilityCalendar({
  availableDaysOfWeek,
}: {
  availableDaysOfWeek: Set<number>;
}) {
  const today = new Date();
  const y0 = today.getFullYear();
  const m0 = today.getMonth();
  const nextMonthDate = new Date(y0, m0 + 1, 1);
  const todayKey = toDateKey(y0, m0, today.getDate());

  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-5 sm:p-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
        <MonthGrid
          year={y0}
          month={m0}
          availableDaysOfWeek={availableDaysOfWeek}
          todayKey={todayKey}
        />
        <MonthGrid
          year={nextMonthDate.getFullYear()}
          month={nextMonthDate.getMonth()}
          availableDaysOfWeek={availableDaysOfWeek}
          todayKey={todayKey}
        />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-warm-500">
        <span className="h-3 w-3 rounded-full bg-primary-100" />
        Sitters recurringly available — tap a date to search
      </div>
    </div>
  );
}
