import Link from "next/link";
import type { SitterProfile } from "@/lib/types";
import { ApprovalBadge } from "@/components/approval-badge";
import { formatCurrency } from "@/lib/mock-data";

export function SitterCard({ sitter }: { sitter: SitterProfile }) {
  return (
    <Link
      href={`/sitters/${sitter.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-neutral-900">{sitter.name}</p>
          <p className="text-sm text-neutral-500">
            {sitter.suburb ? `${sitter.suburb} · ` : ""}
            {sitter.yearsExperience} yrs experience
          </p>
        </div>
        <ApprovalBadge status={sitter.approvalStatus} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{sitter.bio}</p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-900">
          {formatCurrency(sitter.hourlyRateCents)}/hr
        </span>
        {sitter.reviewCount > 0 ? (
          <span className="text-neutral-500">
            ★ {sitter.avgRating.toFixed(1)} ({sitter.reviewCount})
          </span>
        ) : (
          <span className="text-neutral-400">No reviews yet</span>
        )}
      </div>
    </Link>
  );
}
