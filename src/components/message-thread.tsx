"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";

// In-app messaging keeps parent/sitter phone numbers private. This is
// client-only state for the scaffold — a real implementation needs a
// backend (API route + DB) and ideally a push notification on new message
// (see src/lib/push.ts) so the recipient doesn't have to keep the tab open.
export function MessageThread({
  bookingId,
  initialMessages,
}: {
  bookingId: string;
  initialMessages: Message[];
}) {
  const [msgs, setMsgs] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setMsgs((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        bookingId,
        senderName: "You",
        body: draft.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  return (
    <div className="flex flex-col">
      <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-3">
        {msgs.map((m) => (
          <div key={m.id}>
            <p className="text-xs text-neutral-400">
              {m.senderName} ·{" "}
              {new Date(m.createdAt).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p className="rounded-md bg-neutral-100 px-3 py-2 text-sm text-neutral-800 inline-block">
              {m.body}
            </p>
          </div>
        ))}
        {msgs.length === 0 && (
          <p className="text-sm text-neutral-400">No messages yet.</p>
        )}
      </div>
      <div className="flex gap-2 border-t border-neutral-200 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          onClick={send}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
