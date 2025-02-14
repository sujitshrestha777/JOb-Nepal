/*
  Warnings:

  - You are about to drop the column `location` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "location",
ADD COLUMN     "workLocation" TEXT;
