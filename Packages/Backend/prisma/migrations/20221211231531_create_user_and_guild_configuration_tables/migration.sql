-- CreateEnum
CREATE TYPE "NDCashJobs" AS ENUM ('Jobless');

-- CreateEnum
CREATE TYPE "GiftsRarity" AS ENUM ('Commun', 'Uncommun', 'Rare', 'Epic', 'Legendary');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "Prefix" VARCHAR(4) NOT NULL DEFAULT '&',
    "Language" TEXT NOT NULL DEFAULT 'en-US',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNDCash" (
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

    CONSTRAINT "UserNDCash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBagGifts" (
    "id" TEXT NOT NULL,
    "Amount" INTEGER NOT NULL DEFAULT 0,
    "Rarity" "GiftsRarity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "BagId" TEXT NOT NULL,

    CONSTRAINT "UserBagGifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGuilds" (
    "id" INTEGER NOT NULL,
    "Level" INTEGER NOT NULL DEFAULT 1,
    "XP" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "Prefix" VARCHAR(4) NOT NULL DEFAULT '&',
    "Language" TEXT NOT NULL DEFAULT 'en-US',
    "AntiSpam" BOOLEAN NOT NULL DEFAULT false,
    "DeletedMessagesLogs" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildChannels" (
    "id" TEXT NOT NULL,
    "Logs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildRoles" (
    "id" TEXT NOT NULL,
    "Default" INTEGER NOT NULL,
    "Muted" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildReactionRoles" (
    "id" TEXT NOT NULL,
    "Message" TEXT NOT NULL,
    "Channel" INTEGER NOT NULL,
    "Role" INTEGER NOT NULL,
    "Emoji" TEXT NOT NULL,
    "Option" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildReactionRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNDCash_userId_key" ON "UserNDCash"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBag_userId_key" ON "UserBag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBagGifts_BagId_key" ON "UserBagGifts"("BagId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGuilds_userId_key" ON "UserGuilds"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildSettings_guildId_key" ON "GuildSettings"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildChannels_guildId_key" ON "GuildChannels"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildRoles_guildId_key" ON "GuildRoles"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildReactionRoles_guildId_key" ON "GuildReactionRoles"("guildId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNDCash" ADD CONSTRAINT "UserNDCash_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBag" ADD CONSTRAINT "UserBag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBagGifts" ADD CONSTRAINT "UserBagGifts_BagId_fkey" FOREIGN KEY ("BagId") REFERENCES "UserBag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGuilds" ADD CONSTRAINT "UserGuilds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildSettings" ADD CONSTRAINT "GuildSettings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildChannels" ADD CONSTRAINT "GuildChannels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRoles" ADD CONSTRAINT "GuildRoles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildReactionRoles" ADD CONSTRAINT "GuildReactionRoles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
