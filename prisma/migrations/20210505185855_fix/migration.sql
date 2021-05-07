/*
  Warnings:

  - You are about to drop the `_UserToUserPaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `UserPaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserPaymentMethod" DROP CONSTRAINT "_UserToUserPaymentMethod_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserPaymentMethod" DROP CONSTRAINT "_UserToUserPaymentMethod_B_fkey";

-- AlterTable
ALTER TABLE "UserPaymentMethod" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_UserToUserPaymentMethod";

-- AddForeignKey
ALTER TABLE "UserPaymentMethod" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
