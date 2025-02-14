/*
  Warnings:

  - The values [ENTRY,MID] on the enum `Experience` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Experience_new" AS ENUM ('ENTRYLevel', 'MIDLevel', 'SENIOR');
ALTER TABLE "Job" ALTER COLUMN "experience" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "experience" TYPE "Experience_new" USING ("experience"::text::"Experience_new");
ALTER TYPE "Experience" RENAME TO "Experience_old";
ALTER TYPE "Experience_new" RENAME TO "Experience";
DROP TYPE "Experience_old";
ALTER TABLE "Job" ALTER COLUMN "experience" SET DEFAULT 'ENTRYLevel';
COMMIT;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "experience" SET DEFAULT 'ENTRYLevel';
