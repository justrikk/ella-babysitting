import Link from "next/link";
import { getAllSitters, AGE_BANDS, type AgeBand } from "@/lib/sitters";
import { SitterSearchForm } from "@/components/sitter-search-form";
import { SitterCarousel } from "@/components/sitter-carousel";

const SUBURBS = ["Bundeena", "Maianbar"] as const;

const SORTS = {
  newest: { label: "Newest", fn: () => 0 },
  rating: {
    label: "Top rated",
    fn: (a: Awaited<ReturnType<typeof getAllSitters>>[number], b: typeof a) =>
      b.avgRating - a.avgRating,
  },
  experience: {
    label: "Most experienced",
    fn: (a: Awaited<ReturnType<typeof getAllSitters>>[number], b: typeof a) =>
      b.yearsExperience - a.yearsExperience,
  },
} as const;

type SortKey = keyof typeof SORTS;

interface Filters {
  suburb?: string;
  sort?: string;
  date?: string;
  time?: string;
  wwcc?: string;
  firstAid?: string;
  schoolPickup?: string;
  eveningCare?: string;
  weekend?: string;
  age?: string;
}

function buildHref(params: Filters) {
  const qs = new URLSearchParams();
  if (params.suburb) qs.set("suburb", params.suburb);
  if (params.sort && params.sort !== "newest") qs.set("sort", params.sort);
  if (params.date) qs.set("date", params.date);
  if (params.time) qs.set("time", params.time);
  if (params.wwcc) qs.set("wwcc", "1");
  if (params.firstAid) qs.set("firstAid", "1");
  if (params.schoolPickup) qs.set("schoolPickup", "1");
  if (params.eveningCare) qs.set("eveningCare", "1");
  if (params.weekend) qs.set("weekend", "1");
  if (params.age) qs.set("age", params.age);
  const s = qs.toString();
  return s ? `/sitters?${s}` : "/sitters";
}

// A toggle pill's href flips just its own param and leaves everything else
// in the current search untouched.
function toggleHref(current: Filters, key: keyof Filters, value: string) {
  const isActive = current[key] === value;
  return buildHref({ ...current, [key]: isActive ? undefined : value });
}

export default async function SittersPage({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const params = await searchParams;
  const { suburb, sort, date, time, wwcc, firstAid, schoolPickup, eveningCare, weekend, age } =
    params;
  const sortKey: SortKey = sort && sort in SORTS ? (sort as SortKey) : "newest";
  const ageBand: AgeBand | undefined = age && age in AGE_BANDS ? (age as AgeBand) : undefined;

  const allSitters = await getAllSitters({
    date,
    time,
    wwcc: !!wwcc,
    firstAid: !!firstAid,
    schoolPickup: !!schoolPickup,
    eveningCare: !!eveningCare,
    weekend: !!weekend,
    ageBand,
  });
  const filtered = suburb
    ? allSitters.filter((s) => s.suburb === suburb)
    : allSitters;
  const sitters = [...filtered].sort(SORTS[sortKey].fn);

  const anyFilterApplied = Boolean(
    date || time || wwcc || firstAid || schoolPickup || eveningCare || weekend || age
  );

  const pillCls = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-primary-600 bg-primary-600 text-white"
        : "border-warm-300 bg-white text-warm-700 hover:bg-warm-50"
    }`;

  const togglePillCls = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "border-primary-600 bg-primary-600 text-white"
        : "border-warm-300 bg-white text-warm-700 hover:bg-warm-50"
    }`;

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-primary-600">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <nav className="text-xs text-primary-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">Find a sitter</span>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Find a sitter{suburb ? ` in ${suburb}` : ""}
          </h1>
          <p className="mt-1 text-sm text-primary-100">
            {sitters.length} sitter{sitters.length === 1 ? "" : "s"} listed.
            Anyone can browse — sitters marked &quot;Approved Sitter
            Sister&quot; can accept bookings.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium tracking-wide text-warm-500 uppercase">
            Suburb
          </span>
          <Link href={buildHref({ ...params, suburb: undefined })} className={pillCls(!suburb)}>
            All
          </Link>
          {SUBURBS.map((s) => (
            <Link
              key={s}
              href={buildHref({ ...params, suburb: s })}
              className={pillCls(suburb === s)}
            >
              {s}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium tracking-wide text-warm-500 uppercase">
            Sort
          </span>
          {(Object.keys(SORTS) as SortKey[]).map((key) => (
            <Link
              key={key}
              href={buildHref({ ...params, sort: key })}
              className={pillCls(sortKey === key)}
            >
              {SORTS[key].label}
            </Link>
          ))}
        </div>

        <SitterSearchForm suburb={suburb} sort={sort} date={date} time={time} />

        {date && time && (
          <p className="mt-3 text-xs text-warm-500">
            Showing sitters recurringly available around{" "}
            {new Date(`${date}T${time}`).toLocaleString(undefined, {
              weekday: "long",
              hour: "numeric",
              minute: "2-digit",
            })}
            .
          </p>
        )}
        {date && !time && (
          <p className="mt-3 text-xs text-warm-500">
            Showing sitters recurringly available on{" "}
            {new Date(`${date}T00:00`).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        )}

        <details className="mt-4 rounded-lg border border-warm-200 bg-white p-3 open:pb-4">
          <summary className="cursor-pointer text-sm font-medium text-warm-700">
            More filters
          </summary>
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium tracking-wide text-warm-500 uppercase">
                Requirements
              </span>
              <Link href={toggleHref(params, "wwcc", "1")} className={togglePillCls(!!wwcc)}>
                WWCC
              </Link>
              <Link
                href={toggleHref(params, "firstAid", "1")}
                className={togglePillCls(!!firstAid)}
              >
                First Aid
              </Link>
              <Link
                href={toggleHref(params, "schoolPickup", "1")}
                className={togglePillCls(!!schoolPickup)}
              >
                School pickup
              </Link>
              <Link
                href={toggleHref(params, "eveningCare", "1")}
                className={togglePillCls(!!eveningCare)}
              >
                Evening care
              </Link>
              <Link
                href={toggleHref(params, "weekend", "1")}
                className={togglePillCls(!!weekend)}
              >
                Weekend availability
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium tracking-wide text-warm-500 uppercase">
                Best with
              </span>
              {(Object.keys(AGE_BANDS) as AgeBand[]).map((band) => (
                <Link
                  key={band}
                  href={toggleHref(params, "age", band)}
                  className={togglePillCls(age === band)}
                >
                  {AGE_BANDS[band].label}
                </Link>
              ))}
            </div>
          </div>
        </details>

        <div className="mt-6">
          {sitters.length > 0 && <SitterCarousel sitters={sitters} />}
        </div>

        {sitters.length === 0 && allSitters.length > 0 && (
          <p className="mt-10 text-center text-sm text-warm-500">
            No sitters in {suburb} right now —{" "}
            <Link
              href={buildHref({ ...params, suburb: undefined })}
              className="text-primary-700 underline"
            >
              browse all suburbs
            </Link>
            .
          </p>
        )}
        {allSitters.length === 0 && (
          <p className="mt-10 text-center text-sm text-warm-500">
            {anyFilterApplied
              ? "No sitters match those filters — try adjusting them, or "
              : "No sitters yet — the first application will show up here once our team approves it in "}
            {anyFilterApplied ? (
              <Link href={buildHref({ suburb, sort })} className="text-primary-700 underline">
                clear the search
              </Link>
            ) : (
              <a href="/admin" className="text-primary-700 underline">
                /admin
              </a>
            )}
            .
          </p>
        )}
      </div>
    </div>
  );
}
