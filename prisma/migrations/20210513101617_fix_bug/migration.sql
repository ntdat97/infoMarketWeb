/*
  Warnings:

  - Changed the type of `provider` on the `AvailableDepositMethod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WithdrawProvider" AS ENUM ('EWALLET', 'BANK');

-- AlterTable
ALTER TABLE "AvailableDepositMethod" DROP COLUMN "provider",
ADD COLUMN     "provider" "WithdrawProvider" NOT NULL;
