-- AlterTable
ALTER TABLE "Guild" ALTER COLUMN "databaseVersion" SET DEFAULT 'Necord-Lavalink';

-- AlterTable
ALTER TABLE "GuildSettings" ADD COLUMN     "Premium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "databaseVersion" TEXT NOT NULL DEFAULT 'Necord-Lavalink';

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "Premium" BOOLEAN NOT NULL DEFAULT false;
