/*
  Warnings:

  - You are about to drop the column `likedBy` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_likedBy_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `likedBy`;
