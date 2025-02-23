import { PrismaClient } from "@/__generated__/prisma";

export const extendedPrismaClient = new PrismaClient().$extends({});

export type ExtendedPrismaClient = typeof extendedPrismaClient;
