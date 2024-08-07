-- AddForeignKey
ALTER TABLE `Favourites` ADD CONSTRAINT `Favourites_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
