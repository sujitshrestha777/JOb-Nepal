/*
  Warnings:

  - You are about to drop the column `companyphotourl` on the `EmployerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployerProfile" DROP COLUMN "companyphotourl",
ADD COLUMN     "photourl" TEXT;
