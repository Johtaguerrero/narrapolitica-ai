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
    "format" TEXT NOT NULL DEFAULT 'gancho_forte',
    "hook" TEXT NOT NULL DEFAULT '',
    "fullScript" TEXT NOT NULL DEFAULT '',
    "pauseMarks" TEXT NOT NULL DEFAULT '',
    "cameraDir" TEXT NOT NULL DEFAULT '',
    "sceneSuggestion" TEXT NOT NULL DEFAULT '',
    "captionSuggestion" TEXT NOT NULL DEFAULT '',
    "ctaSuggestion" TEXT NOT NULL DEFAULT '',
    "hashtags" TEXT NOT NULL DEFAULT '',
    "shortVersion" TEXT NOT NULL DEFAULT '',
    "emotionalVersion" TEXT NOT NULL DEFAULT '',
    "institutionalVersion" TEXT NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "estimatedWords" INTEGER,
    "objective" TEXT,
    "scriptText" TEXT,
    "captionText" TEXT,
    "cta" TEXT,
    "scenarioSuggestion" TEXT,
    "framingSuggestion" TEXT,
    "strategicNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Script_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PoliticalProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Script_instagramAnalysisId_fkey" FOREIGN KEY ("instagramAnalysisId") REFERENCES "InstagramAnalysis" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Script" ("cameraDir", "captionSuggestion", "createdAt", "ctaSuggestion", "duration", "emotionalVersion", "format", "fullScript", "hashtags", "hook", "id", "instagramAnalysisId", "instagramUsername", "institutionalVersion", "isPublic", "pauseMarks", "profileId", "profileName", "sceneSuggestion", "shortVersion", "style", "theme", "title", "type", "updatedAt") SELECT "cameraDir", "captionSuggestion", "createdAt", "ctaSuggestion", "duration", "emotionalVersion", "format", "fullScript", "hashtags", "hook", "id", "instagramAnalysisId", "instagramUsername", "institutionalVersion", "isPublic", "pauseMarks", "profileId", "profileName", "sceneSuggestion", "shortVersion", "style", "theme", "title", "type", "updatedAt" FROM "Script";
DROP TABLE "Script";
ALTER TABLE "new_Script" RENAME TO "Script";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
