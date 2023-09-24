/*
  Warnings:

  - You are about to drop the `GuildChannels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildReactionRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBagGifts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGuilds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserNDCash` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuildChannels" DROP CONSTRAINT "GuildChannels_guildId_fkey";

-- DropForeignKey
ALTER TABLE "GuildReactionRoles" DROP CONSTRAINT "GuildReactionRoles_guildId_fkey";

-- DropForeignKey
ALTER TABLE "GuildRoles" DROP CONSTRAINT "GuildRoles_guildId_fkey";

-- DropForeignKey
ALTER TABLE "UserBag" DROP CONSTRAINT "UserBag_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBagGifts" DROP CONSTRAINT "UserBagGifts_BagId_fkey";

-- DropForeignKey
ALTER TABLE "UserGuilds" DROP CONSTRAINT "UserGuilds_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserNDCash" DROP CONSTRAINT "UserNDCash_userId_fkey";

-- DropTable
DROP TABLE "GuildChannels";

-- DropTable
DROP TABLE "GuildReactionRoles";

-- DropTable
DROP TABLE "GuildRoles";

-- DropTable
DROP TABLE "UserBag";

-- DropTable
DROP TABLE "UserBagGifts";

-- DropTable
DROP TABLE "UserGuilds";

-- DropTable
DROP TABLE "UserNDCash";

-- DropEnum
DROP TYPE "GiftsRarity";

-- DropEnum
DROP TYPE "NDCashJobs";
