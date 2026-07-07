/*
  Warnings:

  - You are about to drop the column `commRisks` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `contentOpps` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `instagramHandle` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `mainThemes` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `manualDesc` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `positionDiag` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `postLinks` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `publicComments` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `reelSuggestions` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `speechSuggestions` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `strongThemes` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `voiceTone` on the `InstagramAnalysis` table. All the data in the column will be lost.
  - Added the required column `bioSummary` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communicationRisks` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentOpportunities` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detectedTone` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequentThemes` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashtagSuggestions` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `probableAudience` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileUrl` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicName` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawAnalysis` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reelIdeas` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speechIdeas` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `InstagramAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstagramAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT,
    "profileUrl" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "publicName" TEXT NOT NULL,
    "bioSummary" TEXT NOT NULL,
    "detectedTone" TEXT NOT NULL,
    "frequentThemes" TEXT NOT NULL,
    "probableAudience" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "contentOpportunities" TEXT NOT NULL,
    "reelIdeas" TEXT NOT NULL,
    "speechIdeas" TEXT NOT NULL,
    "communicationRisks" TEXT NOT NULL,
    "captionSuggestions" TEXT NOT NULL,
    "hashtagSuggestions" TEXT NOT NULL,
    "rawAnalysis" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pronto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstagramAnalysis_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PoliticalProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InstagramAnalysis" ("captionSuggestions", "createdAt", "id", "profileId", "strengths", "weaknesses") SELECT "captionSuggestions", "createdAt", "id", "profileId", "strengths", "weaknesses" FROM "InstagramAnalysis";
DROP TABLE "InstagramAnalysis";
ALTER TABLE "new_InstagramAnalysis" RENAME TO "InstagramAnalysis";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
