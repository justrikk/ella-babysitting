"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { Avatar } from "@/components/avatar";

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
        {msgs.map((m) => {
          const isYou = m.senderName === "You";
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isYou ? "flex-row-reverse" : ""}`}
            >
              <Avatar name={m.senderName} className="h-7 w-7 shrink-0 text-[11px]" />
              <div className={`max-w-[75%] ${isYou ? "text-right" : ""}`}>
                <p className="text-xs text-warm-400">
                  {m.senderName} ·{" "}
                  {new Date(m.createdAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p
                  className={`mt-0.5 inline-block rounded-2xl px-3 py-2 text-sm ${
                    isYou
                      ? "rounded-br-sm bg-primary-600 text-white"
                      : "rounded-bl-sm bg-warm-100 text-warm-800"
                  }`}
                >
                  {m.body}
                </p>
              </div>
            </div>
          );
        })}
        {msgs.length === 0 && (
          <p className="text-sm text-warm-400">No messages yet.</p>
        )}
      </div>
      <div className="flex gap-2 border-t border-warm-200 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-warm-300 px-4 py-2 text-sm"
        />
        <button
          onClick={send}
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
