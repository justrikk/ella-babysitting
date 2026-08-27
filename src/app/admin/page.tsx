import { prisma } from "@/lib/prisma";
import { ApprovalQueue } from "@/components/approval-queue";

// Locked to ADMIN-role sessions by src/proxy.ts — anyone else is redirected
// to /signin before this ever renders.
export default async function AdminPage() {
  const users = await prisma.user.findMany({
    where: { role: { in: ["PARENT", "SITTER"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      suburb: true,
      approvalStatus: true,
      referralNote: true,
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Approval queue
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Every new parent and sitter waits here until you approve them.
        Nothing in the app lets an unapproved account book or message.
      </p>

      <div className="mt-6">
        <ApprovalQueue initialUsers={users} />
      </div>
    </div>
  );
}
