import { PrismaClient } from "@prisma/client";
//import the prisma client from prisma. 

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
//error handling

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
//set the prisma client to 'db' in trpc routers && auth.
