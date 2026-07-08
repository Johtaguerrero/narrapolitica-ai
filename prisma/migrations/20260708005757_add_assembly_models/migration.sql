-- AlterTable
ALTER TABLE "EditorialCalendarItem" ADD COLUMN "profileId" TEXT;
ALTER TABLE "EditorialCalendarItem" ADD COLUMN "scriptId" TEXT;

-- CreateTable
CREATE TABLE "AssemblyStrategy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT,
    "instagramAnalysisId" TEXT,
    "scriptId" TEXT,
    "title" TEXT NOT NULL,
    "videoType" TEXT NOT NULL DEFAULT 'solo',
    "objective" TEXT NOT NULL DEFAULT '',
    "centralMessage" TEXT NOT NULL DEFAULT '',
    "visualHook" TEXT NOT NULL DEFAULT '',
    "firstLine" TEXT NOT NULL DEFAULT '',
    "recordingLocation" TEXT NOT NULL DEFAULT '',
    "recordingAddress" TEXT NOT NULL DEFAULT '',
    "recordingDate" TEXT,
    "recordingTime" TEXT,
    "postingDate" TEXT,
    "postingTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssemblyStrategy_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PoliticalProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AssemblyStrategy_instagramAnalysisId_fkey" FOREIGN KEY ("instagramAnalysisId") REFERENCES "InstagramAnalysis" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AssemblyStrategy_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssemblyCanvasItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "strategyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "x" REAL NOT NULL DEFAULT 0,
    "y" REAL NOT NULL DEFAULT 0,
    "width" REAL NOT NULL DEFAULT 200,
    "height" REAL NOT NULL DEFAULT 100,
    "position" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '',
    "metadata" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssemblyCanvasItem_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "AssemblyStrategy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssemblyParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "strategyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "responsibility" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssemblyParticipant_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "AssemblyStrategy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssemblyInterviewee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "strategyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile" TEXT NOT NULL DEFAULT '',
    "speechTheme" TEXT NOT NULL DEFAULT '',
    "mainQuestion" TEXT NOT NULL DEFAULT '',
    "supportQuestions" TEXT NOT NULL DEFAULT '',
    "imageAuthorizationStatus" TEXT NOT NULL DEFAULT 'pendente',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssemblyInterviewee_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "AssemblyStrategy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
