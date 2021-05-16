/*
  Warnings:

  - Added the required column `userId` to the `UserDepositRecorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDepositRecorder" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserDepositRecorder" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
