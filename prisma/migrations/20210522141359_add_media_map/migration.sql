-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('Image', 'Map');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT E'Image';

-- CreateTable
CREATE TABLE "MediaMap" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "Country" TEXT,
    "City" TEXT,
    "District" TEXT,
    "Subdistrict" TEXT,
    "Street" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaMap" ADD FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
