-- AlterTable
ALTER TABLE "AssemblyStrategy" ADD COLUMN "administrativeRegionId" TEXT;
ALTER TABLE "AssemblyStrategy" ADD COLUMN "alternativeLocation" TEXT;
ALTER TABLE "AssemblyStrategy" ADD COLUMN "recordingReferencePoint" TEXT;
ALTER TABLE "AssemblyStrategy" ADD COLUMN "savedTerritoryId" TEXT;
ALTER TABLE "AssemblyStrategy" ADD COLUMN "territoryAnalysisId" TEXT;

-- AlterTable
ALTER TABLE "EditorialCalendarItem" ADD COLUMN "administrativeRegionId" TEXT;
ALTER TABLE "EditorialCalendarItem" ADD COLUMN "savedTerritoryId" TEXT;
ALTER TABLE "EditorialCalendarItem" ADD COLUMN "territoryAnalysisId" TEXT;

-- AlterTable
ALTER TABLE "Script" ADD COLUMN "administrativeRegionId" TEXT;
ALTER TABLE "Script" ADD COLUMN "savedTerritoryId" TEXT;
ALTER TABLE "Script" ADD COLUMN "territorialNarrative" TEXT;
ALTER TABLE "Script" ADD COLUMN "territorialObjectives" TEXT;
ALTER TABLE "Script" ADD COLUMN "territoryAnalysisId" TEXT;
ALTER TABLE "Script" ADD COLUMN "territoryContext" TEXT;
ALTER TABLE "Script" ADD COLUMN "territoryFactsToVerify" TEXT;
ALTER TABLE "Script" ADD COLUMN "territoryName" TEXT;

-- CreateTable
CREATE TABLE "AdministrativeRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officialNumber" INTEGER NOT NULL,
    "romanNumber" TEXT NOT NULL,
    "officialName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT,
    "stateCode" TEXT NOT NULL DEFAULT 'DF',
    "countryCode" TEXT NOT NULL DEFAULT 'BR',
    "divisionType" TEXT NOT NULL DEFAULT 'ADMINISTRATIVE_REGION',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "officialSourceName" TEXT,
    "officialSourceUrl" TEXT,
    "effectiveDate" DATETIME,
    "latitude" REAL,
    "longitude" REAL,
    "geoJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TerritoryLocality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "administrativeRegionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "aliases" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "latitude" REAL,
    "longitude" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TerritoryLocality_administrativeRegionId_fkey" FOREIGN KEY ("administrativeRegionId") REFERENCES "AdministrativeRegion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedTerritory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "instagramAnalysisId" TEXT,
    "administrativeRegionId" TEXT NOT NULL,
    "localityId" TEXT,
    "customLocalityName" TEXT,
    "sector" TEXT,
    "block" TEXT,
    "referencePoint" TEXT,
    "approximateAddress" TEXT,
    "locationType" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavedTerritory_administrativeRegionId_fkey" FOREIGN KEY ("administrativeRegionId") REFERENCES "AdministrativeRegion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TerritoryAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "instagramAnalysisId" TEXT,
    "savedTerritoryId" TEXT,
    "administrativeRegionId" TEXT NOT NULL,
    "localityId" TEXT,
    "scriptId" TEXT,
    "contextText" TEXT NOT NULL,
    "contextVersion" INTEGER NOT NULL DEFAULT 1,
    "territorialObjectives" TEXT,
    "analysisDepth" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "referenceDate" DATETIME,
    "territorySummary" TEXT,
    "contextSummary" TEXT,
    "mainTheme" TEXT,
    "secondaryThemes" TEXT,
    "centralSituation" TEXT,
    "identifiedProblems" TEXT,
    "opportunities" TEXT,
    "involvedActors" TEXT,
    "mentionedInstitutions" TEXT,
    "relatedPublic" TEXT,
    "localSensitivities" TEXT,
    "recommendedVocabulary" TEXT,
    "termsToAvoid" TEXT,
    "narrativeAngle" TEXT,
    "suggestedHook" TEXT,
    "centralMessage" TEXT,
    "recommendedApproach" TEXT,
    "scenarioSuggestion" TEXT,
    "recordingPoints" TEXT,
    "confirmedFacts" TEXT,
    "userProvidedFacts" TEXT,
    "aiInferences" TEXT,
    "factsToVerify" TEXT,
    "generalizationRisks" TEXT,
    "communicationRisks" TEXT,
    "shortNarrative" TEXT,
    "sourcesUsed" TEXT,
    "confidence" REAL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "analyzedAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TerritoryAnalysis_administrativeRegionId_fkey" FOREIGN KEY ("administrativeRegionId") REFERENCES "AdministrativeRegion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TerritoryAnalysis_savedTerritoryId_fkey" FOREIGN KEY ("savedTerritoryId") REFERENCES "SavedTerritory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TerritoryPublicData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "administrativeRegionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "indicatorName" TEXT NOT NULL,
    "valueText" TEXT,
    "numericValue" REAL,
    "unit" TEXT,
    "referenceDate" DATETIME NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "collectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TerritoryPublicData_administrativeRegionId_fkey" FOREIGN KEY ("administrativeRegionId") REFERENCES "AdministrativeRegion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TerritoryEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "administrativeRegionId" TEXT NOT NULL,
    "localityId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "referencePoint" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TerritoryEquipment_administrativeRegionId_fkey" FOREIGN KEY ("administrativeRegionId") REFERENCES "AdministrativeRegion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdministrativeRegion_officialNumber_key" ON "AdministrativeRegion"("officialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdministrativeRegion_slug_key" ON "AdministrativeRegion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TerritoryLocality_administrativeRegionId_slug_key" ON "TerritoryLocality"("administrativeRegionId", "slug");
