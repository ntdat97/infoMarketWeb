/*
  Warnings:

  - The `phone` column on the `UserPaymentMethod` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stk` column on the `UserPaymentMethod` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserPaymentMethod" DROP COLUMN "phone",
ADD COLUMN     "phone" INTEGER,
DROP COLUMN "stk",
ADD COLUMN     "stk" INTEGER;
