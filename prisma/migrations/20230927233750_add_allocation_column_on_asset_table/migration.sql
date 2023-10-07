/*
 Warnings:

 - Added the required column `allocation` to the `Asset` table without a default value. This is not possible if the table is not empty.
 */
-- AlterTable
-- initially set as nullable
ALTER TABLE "Asset"
  ADD COLUMN "allocation" INTEGER;

-- set default value
UPDATE
  "Asset"
SET
  "allocation" = 1;

-- set as not nullable
ALTER TABLE "Asset"
  ALTER COLUMN "allocation" SET NOT NULL;

