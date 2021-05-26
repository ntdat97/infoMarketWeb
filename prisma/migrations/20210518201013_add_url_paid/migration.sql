-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "urlPaid" TEXT,
ALTER COLUMN "url" DROP NOT NULL;
