"use client";

import { useCallback, useEffect, useState } from "react";

const SHORTLIST_KEY = "sitterSisters:shortlist";
const CHANGE_EVENT = "shortlist:change";

// First localStorage usage in this codebase — no existing pattern to
// follow. Browser-local by design (no sign-in required to shortlist,
// matching the app's "anyone can browse" philosophy); doesn't sync across
// devices. try/catch guards against localStorage throwing (private
// browsing, disabled storage, etc.) — a failed read/write just no-ops
// rather than breaking the page.

function readShortlist(): string[] {
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeShortlist(ids: string[]) {
  try {
    window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
    // The native "storage" event only fires in OTHER tabs, not this one —
    // dispatch our own so every SitterCard/ShortlistButton on this page
    // re-syncs immediately.
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // Storage unavailable — shortlisting silently becomes a no-op rather
    // than breaking the page.
  }
}

export function useShortlist() {
  // Starts empty (SSR-safe — never read localStorage during render) and
  // syncs to the real value on mount.
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readShortlist());

    const resync = () => setIds(readShortlist());
    window.addEventListener(CHANGE_EVENT, resync);
    window.addEventListener("storage", resync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, resync);
      window.removeEventListener("storage", resync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = readShortlist();
    const next = current.includes(id)
      ? current.filter((existing) => existing !== id)
      : [...current, id];
    writeShortlist(next);
    setIds(next);
  }, []);

  const isShortlisted = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, isShortlisted, toggle };
}
