/*
  Warnings:

  - The `verificationMessage` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ResponseMessage" AS ENUM ('LicenseInvalid', 'LicenseImageNotMatchingWithProfile', 'LicenseInvalidAgain', 'DetailsRequired');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificationMessage",
ADD COLUMN     "verificationMessage" "ResponseMessage" NOT NULL DEFAULT 'DetailsRequired';
