/*
  Warnings:

  - You are about to drop the column `userId` on the `UserDepositRecorder` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserWithdrawRecorder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserDepositRecorder" DROP CONSTRAINT "UserDepositRecorder_userId_fkey";

-- AlterTable
ALTER TABLE "UserDepositRecorder" DROP COLUMN "userId",
ADD COLUMN     "momoTransactionId" TEXT;

-- AlterTable
ALTER TABLE "UserWithdrawRecorder" ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "momoTransactionId" TEXT;

-- CreateTable
CREATE TABLE "_MomoTransactionToUserDepositRecorder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MomoTransactionToUserWithdrawRecorder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MomoTransactionToUserDepositRecorder_AB_unique" ON "_MomoTransactionToUserDepositRecorder"("A", "B");

-- CreateIndex
CREATE INDEX "_MomoTransactionToUserDepositRecorder_B_index" ON "_MomoTransactionToUserDepositRecorder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MomoTransactionToUserWithdrawRecorder_AB_unique" ON "_MomoTransactionToUserWithdrawRecorder"("A", "B");

-- CreateIndex
CREATE INDEX "_MomoTransactionToUserWithdrawRecorder_B_index" ON "_MomoTransactionToUserWithdrawRecorder"("B");

-- AddForeignKey
ALTER TABLE "_MomoTransactionToUserDepositRecorder" ADD FOREIGN KEY ("A") REFERENCES "MomoTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MomoTransactionToUserDepositRecorder" ADD FOREIGN KEY ("B") REFERENCES "UserDepositRecorder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MomoTransactionToUserWithdrawRecorder" ADD FOREIGN KEY ("A") REFERENCES "MomoTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MomoTransactionToUserWithdrawRecorder" ADD FOREIGN KEY ("B") REFERENCES "UserWithdrawRecorder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepositRecorder" ADD FOREIGN KEY ("momoTransactionId") REFERENCES "MomoTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWithdrawRecorder" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWithdrawRecorder" ADD FOREIGN KEY ("momoTransactionId") REFERENCES "MomoTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
