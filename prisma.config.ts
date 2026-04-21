import * as dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({
	path: `.env.${process.env.NODE_ENV ?? "development"}`,
});

export default defineConfig({
	schema: "./Database/prisma/schema.prisma",
});
