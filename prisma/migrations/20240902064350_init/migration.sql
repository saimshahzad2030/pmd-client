-- CreateEnum
CREATE TYPE "PaymentVerified" AS ENUM ('TRUE', 'FALSE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "buyerPaymentMethodVerified" "PaymentVerified" NOT NULL DEFAULT 'FALSE';
