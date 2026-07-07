-- CreateTable
CREATE TABLE "PoliticalProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "party" TEXT,
    "instagram" TEXT NOT NULL,
    "mainAudience" TEXT NOT NULL,
    "mainThemes" TEXT NOT NULL,
    "desiredTone" TEXT NOT NULL,
    "languageRules" TEXT NOT NULL,
    "avoidWords" TEXT NOT NULL,
    "useWords" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InstagramAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT,
    "instagramHandle" TEXT NOT NULL,
    "postLinks" TEXT NOT NULL,
    "manualDesc" TEXT NOT NULL,
    "mainThemes" TEXT NOT NULL,
    "publicComments" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "positionDiag" TEXT NOT NULL,
    "voiceTone" TEXT NOT NULL,
    "contentOpps" TEXT NOT NULL,
    "commRisks" TEXT NOT NULL,
    "strongThemes" TEXT NOT NULL,
    "reelSuggestions" TEXT NOT NULL,
    "speechSuggestions" TEXT NOT NULL,
    "captionSuggestions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstagramAnalysis_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PoliticalProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT,
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
    CONSTRAINT "Script_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PoliticalProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReelCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scriptId" TEXT,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ideia',
    "suggestedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReelCard_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StylePreset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "tips" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EditorialCalendarItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayOfWeek" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
