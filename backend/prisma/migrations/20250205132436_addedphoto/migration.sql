/*
  Warnings:

  - You are about to drop the column `photourl` on the `EmployerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployerProfile" DROP COLUMN "photourl",
ADD COLUMN     "photoUrl" TEXT;
