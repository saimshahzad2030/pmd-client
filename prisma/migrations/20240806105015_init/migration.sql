/*
  Warnings:

  - You are about to alter the column `metalAuthenticaitonService` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `metalAuthenticaitonService` BOOLEAN NOT NULL DEFAULT false;
