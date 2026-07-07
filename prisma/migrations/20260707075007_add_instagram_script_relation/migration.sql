-- AlterTable
ALTER TABLE "InstagramAnalysis" ADD COLUMN "city" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT,
    "instagramAnalysisId" TEXT,
    "profileName" TEXT,
    "instagramUsername" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "fullScript" TEXT NOT NULL,
    "pauseMarks" TEXT NOT NULL,
    "cameraDir" TEXT NOT NULL,
    "sceneSuggestion" TEXT NOT NULL,
    "captionSuggestion" TEXT NOT NULL,
    "ctaSuggestion" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,
    "shortVersion" TEXT NOT NULL,
    "emotionalVersion" TEXT NOT NULL,
    "institutionalVersion" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Script_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PoliticalProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Script_instagramAnalysisId_fkey" FOREIGN KEY ("instagramAnalysisId") REFERENCES "InstagramAnalysis" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Script" ("cameraDir", "captionSuggestion", "createdAt", "ctaSuggestion", "duration", "emotionalVersion", "format", "fullScript", "hashtags", "hook", "id", "institutionalVersion", "isPublic", "pauseMarks", "profileId", "sceneSuggestion", "shortVersion", "style", "theme", "title", "type", "updatedAt") SELECT "cameraDir", "captionSuggestion", "createdAt", "ctaSuggestion", "duration", "emotionalVersion", "format", "fullScript", "hashtags", "hook", "id", "institutionalVersion", "isPublic", "pauseMarks", "profileId", "sceneSuggestion", "shortVersion", "style", "theme", "title", "type", "updatedAt" FROM "Script";
DROP TABLE "Script";
ALTER TABLE "new_Script" RENAME TO "Script";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
