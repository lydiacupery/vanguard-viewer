/*
 Warnings:

 - The primary key for the `Asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - A unique constraint covering the columns `[ticker,categoryID]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
 - The required column `id` was added to the `Asset` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
 */
-- AlterTable
-- add id as optional
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE "Asset"
  DROP CONSTRAINT "Asset_pkey",
  ADD COLUMN "id" TEXT;

-- fill in id
UPDATE
  "Asset"
SET
  "id" = uuid_generate_v4();

-- make id required
ALTER TABLE "Asset"
  ALTER COLUMN "id" SET NOT NULL;

-- add id constraint
ALTER TABLE "Asset"
  ADD CONSTRAINT "Asset_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_ticker_categoryID_key" ON "Asset"("ticker", "categoryID");

