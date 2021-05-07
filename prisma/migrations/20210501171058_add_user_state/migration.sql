/*
  Warnings:

  - You are about to drop the column `explanImagesURL` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "userState" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "explanImagesURL";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userState" "userState" NOT NULL DEFAULT E'ACTIVE';
