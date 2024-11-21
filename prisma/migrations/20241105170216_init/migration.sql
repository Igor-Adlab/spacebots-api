-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "billing";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "videos";

-- CreateEnum
CREATE TYPE "billing"."InvoiceStatus" AS ENUM ('Paid', 'Pending', 'Canceled');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos"."backdrop_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "backdrop_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos"."backdrop_videos" (
    "id" UUID NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "duration" BIGINT NOT NULL,
    "typeId" UUID NOT NULL,

    CONSTRAINT "backdrop_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing"."usages" (
    "service" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "day" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriberId" BIGINT NOT NULL,

    CONSTRAINT "usages_pkey" PRIMARY KEY ("subscriberId","day")
);

-- CreateTable
CREATE TABLE "billing"."subscriptions" (
    "id" UUID NOT NULL,
    "service" TEXT,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriberId" BIGINT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing"."invoices" (
    "id" UUID NOT NULL,
    "status" "billing"."InvoiceStatus" NOT NULL DEFAULT 'Pending',
    "payload" JSONB NOT NULL,
    "service" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriberId" BIGINT NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "videos"."backdrop_videos" ADD CONSTRAINT "backdrop_videos_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "videos"."backdrop_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing"."usages" ADD CONSTRAINT "usages_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing"."subscriptions" ADD CONSTRAINT "subscriptions_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing"."invoices" ADD CONSTRAINT "invoices_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
