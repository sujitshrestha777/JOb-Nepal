/*
  Warnings:

  - A unique constraint covering the columns `[jobId,UserId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_UserId_key" ON "Application"("jobId", "UserId");
