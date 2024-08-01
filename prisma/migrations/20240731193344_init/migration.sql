-- DropIndex
DROP INDEX `User_token_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `token` TEXT NULL;
