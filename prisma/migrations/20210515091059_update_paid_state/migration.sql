/*
  Warnings:

  - The `paidState` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "paidState",
ADD COLUMN     "paidState" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "PaidState";
