/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `APIUser` table. All the data in the column will be lost.
  - You are about to drop the column `Language` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `Prefix` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `Language` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `Prefix` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "APIUser" DROP COLUMN "refreshToken";

-- AlterTable
ALTER TABLE "GuildSettings" DROP COLUMN "Language",
DROP COLUMN "Prefix";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "Language",
DROP COLUMN "Prefix";
