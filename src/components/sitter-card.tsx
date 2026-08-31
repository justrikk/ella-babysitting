import Link from "next/link";
import type { SitterProfile } from "@/lib/types";
import { ApprovalBadge } from "@/components/approval-badge";
import { Avatar } from "@/components/avatar";
import { ShortlistButton } from "@/components/shortlist-button";
import { formatCurrency } from "@/lib/mock-data";
import { summarizeAvailability } from "@/lib/format-availability";

// Whole card used to be a single <Link> — a <button> (the shortlist heart)
// can't validly nest inside an <a>, so this uses the "stretched link"
// pattern instead: an absolutely-positioned Link behind the content handles
// navigation, and interactive children sit above it with a higher z-index.
export function SitterCard({ sitter }: { sitter: SitterProfile }) {
  const hasAgeRange =
    sitter.bestWithAgeMin !== undefined && sitter.bestWithAgeMax !== undefined;

  return (
    <div className="relative rounded-xl border border-warm-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/5">
      <Link
        href={`/sitters/${sitter.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`View ${sitter.name}`}
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={sitter.name} imageUrl={sitter.avatarUrl} />
          <div className="min-w-0">
            <p className="truncate font-medium text-warm-900">{sitter.name}</p>
            {sitter.suburb && (
              <p className="truncate text-sm text-warm-500">{sitter.suburb}</p>
            )}
          </div>
        </div>
        <ShortlistButton
          sitterId={sitter.id}
          className="relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-50 text-primary-600 transition hover:bg-primary-100"
        />
      </div>

      <div className="relative z-10 mt-2">
        <ApprovalBadge status={sitter.approvalStatus} />
      </div>

      <p className="relative z-10 mt-2 line-clamp-2 text-sm text-warm-600">
        {sitter.bio}
      </p>

      <div className="relative z-10 mt-3 space-y-1 text-xs text-warm-500">
        {hasAgeRange && (
          <p>
            <span className="font-medium text-warm-700">Best with:</span>{" "}
            Ages {sitter.bestWithAgeMin}–{sitter.bestWithAgeMax}
          </p>
        )}
        <p>
          <span className="font-medium text-warm-700">Available:</span>{" "}
          {summarizeAvailability(sitter.availability)}
        </p>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between text-sm">
        <span className="font-medium text-warm-900">
          From {formatCurrency(sitter.hourlyRateCents)}/hr
        </span>
        {sitter.reviewCount > 0 ? (
          <span className="text-warm-500">
            <span className="text-accent-500">★</span>{" "}
            {sitter.avgRating.toFixed(1)} ({sitter.reviewCount})
          </span>
        ) : (
          <span className="text-warm-400">No reviews yet</span>
        )}
      </div>

      <p className="relative z-10 mt-3 border-t border-warm-100 pt-3 text-sm font-medium text-primary-700">
        View {sitter.name} &rarr;
      </p>
    </div>
  );
}
