// Minimal service worker: enables installability + web push.
// Extend with a caching strategy (e.g. Workbox) once real assets/API routes
// stabilize — kept intentionally simple for the scaffold stage.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Web Push — see src/lib/push.ts for the subscribe-side code.
// iOS Safari only delivers these after the user adds the app to their
// home screen (iOS 16.4+); there is no way around that from the SW.
self.addEventListener("push", (event) => {
  let data = { title: "Sitter Sisters", body: "You have a new update." };
  try {
    if (event.data) data = event.data.json();
  } catch {
    // fall back to default text above
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: data.url ? { url: data.url } : undefined,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
