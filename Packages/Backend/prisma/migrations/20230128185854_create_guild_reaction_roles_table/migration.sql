/*
  Warnings:

  - You are about to drop the `GuildLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuildLogs" DROP CONSTRAINT "GuildLogs_guildId_fkey";

-- DropTable
DROP TABLE "GuildLogs";

-- CreateTable
CREATE TABLE "GuildReactionRoles" (
    "id" TEXT NOT NULL,
    "Message" TEXT NOT NULL,
    "Channel" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "Emoji" TEXT NOT NULL,
    "Option" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildReactionRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildReactionRoles_guildId_key" ON "GuildReactionRoles"("guildId");

-- AddForeignKey
ALTER TABLE "GuildReactionRoles" ADD CONSTRAINT "GuildReactionRoles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
