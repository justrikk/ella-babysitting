"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ApprovalStatus, Role } from "@prisma/client";
import { decideApproval } from "@/lib/actions";
import { Avatar } from "@/components/avatar";

type QueueUser = {
  id: string;
  name: string;
  email: string;
  role: Role; // query is filtered to PARENT/SITTER, but Prisma's type is the full enum
  suburb: string | null;
  approvalStatus: ApprovalStatus;
  referralNote: string | null;
  sitterProfile: {
    dateOfBirth: Date | null;
    wwccConfirmed: boolean;
    wwccExpiry: Date | null;
    firstAidCertified: boolean;
  } | null;
};

const WWCC_REQUIRED_AGE_YEARS = 18;

function ageInYears(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const monthDay = now.getMonth() - dob.getMonth() || now.getDate() - dob.getDate();
  if (monthDay < 0) age--;
  return age;
}

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
        <h2 className="text-sm font-medium text-warm-900">
          Pending ({pending.length})
        </h2>
        <div className="mt-2 space-y-2">
          {pending.length === 0 && (
            <p className="text-sm text-warm-400">
              Nothing waiting on you right now.
            </p>
          )}
          {pending.map((u) => {
            const busy = isPending && actingOn === u.id;
            return (
              <div
                key={u.id}
                className="rounded-xl border border-warm-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar name={u.name} />
                    <div>
                      <p className="font-medium text-warm-900">
                        {u.name}{" "}
                        <span className="ml-1 rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-600">
                          {u.role === "SITTER" ? "Sitter" : "Parent"}
                        </span>
                      </p>
                      <p className="text-sm text-warm-500">
                        {u.email}
                        {u.suburb ? ` · ${u.suburb}` : ""}
                      </p>
                      {u.referralNote && (
                        <p className="mt-1 text-sm text-warm-600">
                          {u.referralNote}
                        </p>
                      )}
                      {u.role === "SITTER" && u.sitterProfile && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(() => {
                            const dob = u.sitterProfile.dateOfBirth;
                            const age = dob ? ageInYears(new Date(dob)) : null;
                            const wwccRequired = age !== null && age >= WWCC_REQUIRED_AGE_YEARS;
                            if (!wwccRequired) return null;
                            return u.sitterProfile.wwccConfirmed ? (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                WWCC confirmed
                                {u.sitterProfile.wwccExpiry &&
                                  ` (exp. ${new Date(u.sitterProfile.wwccExpiry).toLocaleDateString()})`}
                              </span>
                            ) : (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
                                WWCC not confirmed — required, 18+
                              </span>
                            );
                          })()}
                          {u.sitterProfile.firstAidCertified && (
                            <span className="rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-700">
                              First Aid certified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => decide(u.id, "APPROVED")}
                      disabled={busy}
                      className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => decide(u.id, "REJECTED")}
                      disabled={busy}
                      className="rounded-full border border-warm-300 px-3 py-1.5 text-xs font-medium text-warm-700 hover:bg-warm-50 disabled:opacity-50"
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
          <h2 className="text-sm font-medium text-warm-900">
            Recently decided
          </h2>
          <div className="mt-2 space-y-2">
            {decided.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-xl border border-warm-200 bg-warm-50 p-3 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={u.name} className="h-7 w-7 text-[11px]" />
                  <span className="text-warm-700">
                    {u.name} · {u.role === "SITTER" ? "Sitter" : "Parent"}
                  </span>
                </div>
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
