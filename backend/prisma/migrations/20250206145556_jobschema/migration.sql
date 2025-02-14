/*
  Warnings:

  - You are about to drop the column `Benefits` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `Education` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('ENTRY', 'MID', 'SENIOR');

-- CreateEnum
CREATE TYPE "Jobtype" AS ENUM ('PARTTIME', 'FULLTIME', 'FREELANCE', 'INTERSHIP');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "Benefits",
DROP COLUMN "Education",
DROP COLUMN "contact",
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" "Experience" NOT NULL DEFAULT 'ENTRY',
ADD COLUMN     "jobtype" "Jobtype" NOT NULL DEFAULT 'FULLTIME';
