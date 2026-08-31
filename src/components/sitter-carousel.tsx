"use client";

import { useEffect, useState } from "react";
import type { SitterProfile } from "@/lib/types";
import { SitterCard } from "@/components/sitter-card";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

const PAGE_SIZE = 3;
const AUTO_ADVANCE_MS = 6000;

export function SitterCarousel({ sitters }: { sitters: SitterProfile[] }) {
  const pageCount = Math.ceil(sitters.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset to the first page whenever the underlying list changes (e.g. a
  // new search) so we never render past the end of a shorter list. Adjusted
  // during render (React's recommended pattern for this) rather than in an
  // effect, which would cause an extra render pass.
  const [prevSitters, setPrevSitters] = useState(sitters);
  if (sitters !== prevSitters) {
    setPrevSitters(sitters);
    setPage(0);
  }

  useEffect(() => {
    if (pageCount <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [pageCount, paused]);

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  const visible = sitters.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center gap-3">
        <div className="grid flex-1 gap-4 grid-cols-1 sm:grid-cols-3">
          {visible.map((sitter) => (
            <SitterCard key={sitter.id} sitter={sitter} />
          ))}
        </div>

        {pageCount > 1 && (
          <div className="hidden shrink-0 flex-col gap-2 sm:flex">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous sitters"
              className="rounded-full border border-warm-300 bg-white p-1.5 text-warm-600 hover:bg-warm-50"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next sitters"
              className="rounded-full border border-warm-300 bg-white p-1.5 text-warm-600 hover:bg-warm-50"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous sitters"
            className="rounded-full border border-warm-300 bg-white p-1.5 text-warm-600 hover:bg-warm-50"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next sitters"
            className="rounded-full border border-warm-300 bg-white p-1.5 text-warm-600 hover:bg-warm-50"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {pageCount > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === page ? "bg-primary-600" : "bg-warm-300 hover:bg-warm-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
