import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires a driver adapter for the runtime client. This uses
// DATABASE_URL (the pooled/PgBouncer connection) — migrations use DIRECT_URL
// instead, configured separately in prisma.config.ts.
const adapter = new PrismaPg(process.env.DATABASE_URL!);

// Standard Next.js dev-mode singleton: without this, hot-reload would spin
// up a fresh PrismaClient (and a fresh connection pool) on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
