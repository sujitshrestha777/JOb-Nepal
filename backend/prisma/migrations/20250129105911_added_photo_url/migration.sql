/*
  Warnings:

  - You are about to drop the column `photo` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "photo",
ADD COLUMN     "photoUrl" TEXT;
