'use server'

import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

export async function getAdministrativeRegions() {
  return prisma.administrativeRegion.findMany({
    orderBy: { officialNumber: 'asc' },
    include: { localities: true },
  })
}

export async function getAdministrativeRegion(id: string) {
  return prisma.administrativeRegion.findUnique({
    where: { id },
    include: { localities: true, publicData: true, equipments: true },
  })
}

export async function getAdministrativeRegionBySlug(slug: string) {
  return prisma.administrativeRegion.findUnique({
    where: { slug },
    include: { localities: true },
  })
}

export async function getSavedTerritories(profileId?: string) {
  const where = profileId ? { profileId } : {}
  return prisma.savedTerritory.findMany({
    where,
    include: { administrativeRegion: true, analyses: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getSavedTerritory(id: string) {
  return prisma.savedTerritory.findUnique({
    where: { id },
    include: { administrativeRegion: true, analyses: true },
  })
}

export async function createSavedTerritory(data: {
  profileId: string
  administrativeRegionId: string
  localityId?: string
  customLocalityName?: string
  sector?: string
  block?: string
  referencePoint?: string
  approximateAddress?: string
  locationType?: string
  title: string
  description?: string
}) {
  const territory = await prisma.savedTerritory.create({ data })
  revalidatePath('/territories')
  return territory
}

export async function updateSavedTerritory(id: string, data: Partial<{
  localityId: string | null
  customLocalityName: string
  sector: string
  block: string
  referencePoint: string
  approximateAddress: string
  locationType: string
  title: string
  description: string
  status: string
}>) {
  const territory = await prisma.savedTerritory.update({ where: { id }, data })
  revalidatePath('/territories')
  return territory
}

export async function deleteSavedTerritory(id: string) {
  await prisma.savedTerritory.delete({ where: { id } })
  revalidatePath('/territories')
}

export async function createTerritoryAnalysis(data: {
  profileId: string
  administrativeRegionId: string
  savedTerritoryId?: string
  localityId?: string
  contextText: string
  analysisDepth?: string
  territorialObjectives?: string
}) {
  const analysis = await prisma.territoryAnalysis.create({
    data: {
      profileId: data.profileId,
      administrativeRegionId: data.administrativeRegionId,
      savedTerritoryId: data.savedTerritoryId || null,
      localityId: data.localityId || null,
      contextText: data.contextText,
      analysisDepth: data.analysisDepth || 'moderada',
      sourceType: 'USER_PROVIDED',
      status: 'WAITING',
    },
  })
  revalidatePath('/territories')
  return analysis
}

export async function getTerritoryAnalysis(id: string) {
  return prisma.territoryAnalysis.findUnique({
    where: { id },
    include: { administrativeRegion: true, savedTerritory: true },
  })
}

export async function getTerritoryAnalyses(profileId?: string) {
  const where = profileId ? { profileId } : {}
  return prisma.territoryAnalysis.findMany({
    where,
    include: { administrativeRegion: true, savedTerritory: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function updateTerritoryAnalysis(id: string, data: Partial<{
  contextText: string
  contextVersion: number
  territorialObjectives: string
  analysisDepth: string
  territorySummary: string
  contextSummary: string
  mainTheme: string
  secondaryThemes: string
  centralSituation: string
  identifiedProblems: string
  opportunities: string
  involvedActors: string
  mentionedInstitutions: string
  relatedPublic: string
  localSensitivities: string
  recommendedVocabulary: string
  termsToAvoid: string
  narrativeAngle: string
  suggestedHook: string
  centralMessage: string
  recommendedApproach: string
  scenarioSuggestion: string
  recordingPoints: string
  confirmedFacts: string
  userProvidedFacts: string
  aiInferences: string
  factsToVerify: string
  generalizationRisks: string
  communicationRisks: string
  shortNarrative: string
  sourcesUsed: string
  confidence: number
  status: string
}>) {
  const analysis = await prisma.territoryAnalysis.update({ where: { id }, data })
  revalidatePath('/territories')
  return analysis
}

export async function deleteTerritoryAnalysis(id: string) {
  await prisma.territoryAnalysis.delete({ where: { id } })
  revalidatePath('/territories')
}

export async function getTerritoryPublicData(administrativeRegionId: string) {
  return prisma.territoryPublicData.findMany({
    where: { administrativeRegionId },
    orderBy: { referenceDate: 'desc' },
  })
}

export async function getTerritoryEquipments(administrativeRegionId: string) {
  return prisma.territoryEquipment.findMany({
    where: { administrativeRegionId, isActive: true },
    orderBy: { name: 'asc' },
  })
}
