"use client";

import { useEffect } from "react";

// Registers the service worker on mount. Kept as a tiny client component so
// the rest of the tree can stay server-rendered.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    }
  }, []);

  return null;
}
