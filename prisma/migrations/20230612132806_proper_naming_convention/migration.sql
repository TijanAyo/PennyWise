/*
  Warnings:

  - You are about to drop the column `bvn` on the `user` table. All the data in the column will be lost.
  - Added the required column `bank_verfication_number` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bvn`,
    ADD COLUMN `bank_verfication_number` VARCHAR(191) NOT NULL;
