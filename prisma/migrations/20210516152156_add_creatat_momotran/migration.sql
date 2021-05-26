-- AlterTable
ALTER TABLE "MomoTransaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "description" SET DEFAULT E'';
