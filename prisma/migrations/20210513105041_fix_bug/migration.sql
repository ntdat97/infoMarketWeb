/*
  Warnings:

  - You are about to drop the column `userPaymentMethodId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userPaymentMethodId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "userPaymentMethodId";
