import { PrismaClient } from "@prisma/client";

export const extendedPrismaClient = new PrismaClient({
	log: ["info"],
}).$extends({});

export type ExtendedPrismaClient = typeof extendedPrismaClient;
