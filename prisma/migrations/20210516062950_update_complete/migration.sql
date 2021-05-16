/*
  Warnings:

  - The values [COMPLETE] on the enum `isComplete` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `MediaBatchTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "isComplete_new" AS ENUM ('COMPLETED', 'PAUSE', 'STOP', 'UNCOMPLETE');
ALTER TABLE "Project" ALTER COLUMN "complete" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "complete" TYPE "isComplete_new" USING ("complete"::text::"isComplete_new");
ALTER TYPE "isComplete" RENAME TO "isComplete_old";
ALTER TYPE "isComplete_new" RENAME TO "isComplete";
DROP TYPE "isComplete_old";
ALTER TABLE "Project" ALTER COLUMN "complete" SET DEFAULT 'UNCOMPLETE';
COMMIT;

-- DropForeignKey
ALTER TABLE "MediaBatchTransaction" DROP CONSTRAINT "MediaBatchTransaction_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaBatchTransaction" DROP CONSTRAINT "MediaBatchTransaction_projectTransactionRecorderID_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "projectTransactionRecorderId" TEXT;

-- DropTable
DROP TABLE "MediaBatchTransaction";

-- AddForeignKey
ALTER TABLE "Media" ADD FOREIGN KEY ("projectTransactionRecorderId") REFERENCES "ProjectTransactionRecorder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
