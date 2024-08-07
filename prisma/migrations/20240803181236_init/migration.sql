/*
  Warnings:

  - Added the required column `highlight` to the `Highlights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specification` to the `Specifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `highlights` ADD COLUMN `highlight` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `images` ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `specifications` ADD COLUMN `specification` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `videos` ADD COLUMN `video` VARCHAR(191) NOT NULL;
