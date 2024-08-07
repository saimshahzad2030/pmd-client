/*
  Warnings:

  - You are about to alter the column `metalType` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `metalType` ENUM('gold', 'silver', 'platinum', 'palladium', 'rare') NOT NULL DEFAULT 'gold';
