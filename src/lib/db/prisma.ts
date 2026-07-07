import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

function createAdapter() {
  if (process.env.TURSO_DATABASE_URL) {
    return new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
  const fileMatch = rawUrl.match(/^file:(.+)$/);
  const dbPath = fileMatch
    ? path.resolve(process.cwd(), fileMatch[1])
    : rawUrl;

  return new PrismaLibSql({
    url: `file:${dbPath}`,
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
