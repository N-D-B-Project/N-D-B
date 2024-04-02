-- AlterTable
ALTER TABLE "Guild" ALTER COLUMN "databaseVersion" SET DEFAULT 'API';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "databaseVersion" SET DEFAULT 'API';

-- CreateTable
CREATE TABLE "APIUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "APIUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "APIUser_userId_key" ON "APIUser"("userId");

-- AddForeignKey
ALTER TABLE "APIUser" ADD CONSTRAINT "APIUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
