/*
  Warnings:

  - You are about to alter the column `status` on the `shippings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `shippings` MODIFY `status` ENUM('COMPLETED', 'NOT_COMPLETED') NOT NULL DEFAULT 'NOT_COMPLETED';
