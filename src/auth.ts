import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Magic-link auth via Resend — no passwords to manage, and Ella's admin
// role is just data (see ADMIN_EMAILS below), not a separate credential.
//
// Sign-in flow when the user already has a User row from /join or
// /sitters/apply (created PENDING, no account yet): the Prisma adapter
// looks up by email and attaches the new Account to that existing User
// instead of creating a duplicate — so applying and then signing in later
// with the same email lands on the same account.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin/check-email",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    // Runs on every successful sign-in (new or returning user), before the
    // session is issued — the single place that guarantees anyone in
    // ADMIN_EMAILS is ADMIN/APPROVED, whether this is their first-ever
    // sign-in or they already had a PENDING row from /join.
    async signIn({ user }) {
      const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (
        user.email &&
        user.id &&
        adminEmails.includes(user.email.toLowerCase()) &&
        (user.role !== "ADMIN" || user.approvalStatus !== "APPROVED")
      ) {
        // updateMany, not update: on the first signIn callback invocation
        // (when the magic link is requested), Auth.js passes a user object
        // that hasn't been persisted to the DB yet for brand-new emails —
        // update() would throw "record not found" and block the email from
        // ever being sent. updateMany() no-ops instead; the real promotion
        // happens on the second invocation, once the link is clicked and
        // the user row actually exists.
        await prisma.user.updateMany({
          where: { id: user.id },
          data: {
            role: "ADMIN",
            approvalStatus: "APPROVED",
            approvedAt: new Date(),
          },
        });
      }

      return true;
    },
    async session({ session, user }) {
      // Re-read role/approvalStatus fresh rather than trusting the `user`
      // object passed in, since the signIn callback above may have just
      // changed them in the same request.
      const fresh = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true, approvalStatus: true },
      });
      session.user.id = user.id;
      session.user.role = fresh?.role ?? user.role;
      session.user.approvalStatus = fresh?.approvalStatus ?? user.approvalStatus;
      return session;
    },
  },
});
