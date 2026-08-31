import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

// Password auth via Credentials — Ella's admin role is just data
// (see ADMIN_EMAILS below), not a separate credential. Credentials sign-in
// requires JWT sessions (Auth.js has no Account row to hang a database
// session off for a non-OAuth, non-adapter-verified provider).
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = await verifyPassword(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          approvalStatus: user.approvalStatus,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Runs on every successful sign-in — the single place that guarantees
    // anyone in ADMIN_EMAILS is ADMIN/APPROVED. Unlike the old magic-link
    // flow, a Credentials user always already exists in the DB by the time
    // this runs (authorize() requires it), so a plain update() is safe.
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
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "ADMIN",
            approvalStatus: "APPROVED",
            approvedAt: new Date(),
          },
        });
        user.role = updated.role;
        user.approvalStatus = updated.approvalStatus;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approvalStatus = user.approvalStatus;
      } else if (token.id) {
        // Re-read on every request (not just at sign-in) so an admin
        // approval or role change takes effect immediately, matching the
        // old database-session behavior instead of waiting for a fresh
        // sign-in to pick up a stale JWT.
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, approvalStatus: true },
        });
        // User no longer exists (deleted) — kill the session instead of
        // keeping stale role/approvalStatus from the original sign-in.
        if (!fresh) return null;
        token.role = fresh.role;
        token.approvalStatus = fresh.approvalStatus;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as typeof session.user.role;
      session.user.approvalStatus =
        token.approvalStatus as typeof session.user.approvalStatus;
      return session;
    },
  },
});
