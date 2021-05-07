/*
  Warnings:

  - You are about to drop the `_AlaivablePaymentMethodToProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlaivablePaymentMethodToProject" DROP CONSTRAINT "_AlaivablePaymentMethodToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlaivablePaymentMethodToProject" DROP CONSTRAINT "_AlaivablePaymentMethodToProject_B_fkey";

-- DropTable
DROP TABLE "_AlaivablePaymentMethodToProject";

-- CreateTable
CREATE TABLE "ProjectPaymentMethod" (
    "id" TEXT NOT NULL,
    "ProjectPaymentMethodId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToProjectPaymentMethod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToProjectPaymentMethod_AB_unique" ON "_ProjectToProjectPaymentMethod"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToProjectPaymentMethod_B_index" ON "_ProjectToProjectPaymentMethod"("B");

-- AddForeignKey
ALTER TABLE "ProjectPaymentMethod" ADD FOREIGN KEY ("ProjectPaymentMethodId") REFERENCES "AlaivablePaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToProjectPaymentMethod" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToProjectPaymentMethod" ADD FOREIGN KEY ("B") REFERENCES "ProjectPaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
