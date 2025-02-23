/*
  Warnings:

  - You are about to drop the column `UserId` on the `Application` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobId,userId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_UserId_fkey";

-- DropIndex
DROP INDEX "Application_jobId_UserId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "UserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_userId_key" ON "Application"("jobId", "userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
