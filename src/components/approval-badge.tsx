import type { ApprovalStatus } from "@/lib/types";

// Replaces the earlier "VerificationBadge" (background-check based) design.
// This app is closed to known people in Bundeena / Maianbar, so the trust
// gate is Ella manually approving every account — not a background check.
// This badge needs to reflect a REAL admin action (see /admin), not just
// render green by default.

const styles: Record<ApprovalStatus, { label: string; className: string }> = {
  APPROVED: {
    label: "Approved Sitter Sister",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  PENDING: {
    label: "Awaiting approval",
    className: "bg-amber-100 text-amber-800 border-amber-300",
  },
  REJECTED: {
    label: "Not approved",
    className: "bg-red-100 text-red-800 border-red-300",
  },
};

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${s.className}`}
    >
      {status === "APPROVED" && (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {s.label}
    </span>
  );
}
