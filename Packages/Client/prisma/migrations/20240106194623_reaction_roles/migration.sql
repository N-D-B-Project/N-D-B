-- AlterTable
ALTER TABLE "GuildSettings" ADD COLUMN     "ReactionDM" BOOLEAN NOT NULL DEFAULT true;

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

-- AddForeignKey
ALTER TABLE "GuildReactionRoles" ADD CONSTRAINT "GuildReactionRoles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
