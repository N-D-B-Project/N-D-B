/*
  Warnings:

  - You are about to drop the column `DeletedMessagesLogs` on the `GuildSettings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NDCashJobs" AS ENUM ('Jobless');

-- AlterTable
ALTER TABLE "GuildSettings" DROP COLUMN "DeletedMessagesLogs";

-- CreateTable
CREATE TABLE "NDCash" (
    "id" TEXT NOT NULL,
    "NDCash" INTEGER NOT NULL DEFAULT 0,
    "Job" "NDCashJobs" NOT NULL DEFAULT 'Jobless',
    "Level" INTEGER NOT NULL DEFAULT 1,
    "Worked" INTEGER NOT NULL DEFAULT 0,
    "DirtyMoney" INTEGER NOT NULL DEFAULT 0,
    "DoubleTime" BOOLEAN NOT NULL DEFAULT false,
    "Daily" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NDCash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildLogs" (
    "id" TEXT NOT NULL,
    "deletedMessages" BOOLEAN NOT NULL DEFAULT false,
    "editedMessages" BOOLEAN NOT NULL DEFAULT false,
    "avatarChanges" BOOLEAN NOT NULL DEFAULT false,
    "nicknameChanges" BOOLEAN NOT NULL DEFAULT false,
    "voiceState" BOOLEAN NOT NULL DEFAULT false,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NDCash_userId_key" ON "NDCash"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildLogs_guildId_key" ON "GuildLogs"("guildId");

-- AddForeignKey
ALTER TABLE "NDCash" ADD CONSTRAINT "NDCash_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLogs" ADD CONSTRAINT "GuildLogs_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
