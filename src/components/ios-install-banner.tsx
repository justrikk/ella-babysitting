"use client";

import { useSyncExternalStore } from "react";
import { isIos, isInStandaloneMode } from "@/lib/push";

// iOS Safari won't deliver web push until the app is added to the home
// screen, and there's no programmatic install prompt on iOS (unlike
// Android's beforeinstallprompt). This banner is the manual workaround:
// tell iOS users explicitly how to install, ideally shown right after a
// booking action where notifications actually matter to them.
//
// Uses useSyncExternalStore (rather than useEffect + setState) since this
// is reading a static external browser API value, not subscribing to
// changes — it also naturally avoids a hydration mismatch by returning
// `false` for the server snapshot.
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return isIos() && !isInStandaloneMode();
}

function getServerSnapshot() {
  return false;
}

export function IosInstallBanner() {
  const show = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!show) return null;

  return (
    <div className="bg-violet-600 px-4 py-2 text-center text-sm text-white">
      Add this app to your Home Screen to get booking &amp; message
      notifications: tap the Share icon, then &quot;Add to Home Screen&quot;.
    </div>
  );
}
