"use client";

import { useShortlist } from "@/lib/use-shortlist";
import { IconHeart, IconHeartFilled } from "@/components/icons";

export function ShortlistButton({
  sitterId,
  className,
}: {
  sitterId: string;
  className?: string;
}) {
  const { isShortlisted, toggle } = useShortlist();
  const saved = isShortlisted(sitterId);

  return (
    <button
      type="button"
      onClick={(e) => {
        // Cards render this over/inside a stretched Link — stop the click
        // from also triggering navigation.
        e.preventDefault();
        e.stopPropagation();
        toggle(sitterId);
      }}
      aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
      aria-pressed={saved}
      className={
        className ??
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-sm transition hover:bg-white"
      }
    >
      {saved ? (
        <IconHeartFilled className="h-4 w-4" />
      ) : (
        <IconHeart className="h-4 w-4" />
      )}
    </button>
  );
}
