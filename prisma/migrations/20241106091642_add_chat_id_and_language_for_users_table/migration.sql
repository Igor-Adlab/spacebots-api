-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "chatId" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'ru';
