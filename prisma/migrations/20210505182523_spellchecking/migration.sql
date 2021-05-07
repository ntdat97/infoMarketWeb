/*
  Warnings:

  - You are about to drop the column `bankPorvider` on the `AlaivablePaymentMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlaivablePaymentMethod" DROP COLUMN "bankPorvider",
ADD COLUMN     "bankProvider" TEXT;
