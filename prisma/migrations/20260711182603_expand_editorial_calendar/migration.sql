/*
  Warnings:

  - Added the required column `updatedAt` to the `EditorialCalendarItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EditorialCalendarItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT,
    "scriptId" TEXT,
    "assemblyStrategyId" TEXT,
    "administrativeRegionId" TEXT,
    "savedTerritoryId" TEXT,
    "territoryAnalysisId" TEXT,
    "scheduledDate" TEXT,
    "scheduledTime" TEXT,
    "month" INTEGER,
    "week" INTEGER,
    "day" INTEGER,
    "hour" INTEGER,
    "minute" INTEGER,
    "dayOfWeek" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'reels',
    "territoryName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ideia',
    "color" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'media',
    "thumbnail" TEXT,
    "notes" TEXT,
    "responsible" TEXT,
    "checklist" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_EditorialCalendarItem" ("administrativeRegionId", "color", "createdAt", "dayOfWeek", "description", "id", "label", "profileId", "savedTerritoryId", "scriptId", "territoryAnalysisId") SELECT "administrativeRegionId", "color", "createdAt", "dayOfWeek", "description", "id", "label", "profileId", "savedTerritoryId", "scriptId", "territoryAnalysisId" FROM "EditorialCalendarItem";
DROP TABLE "EditorialCalendarItem";
ALTER TABLE "new_EditorialCalendarItem" RENAME TO "EditorialCalendarItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
