-- DropForeignKey
ALTER TABLE "UserWithdrawRecorder" DROP CONSTRAINT "UserWithdrawRecorder_momoTransactionId_fkey";

-- AddForeignKey
ALTER TABLE "UserWithdrawRecorder" ADD FOREIGN KEY ("momoTransactionId") REFERENCES "MomoTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
