/*
  Warnings:

  - Added the required column `companyType` to the `EmployerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyphotourl` to the `EmployerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noEmployees` to the `EmployerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployerProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "companyType" TEXT NOT NULL,
ADD COLUMN     "companyphotourl" TEXT NOT NULL,
ADD COLUMN     "noEmployees" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "Benefits" TEXT,
ADD COLUMN     "Education" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "education" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "location" TEXT,
ALTER COLUMN "Bio" DROP NOT NULL;
