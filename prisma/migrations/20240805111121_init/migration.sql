-- AlterTable
ALTER TABLE `bankaccounts` MODIFY `accountNo` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `creditcards` MODIFY `cardNumber` BIGINT NOT NULL,
    MODIFY `cvv` BIGINT NOT NULL;
