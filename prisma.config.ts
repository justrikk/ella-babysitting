// Prisma 7 moved CLI connection config out of schema.prisma. This file is
// read by `prisma migrate` / `prisma studio` etc. — it intentionally points
// at DIRECT_URL (the unpooled connection), not DATABASE_URL (the pooled
// one the app uses at runtime, set in src/lib/prisma.ts), because
// PgBouncer/Supavisor's transaction-pooled connection doesn't support the
// prepared statements Prisma Migrate needs for schema changes.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
