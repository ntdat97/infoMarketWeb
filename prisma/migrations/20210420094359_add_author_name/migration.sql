/*
  Warnings:

  - You are about to drop the column `coverURL` on the `Project` table. All the data in the column will be lost.
  - Added the required column `authorName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providers` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "coverURL",
ADD COLUMN     "caroselImage" JSONB[],
ADD COLUMN     "authorName" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT E'PENDING',
ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "maxUnit" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "providers" TEXT NOT NULL;
