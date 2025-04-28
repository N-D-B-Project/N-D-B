import * as dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({
	path: `.env.${process.env.NODE_ENV}`,
});

export default defineConfig({
	earlyAccess: true,
	schema: "./Database/prisma/schema.prisma",
});
