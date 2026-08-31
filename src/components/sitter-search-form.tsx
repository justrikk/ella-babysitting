// Plain GET form, server-rendered via URL searchParams — no client JS
// required, same pattern as the suburb/sort pills on this page.
export function SitterSearchForm({
  suburb,
  sort,
  date,
  time,
}: {
  suburb?: string;
  sort?: string;
  date?: string;
  time?: string;
}) {
  return (
    <form
      method="get"
      action="/sitters"
      className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-warm-200 bg-white p-3"
    >
      {suburb && <input type="hidden" name="suburb" value={suburb} />}
      {sort && sort !== "newest" && <input type="hidden" name="sort" value={sort} />}

      <div>
        <label className="block text-xs font-medium tracking-wide text-warm-500 uppercase">
          Date
        </label>
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="mt-1 rounded-md border border-warm-300 px-2.5 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium tracking-wide text-warm-500 uppercase">
          Time
        </label>
        <input
          type="time"
          name="time"
          defaultValue={time}
          className="mt-1 rounded-md border border-warm-300 px-2.5 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        Search availability
      </button>
      {(date || time) && (
        <a
          href={`/sitters${suburb ? `?suburb=${suburb}` : ""}`}
          className="text-xs text-warm-500 underline"
        >
          Clear
        </a>
      )}
    </form>
  );
}
