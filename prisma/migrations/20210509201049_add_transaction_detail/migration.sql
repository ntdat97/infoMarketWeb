/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Media` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('REJECT', 'PAYING', 'PAID');

-- CreateEnum
CREATE TYPE "PaidState" AS ENUM ('UNPAID', 'PAYING', 'PAID');

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "isPaid",
ADD COLUMN     "paidState" "PaidState" NOT NULL DEFAULT E'UNPAID';

-- CreateTable
CREATE TABLE "MomoTransaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "senderPhone" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "clientTime" TIMESTAMP(3) NOT NULL,
    "ackTime" TIMESTAMP(3) NOT NULL,
    "statusCode" TEXT NOT NULL,
    "statusText" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDetail" (
    "id" TEXT NOT NULL,
    "momoTransactionId" TEXT NOT NULL,
    "projectTransactionId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTransaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sumAmount" DOUBLE PRECISION NOT NULL,
    "identifyCode" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userPaymentMethodId" TEXT NOT NULL,
    "transactionState" "TransactionState" NOT NULL DEFAULT E'PAYING',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaBatchTransaction" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "projectTransactionID" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MomoTransaction.transactionId_unique" ON "MomoTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD FOREIGN KEY ("momoTransactionId") REFERENCES "MomoTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD FOREIGN KEY ("projectTransactionId") REFERENCES "ProjectTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransaction" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransaction" ADD FOREIGN KEY ("userPaymentMethodId") REFERENCES "UserPaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaBatchTransaction" ADD FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaBatchTransaction" ADD FOREIGN KEY ("projectTransactionID") REFERENCES "ProjectTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
