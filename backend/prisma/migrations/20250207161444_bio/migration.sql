/*
  Warnings:

  - You are about to drop the column `Bio` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "Bio",
ADD COLUMN     "bio" TEXT;
