/*
  Warnings:

  - Added the required column `bank_account` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `bank_account` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank_name` VARCHAR(191) NOT NULL;
