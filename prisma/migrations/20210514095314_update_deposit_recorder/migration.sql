/*
  Warnings:

  - You are about to drop the `_MomoTransactionToUserWithdrawRecorder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MomoTransactionToUserWithdrawRecorder" DROP CONSTRAINT "_MomoTransactionToUserWithdrawRecorder_A_fkey";

-- DropForeignKey
ALTER TABLE "_MomoTransactionToUserWithdrawRecorder" DROP CONSTRAINT "_MomoTransactionToUserWithdrawRecorder_B_fkey";

-- DropTable
DROP TABLE "_MomoTransactionToUserWithdrawRecorder";
