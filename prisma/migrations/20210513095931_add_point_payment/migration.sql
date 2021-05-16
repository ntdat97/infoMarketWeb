/*
  Warnings:

  - You are about to drop the column `projectTransactionID` on the `MediaBatchTransaction` table. All the data in the column will be lost.
  - You are about to drop the `AlaivablePaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectPaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionDetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectTransactionRecorderID` to the `MediaBatchTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WithdrawPointState" AS ENUM ('REJECT', 'PAYING', 'PAID');

-- DropForeignKey
ALTER TABLE "ProjectPaymentMethod" DROP CONSTRAINT "ProjectPaymentMethod_ProjectPaymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPaymentMethod" DROP CONSTRAINT "ProjectPaymentMethod_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTransaction" DROP CONSTRAINT "ProjectTransaction_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTransaction" DROP CONSTRAINT "ProjectTransaction_userPaymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionDetail" DROP CONSTRAINT "TransactionDetail_momoTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionDetail" DROP CONSTRAINT "TransactionDetail_projectTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "MediaBatchTransaction" DROP CONSTRAINT "MediaBatchTransaction_projectTransactionID_fkey";

-- DropForeignKey
ALTER TABLE "UserPaymentMethod" DROP CONSTRAINT "UserPaymentMethod_userPaymentMethodId_fkey";

-- AlterTable
ALTER TABLE "MediaBatchTransaction" DROP COLUMN "projectTransactionID",
ADD COLUMN     "projectTransactionRecorderID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "point" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "AlaivablePaymentMethod";

-- DropTable
DROP TABLE "ProjectPaymentMethod";

-- DropTable
DROP TABLE "ProjectTransaction";

-- DropTable
DROP TABLE "TransactionDetail";

-- DropEnum
DROP TYPE "TransactionState";

-- CreateTable
CREATE TABLE "AvailableDepositMethod" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "ewalletProvider" TEXT,
    "bankProvider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "phone" TEXT,
    "stk" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailablePaymentMethod" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "ewalletProvider" TEXT,
    "bankProvider" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDepositRecorder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "availableDepositMethodId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWithdrawRecorder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "withdrawPointState" "WithdrawPointState" NOT NULL DEFAULT E'PAYING',
    "userPaymentMethodId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTransactionRecorder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderUserId" TEXT NOT NULL,
    "receiverUserId" TEXT NOT NULL,
    "sumAmount" DOUBLE PRECISION NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserDepositRecorder" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepositRecorder" ADD FOREIGN KEY ("availableDepositMethodId") REFERENCES "AvailableDepositMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWithdrawRecorder" ADD FOREIGN KEY ("userPaymentMethodId") REFERENCES "UserPaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransactionRecorder" ADD FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransactionRecorder" ADD FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransactionRecorder" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaBatchTransaction" ADD FOREIGN KEY ("projectTransactionRecorderID") REFERENCES "ProjectTransactionRecorder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPaymentMethod" ADD FOREIGN KEY ("userPaymentMethodId") REFERENCES "AvailablePaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
