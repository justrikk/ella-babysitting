import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Next.js 16 renamed middleware.ts -> proxy.ts (same mechanism, new name —
// see node_modules/next/dist/docs/.../proxy.md). Proxy now defaults to the
// Node.js runtime, which is what lets this use a database session lookup
// (Prisma) directly instead of needing an edge-safe JWT session.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session || session.user.approvalStatus !== "APPROVED") {
      return NextResponse.redirect(new URL("/join", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
