import Link from "next/link";
import type { SitterProfile } from "@/lib/types";
import { ApprovalBadge } from "@/components/approval-badge";
import { Avatar } from "@/components/avatar";
import { formatCurrency } from "@/lib/mock-data";

export function SitterCard({ sitter }: { sitter: SitterProfile }) {
  return (
    <Link
      href={`/sitters/${sitter.id}`}
      className="block rounded-xl border border-warm-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={sitter.name} />
          <div>
            <p className="font-medium text-warm-900">{sitter.name}</p>
            <p className="text-sm text-warm-500">
              {sitter.suburb ? `${sitter.suburb} · ` : ""}
              {sitter.yearsExperience} yrs experience
            </p>
          </div>
        </div>
        <ApprovalBadge status={sitter.approvalStatus} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-warm-600">{sitter.bio}</p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-medium text-warm-900">
          {formatCurrency(sitter.hourlyRateCents)}/hr
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
    </Link>
  );
}
