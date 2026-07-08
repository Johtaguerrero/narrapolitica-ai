'use server'

import { prisma } from '../db/prisma'
import { revalidatePath } from 'next/cache'

export async function getMergedProfiles() {
  const [politicalProfiles, analyses] = await Promise.all([
    prisma.politicalProfile.findMany({ orderBy: { name: 'asc' } }),
    prisma.instagramAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
      include: { profile: true },
    }),
  ])

  const merged: Array<{ id: string; name: string; instagram: string; source: 'profile' | 'analysis' }> = [
    ...politicalProfiles.map(p => ({ id: p.id, name: p.name, instagram: p.instagram, source: 'profile' as const })),
  ]

  const existingIds = new Set(merged.map(m => m.id))

  for (const a of analyses) {
    if (a.profile && !existingIds.has(a.profile.id)) {
      merged.push({ id: a.profile.id, name: a.profile.name, instagram: a.profile.instagram, source: 'profile' as const })
      existingIds.add(a.profile.id)
    } else if (!a.profile) {
      merged.push({ id: a.id, name: a.publicName || a.username, instagram: a.username, source: 'analysis' as const })
    }
  }

  return merged
}

export async function resolveProfileId(selectedId: string, source: 'profile' | 'analysis') {
  if (source === 'profile') return selectedId

  const analysis = await prisma.instagramAnalysis.findUnique({ where: { id: selectedId }, include: { profile: true } })
  if (!analysis) return null

  if (analysis.profile) return analysis.profile.id

  const profile = await prisma.politicalProfile.create({
    data: {
      name: analysis.publicName || analysis.username,
      role: 'político',
      city: analysis.city || '',
      instagram: analysis.username,
      mainAudience: analysis.probableAudience || '',
      mainThemes: analysis.frequentThemes || '',
      desiredTone: analysis.detectedTone || '',
      languageRules: '',
      avoidWords: '',
      useWords: '',
    },
  })

  await prisma.instagramAnalysis.update({
    where: { id: selectedId },
    data: { profileId: profile.id },
  })

  return profile.id
}

export async function createStrategy(data: {
  profileId: string
  scriptId: string
  title: string
  videoType?: string
}) {
  const strategy = await prisma.assemblyStrategy.create({
    data: {
      profileId: data.profileId,
      scriptId: data.scriptId,
      title: data.title,
      videoType: data.videoType || 'solo',
    },
  })
  revalidatePath('/assembly-strategy')
  return strategy
}

export async function getStrategies(profileId?: string) {
  const where = profileId ? { profileId } : {}
  return prisma.assemblyStrategy.findMany({
    where,
    include: { canvasItems: true, participants: true, interviewees: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getStrategy(id: string) {
  return prisma.assemblyStrategy.findUnique({
    where: { id },
    include: { canvasItems: true, participants: true, interviewees: true },
  })
}

export async function updateStrategy(id: string, data: Record<string, unknown>) {
  const strategy = await prisma.assemblyStrategy.update({
    where: { id },
    data,
  })
  revalidatePath('/assembly-strategy')
  return strategy
}

export async function deleteStrategy(id: string) {
  await prisma.assemblyStrategy.delete({ where: { id } })
  revalidatePath('/assembly-strategy')
}

export async function saveCanvasItems(strategyId: string, items: Array<{
  id?: string
  type: string
  title: string
  content: string
  x: number
  y: number
  width: number
  height: number
  color?: string
  metadata?: string
}>) {
  const existing = await prisma.assemblyCanvasItem.findMany({ where: { strategyId } })
  const existingIds = existing.map(e => e.id)
  const incomingIds = items.filter(i => i.id).map(i => i.id!)

  await prisma.assemblyCanvasItem.deleteMany({
    where: { strategyId, id: { notIn: incomingIds.length ? incomingIds : ['__none__'] } },
  })

  for (const item of items) {
    if (item.id && existingIds.includes(item.id)) {
      await prisma.assemblyCanvasItem.update({
        where: { id: item.id },
        data: {
          type: item.type,
          title: item.title,
          content: item.content,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          color: item.color || '',
          metadata: item.metadata || '',
        },
      })
    } else {
      await prisma.assemblyCanvasItem.create({
        data: {
          strategyId,
          type: item.type,
          title: item.title,
          content: item.content,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          color: item.color || '',
          metadata: item.metadata || '',
        },
      })
    }
  }

  revalidatePath('/assembly-strategy')
}

export async function addParticipant(strategyId: string, data: {
  name: string
  role: string
  phone?: string
  instagram?: string
  responsibility?: string
  status?: string
}) {
  await prisma.assemblyParticipant.create({
    data: { strategyId, ...data },
  })
  revalidatePath('/assembly-strategy')
}

export async function updateParticipant(id: string, data: Record<string, unknown>) {
  await prisma.assemblyParticipant.update({ where: { id }, data })
  revalidatePath('/assembly-strategy')
}

export async function deleteParticipant(id: string) {
  await prisma.assemblyParticipant.delete({ where: { id } })
  revalidatePath('/assembly-strategy')
}

export async function addInterviewee(strategyId: string, data: {
  name: string
  profile?: string
  speechTheme?: string
  mainQuestion?: string
  supportQuestions?: string
  imageAuthorizationStatus?: string
  status?: string
}) {
  await prisma.assemblyInterviewee.create({
    data: { strategyId, ...data },
  })
  revalidatePath('/assembly-strategy')
}

export async function updateInterviewee(id: string, data: Record<string, unknown>) {
  await prisma.assemblyInterviewee.update({ where: { id }, data })
  revalidatePath('/assembly-strategy')
}

export async function deleteInterviewee(id: string) {
  await prisma.assemblyInterviewee.delete({ where: { id } })
  revalidatePath('/assembly-strategy')
}

export async function getScriptsByProfile(profileId: string) {
  const analyses = await prisma.instagramAnalysis.findMany({
    where: { profileId },
    select: { id: true },
  })
  const analysisIds = analyses.map(a => a.id)

  return prisma.script.findMany({
    where: {
      OR: [
        { profileId },
        ...(analysisIds.length > 0 ? [{ instagramAnalysisId: { in: analysisIds } }] : []),
        { instagramAnalysisId: profileId },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function sendToCalendar(strategyId: string) {
  const strategy = await prisma.assemblyStrategy.findUnique({
    where: { id: strategyId },
    include: { script: true },
  })
  if (!strategy) throw new Error('Estratégia não encontrada')

  const postingDate = strategy.postingDate
  const dayOfWeek = postingDate ? new Date(postingDate).getDay() : new Date().getDay()

  await prisma.editorialCalendarItem.create({
    data: {
      profileId: strategy.profileId,
      scriptId: strategy.scriptId,
      dayOfWeek,
      label: strategy.title,
      description: `Tipo: ${strategy.videoType} | Local: ${strategy.recordingLocation} | Data: ${postingDate || 'n/d'}`,
      color: '#6366f1',
    },
  })

  await prisma.assemblyStrategy.update({
    where: { id: strategyId },
    data: { status: 'planejamento' },
  })

  revalidatePath('/calendario')
  revalidatePath('/assembly-strategy')
}
