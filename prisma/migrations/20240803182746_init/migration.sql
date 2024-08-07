/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bankaccounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `creditcards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `digitalwallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `highlights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productreviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shippingnotifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shippings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userproduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `videos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `websitereviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `bankaccounts` DROP FOREIGN KEY `BankAccounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `creditcards` DROP FOREIGN KEY `CreditCards_userId_fkey`;

-- DropForeignKey
ALTER TABLE `digitalwallets` DROP FOREIGN KEY `DigitalWallets_userId_fkey`;

-- DropForeignKey
ALTER TABLE `highlights` DROP FOREIGN KEY `Highlights_productId_fkey`;

-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `Images_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_recieverId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `shippingnotifications` DROP FOREIGN KEY `ShippingNotifications_shippingId_fkey`;

-- DropForeignKey
ALTER TABLE `shippings` DROP FOREIGN KEY `Shippings_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `specifications` DROP FOREIGN KEY `Specifications_productId_fkey`;

-- DropForeignKey
ALTER TABLE `userproduct` DROP FOREIGN KEY `UserProduct_userId_fkey`;

-- DropForeignKey
ALTER TABLE `videos` DROP FOREIGN KEY `Videos_productId_fkey`;

-- DropTable
DROP TABLE `address`;

-- DropTable
DROP TABLE `bankaccounts`;

-- DropTable
DROP TABLE `cart`;

-- DropTable
DROP TABLE `creditcards`;

-- DropTable
DROP TABLE `digitalwallets`;

-- DropTable
DROP TABLE `highlights`;

-- DropTable
DROP TABLE `images`;

-- DropTable
DROP TABLE `order`;

-- DropTable
DROP TABLE `otp`;

-- DropTable
DROP TABLE `productreviews`;

-- DropTable
DROP TABLE `products`;

-- DropTable
DROP TABLE `shippingnotifications`;

-- DropTable
DROP TABLE `shippings`;

-- DropTable
DROP TABLE `specifications`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userproduct`;

-- DropTable
DROP TABLE `videos`;

-- DropTable
DROP TABLE `websitereviews`;
