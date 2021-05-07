-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('MOMO', 'AIRPAY', 'BANK');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "paidDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "stk" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PaymentMethodToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PaymentMethodToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod.provider_unique" ON "PaymentMethod"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentMethodToUser_AB_unique" ON "_PaymentMethodToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentMethodToUser_B_index" ON "_PaymentMethodToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentMethodToProject_AB_unique" ON "_PaymentMethodToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentMethodToProject_B_index" ON "_PaymentMethodToProject"("B");

-- AddForeignKey
ALTER TABLE "_PaymentMethodToUser" ADD FOREIGN KEY ("A") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentMethodToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentMethodToProject" ADD FOREIGN KEY ("A") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentMethodToProject" ADD FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
