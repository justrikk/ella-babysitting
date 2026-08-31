"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SitterProfile } from "@/lib/types";
import { useShortlist } from "@/lib/use-shortlist";
import { getShortlistedSitters } from "@/lib/actions";
import { formatCurrency } from "@/lib/mock-data";
import { summarizeAvailability } from "@/lib/format-availability";
import { ApprovalBadge } from "@/components/approval-badge";
import { Avatar } from "@/components/avatar";
import { ShortlistButton } from "@/components/shortlist-button";

export default function ShortlistPage() {
  const { ids, hydrated } = useShortlist();
  const [sitters, setSitters] = useState<SitterProfile[] | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    getShortlistedSitters(ids).then((result) => {
      if (!cancelled) setSitters(result);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, ids]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">Your shortlist</h1>
      <p className="mt-1 text-sm text-warm-600">
        Compare availability, experience, rates, and qualifications side by
        side.
      </p>

      {sitters === null ? (
        <p className="mt-10 text-center text-sm text-warm-500">Loading…</p>
      ) : sitters.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-warm-300 bg-warm-50 p-6 text-center text-sm text-warm-500">
          You haven&apos;t saved any sitters yet — tap the heart on a
          sitter&apos;s card or profile to add them here.{" "}
          <Link href="/sitters" className="text-primary-700 underline">
            Browse sitters
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sitters.map((sitter) => (
            <div
              key={sitter.id}
              className="rounded-xl border border-warm-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={sitter.name} imageUrl={sitter.avatarUrl} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-warm-900">
                      {sitter.name}
                    </p>
                    {sitter.suburb && (
                      <p className="truncate text-sm text-warm-500">
                        {sitter.suburb}
                      </p>
                    )}
                  </div>
                </div>
                <ShortlistButton
                  sitterId={sitter.id}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-50 text-primary-600 transition hover:bg-primary-100"
                />
              </div>

              <div className="mt-2">
                <ApprovalBadge status={sitter.approvalStatus} />
              </div>

              <dl className="mt-4 text-sm">
                <div className="flex items-center justify-between border-t border-warm-100 py-2">
                  <dt className="text-warm-500">Rate</dt>
                  <dd className="font-medium text-warm-900">
                    {formatCurrency(sitter.hourlyRateCents)}/hr
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-warm-100 py-2">
                  <dt className="text-warm-500">Experience</dt>
                  <dd className="font-medium text-warm-900">
                    {sitter.yearsExperience} yrs
                  </dd>
                </div>
                {sitter.bestWithAgeMin !== undefined &&
                  sitter.bestWithAgeMax !== undefined && (
                    <div className="flex items-center justify-between border-t border-warm-100 py-2">
                      <dt className="text-warm-500">Best with</dt>
                      <dd className="font-medium text-warm-900">
                        Ages {sitter.bestWithAgeMin}–{sitter.bestWithAgeMax}
                      </dd>
                    </div>
                  )}
                <div className="flex items-center justify-between border-t border-warm-100 py-2">
                  <dt className="shrink-0 text-warm-500">Available</dt>
                  <dd className="text-right font-medium text-warm-900">
                    {summarizeAvailability(sitter.availability)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-warm-100 py-2">
                  <dt className="text-warm-500">WWCC</dt>
                  <dd className="font-medium text-warm-900">
                    {sitter.wwccConfirmed ? "✓" : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-warm-100 py-2">
                  <dt className="text-warm-500">First Aid</dt>
                  <dd className="font-medium text-warm-900">
                    {sitter.firstAidCertified ? "✓" : "—"}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/sitters/${sitter.id}`}
                className="mt-4 block rounded-full bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-700"
              >
                View full profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
