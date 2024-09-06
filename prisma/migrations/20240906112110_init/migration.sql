/*
  Warnings:

  - The values [LicenseInvalidAgain] on the enum `ResponseMessage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResponseMessage_new" AS ENUM ('LicenseInvalid', 'LicenseImageNotMatchingWithProfile', 'UnderGoingVerification', 'DetailsRequired');
ALTER TABLE "User" ALTER COLUMN "verificationMessage" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "verificationMessage" TYPE "ResponseMessage_new" USING ("verificationMessage"::text::"ResponseMessage_new");
ALTER TYPE "ResponseMessage" RENAME TO "ResponseMessage_old";
ALTER TYPE "ResponseMessage_new" RENAME TO "ResponseMessage";
DROP TYPE "ResponseMessage_old";
ALTER TABLE "User" ALTER COLUMN "verificationMessage" SET DEFAULT 'DetailsRequired';
COMMIT;
