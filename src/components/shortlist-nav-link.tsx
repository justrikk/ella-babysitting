"use client";

import Link from "next/link";
import { useShortlist } from "@/lib/use-shortlist";

export function ShortlistNavLink({ className }: { className?: string }) {
  const { ids, hydrated } = useShortlist();

  return (
    <Link href="/shortlist" className={className}>
      Shortlist
      {hydrated && ids.length > 0 && (
        <span className="ml-1 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700">
          {ids.length}
        </span>
      )}
    </Link>
  );
}
