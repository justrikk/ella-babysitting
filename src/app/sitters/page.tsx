import Link from "next/link";
import { getAllSitters } from "@/lib/sitters";
import { SitterCard } from "@/components/sitter-card";

const SUBURBS = ["Bundeena", "Maianbar"] as const;

const SORTS = {
  newest: { label: "Newest", fn: () => 0 },
  rate_asc: {
    label: "Lowest rate",
    fn: (a: Awaited<ReturnType<typeof getAllSitters>>[number], b: typeof a) =>
      a.hourlyRateCents - b.hourlyRateCents,
  },
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

function buildHref(params: { suburb?: string; sort?: string }) {
  const qs = new URLSearchParams();
  if (params.suburb) qs.set("suburb", params.suburb);
  if (params.sort && params.sort !== "newest") qs.set("sort", params.sort);
  const s = qs.toString();
  return s ? `/sitters?${s}` : "/sitters";
}

export default async function SittersPage({
  searchParams,
}: {
  searchParams: Promise<{ suburb?: string; sort?: string }>;
}) {
  const { suburb, sort } = await searchParams;
  const sortKey: SortKey = sort && sort in SORTS ? (sort as SortKey) : "newest";

  const allSitters = await getAllSitters();
  const filtered = suburb
    ? allSitters.filter((s) => s.suburb === suburb)
    : allSitters;
  const sitters = [...filtered].sort(SORTS[sortKey].fn);

  const pillCls = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
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
            Anyone can browse — sitters marked &quot;Approved by Ella&quot;
            can accept bookings.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium tracking-wide text-warm-500 uppercase">
            Suburb
          </span>
          <Link href={buildHref({ sort })} className={pillCls(!suburb)}>
            All
          </Link>
          {SUBURBS.map((s) => (
            <Link key={s} href={buildHref({ suburb: s, sort })} className={pillCls(suburb === s)}>
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
              href={buildHref({ suburb, sort: key })}
              className={pillCls(sortKey === key)}
            >
              {SORTS[key].label}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sitters.map((sitter) => (
            <SitterCard key={sitter.id} sitter={sitter} />
          ))}
        </div>

        {sitters.length === 0 && allSitters.length > 0 && (
          <p className="mt-10 text-center text-sm text-warm-500">
            No sitters in {suburb} right now —{" "}
            <Link href={buildHref({ sort })} className="text-primary-700 underline">
              browse all suburbs
            </Link>
            .
          </p>
        )}
        {allSitters.length === 0 && (
          <p className="mt-10 text-center text-sm text-warm-500">
            No sitters yet — the first application will show up here once
            Ella approves it in{" "}
            <a href="/admin" className="text-primary-700 underline">
              /admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
