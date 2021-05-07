/*
  Warnings:

  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaymentMethodToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaymentMethodToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PaymentMethodToProject" DROP CONSTRAINT "_PaymentMethodToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentMethodToProject" DROP CONSTRAINT "_PaymentMethodToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentMethodToUser" DROP CONSTRAINT "_PaymentMethodToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentMethodToUser" DROP CONSTRAINT "_PaymentMethodToUser_B_fkey";

-- DropTable
DROP TABLE "PaymentMethod";

-- DropTable
DROP TABLE "_PaymentMethodToProject";

-- DropTable
DROP TABLE "_PaymentMethodToUser";

-- DropEnum
DROP TYPE "Provider";

-- CreateTable
CREATE TABLE "AlaivablePaymentMethod" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "ewalletProvider" TEXT,
    "bankPorvider" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPaymentMethod" (
    "id" TEXT NOT NULL,
    "userPaymentMethodId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "stk" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserPaymentMethod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AlaivablePaymentMethodToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserPaymentMethod_AB_unique" ON "_UserToUserPaymentMethod"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserPaymentMethod_B_index" ON "_UserToUserPaymentMethod"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlaivablePaymentMethodToProject_AB_unique" ON "_AlaivablePaymentMethodToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_AlaivablePaymentMethodToProject_B_index" ON "_AlaivablePaymentMethodToProject"("B");

-- AddForeignKey
ALTER TABLE "UserPaymentMethod" ADD FOREIGN KEY ("userPaymentMethodId") REFERENCES "AlaivablePaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserPaymentMethod" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserPaymentMethod" ADD FOREIGN KEY ("B") REFERENCES "UserPaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlaivablePaymentMethodToProject" ADD FOREIGN KEY ("A") REFERENCES "AlaivablePaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlaivablePaymentMethodToProject" ADD FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
