/*
  Warnings:

  - Added the required column `userId` to the `ShippingNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shippingnotifications` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ShippingNotifications` ADD CONSTRAINT `ShippingNotifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
