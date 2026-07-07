import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
const fileMatch = rawUrl.match(/^file:(.+)$/);
const dbPath = fileMatch
  ? path.resolve(process.cwd(), fileMatch[1])
  : rawUrl;

const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
