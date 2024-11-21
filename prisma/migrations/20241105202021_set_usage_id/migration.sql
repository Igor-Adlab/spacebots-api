/*
  Warnings:

  - The primary key for the `usages` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "billing"."usages" DROP CONSTRAINT "usages_pkey",
ADD CONSTRAINT "usages_pkey" PRIMARY KEY ("subscriberId", "day", "service");
