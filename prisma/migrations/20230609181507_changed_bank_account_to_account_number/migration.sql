/*
  Warnings:

  - You are about to drop the column `bank_account` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bank_account`,
    ADD COLUMN `account_number` VARCHAR(191) NULL;
