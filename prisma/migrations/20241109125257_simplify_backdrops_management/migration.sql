/*
  Warnings:

  - You are about to drop the column `typeId` on the `backdrop_videos` table. All the data in the column will be lost.
  - You are about to drop the `backdrop_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "videos"."backdrop_videos" DROP CONSTRAINT "backdrop_videos_typeId_fkey";

-- AlterTable
ALTER TABLE "videos"."backdrop_videos" DROP COLUMN "typeId",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Random';

-- DropTable
DROP TABLE "videos"."backdrop_types";
