/*
  Warnings:

  - Added the required column `userPaymentMethodId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "userPaymentMethodId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD FOREIGN KEY ("userPaymentMethodId") REFERENCES "UserPaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
