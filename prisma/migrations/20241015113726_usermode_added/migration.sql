-- CreateEnum
CREATE TYPE "AccountMode" AS ENUM ('BUYER', 'SELLER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountMode" "AccountMode" NOT NULL DEFAULT 'BUYER';
