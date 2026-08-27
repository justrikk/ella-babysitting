"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ApprovalStatus, Role } from "@prisma/client";
import { decideApproval } from "@/lib/actions";

type QueueUser = {
  id: string;
  name: string;
  email: string;
  role: Role; // query is filtered to PARENT/SITTER, but Prisma's type is the full enum
  suburb: string | null;
  approvalStatus: ApprovalStatus;
  referralNote: string | null;
};

export function ApprovalQueue({ initialUsers }: { initialUsers: QueueUser[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actingOn, setActingOn] = useState<string | null>(null);

  function decide(id: string, decision: "APPROVED" | "REJECTED") {
    setActingOn(id);
    startTransition(async () => {
      await decideApproval(id, decision);
      router.refresh();
      setActingOn(null);
    });
  }

  const pending = initialUsers.filter((u) => u.approvalStatus === "PENDING");
  const decided = initialUsers.filter((u) => u.approvalStatus !== "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-neutral-900">
          Pending ({pending.length})
        </h2>
        <div className="mt-2 space-y-2">
          {pending.length === 0 && (
            <p className="text-sm text-neutral-400">
              Nothing waiting on you right now.
            </p>
          )}
          {pending.map((u) => {
            const busy = isPending && actingOn === u.id;
            return (
              <div
                key={u.id}
                className="rounded-lg border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {u.name}{" "}
                      <span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                        {u.role === "SITTER" ? "Sitter" : "Parent"}
                      </span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      {u.email}
                      {u.suburb ? ` · ${u.suburb}` : ""}
                    </p>
                    {u.referralNote && (
                      <p className="mt-1 text-sm text-neutral-600">
                        {u.referralNote}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide(u.id, "APPROVED")}
                      disabled={busy}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => decide(u.id, "REJECTED")}
                      disabled={busy}
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {decided.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-neutral-900">
            Recently decided
          </h2>
          <div className="mt-2 space-y-2">
            {decided.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm"
              >
                <span className="text-neutral-700">
                  {u.name} · {u.role === "SITTER" ? "Sitter" : "Parent"}
                </span>
                <span
                  className={
                    u.approvalStatus === "APPROVED"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {u.approvalStatus === "APPROVED" ? "Approved" : "Rejected"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
