/*
  Warnings:

  - You are about to drop the column `senderPhone` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `clientTime` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `ackTime` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `MomoTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `statusText` on the `MomoTransaction` table. All the data in the column will be lost.
  - Added the required column `data` to the `MomoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MomoTransaction" DROP COLUMN "senderPhone",
DROP COLUMN "senderName",
DROP COLUMN "note",
DROP COLUMN "amount",
DROP COLUMN "clientTime",
DROP COLUMN "ackTime",
DROP COLUMN "statusCode",
DROP COLUMN "statusText",
ADD COLUMN     "data" JSONB NOT NULL;
