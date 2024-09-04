/*
  Warnings:

  - A unique constraint covering the columns `[plaidAccessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plaidAccessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_plaidAccessToken_key" ON "User"("plaidAccessToken");
