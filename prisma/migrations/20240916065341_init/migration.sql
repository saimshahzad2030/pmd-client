/*
  Warnings:

  - You are about to drop the column `licenseImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationMessage` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plaidIdVerificationAccessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "licenseImage",
DROP COLUMN "verificationMessage",
ADD COLUMN     "plaidIdVerificationAccessToken" TEXT;

-- DropEnum
DROP TYPE "ResponseMessage";

-- CreateIndex
CREATE UNIQUE INDEX "User_plaidIdVerificationAccessToken_key" ON "User"("plaidIdVerificationAccessToken");
