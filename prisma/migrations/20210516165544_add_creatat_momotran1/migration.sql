/*
  Warnings:

  - You are about to drop the `_MomoTransactionToUserDepositRecorder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MomoTransactionToUserDepositRecorder" DROP CONSTRAINT "_MomoTransactionToUserDepositRecorder_A_fkey";

-- DropForeignKey
ALTER TABLE "_MomoTransactionToUserDepositRecorder" DROP CONSTRAINT "_MomoTransactionToUserDepositRecorder_B_fkey";

-- DropTable
DROP TABLE "_MomoTransactionToUserDepositRecorder";
