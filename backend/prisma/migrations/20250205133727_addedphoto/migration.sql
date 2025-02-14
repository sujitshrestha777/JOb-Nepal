/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `EmployerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployerProfile" DROP COLUMN "photoUrl",
ADD COLUMN     "companyphotourl" TEXT;
