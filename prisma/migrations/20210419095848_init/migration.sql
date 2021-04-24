-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PUBLISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "isComplete" AS ENUM ('COMPLETE', 'UNCOMPLETE');

-- CreateEnum
CREATE TYPE "isApprove" AS ENUM ('PENDING', 'REJECT', 'APPROVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "name" TEXT,
    "username" TEXT,
    "photoURL" TEXT,
    "website" TEXT,
    "bio" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "complete" "isComplete" NOT NULL DEFAULT E'UNCOMPLETE',
    "coverURL" TEXT[],
    "explanImagesURL" TEXT[],
    "slug" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "maxUnit" INTEGER NOT NULL,
    "openDay" TIMESTAMP(3) NOT NULL,
    "closeDay" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "usedFor" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isApprove" "isApprove" NOT NULL DEFAULT E'PENDING',
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project.slug_unique" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Media.userId_unique" ON "Media"("userId");

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
