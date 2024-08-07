/*
  Warnings:

  - Added the required column `ratings` to the `ProductReviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratings` to the `WebsiteReviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productreviews` ADD COLUMN `ratings` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `websitereviews` ADD COLUMN `ratings` INTEGER NOT NULL;
