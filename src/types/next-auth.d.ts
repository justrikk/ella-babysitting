import type { ApprovalStatus, Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      approvalStatus: ApprovalStatus;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    approvalStatus: ApprovalStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    approvalStatus: ApprovalStatus;
  }
}
