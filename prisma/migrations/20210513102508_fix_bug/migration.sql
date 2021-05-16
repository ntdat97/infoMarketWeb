/*
  Warnings:

  - Changed the type of `provider` on the `AvailablePaymentMethod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AvailablePaymentMethod" DROP COLUMN "provider",
ADD COLUMN     "provider" "WithdrawProvider" NOT NULL;
