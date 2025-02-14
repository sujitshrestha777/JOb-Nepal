-- AlterTable
ALTER TABLE "EmployerProfile" ALTER COLUMN "companyName" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "companyType" DROP NOT NULL,
ALTER COLUMN "companyphotourl" DROP NOT NULL,
ALTER COLUMN "noEmployees" DROP NOT NULL;
