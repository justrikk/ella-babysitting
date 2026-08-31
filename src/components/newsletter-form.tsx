"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const result = await subscribeToNewsletter(email);
    setMessage(result.message);
    setStatus(result.ok ? "done" : "idle");
    if (result.ok) setEmail("");
  }

  if (status === "done") {
    return <p className="text-sm text-primary-200">{message}</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-primary-200 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 disabled:opacity-60"
        >
          {status === "submitting" ? "Joining…" : "Join the club"}
        </button>
      </form>
      {message && <p className="mt-2 text-xs text-accent-200">{message}</p>}
    </div>
  );
}
