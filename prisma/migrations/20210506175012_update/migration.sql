/*
  Warnings:

  - You are about to drop the `_ProjectToProjectPaymentMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToProjectPaymentMethod" DROP CONSTRAINT "_ProjectToProjectPaymentMethod_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToProjectPaymentMethod" DROP CONSTRAINT "_ProjectToProjectPaymentMethod_B_fkey";

-- DropTable
DROP TABLE "_ProjectToProjectPaymentMethod";
