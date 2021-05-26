/*
  Warnings:

  - The values [Image,Map] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('IMAGE', 'MAP');
ALTER TABLE "Project" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "type" TYPE "ProjectType_new" USING ("type"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "ProjectType_old";
ALTER TABLE "Project" ALTER COLUMN "type" SET DEFAULT 'IMAGE';
COMMIT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "type" SET DEFAULT E'IMAGE';
