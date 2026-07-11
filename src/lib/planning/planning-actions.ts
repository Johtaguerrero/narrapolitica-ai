'use server'

import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

// Batch create/update/delete calendar items for a profile+date
export async function saveCalendarItems(items: Array<{
  id?: string
  profileId: string
  scriptId?: string
  assemblyStrategyId?: string
  scheduledDate: string
  scheduledTime?: string
  label: string
  description?: string
  contentType?: string
  territoryName?: string
  status?: string
  color?: string
  priority?: string
  notes?: string
  responsible?: string
  checklist?: string
  dayOfWeek: number
  month: number
  day: number
}>) {
  for (const item of items) {
    if (item.id) {
      const { id, ...rest } = item
      await prisma.editorialCalendarItem.update({ where: { id }, data: rest as any })
    } else {
      const { id: _, ...rest } = item
      await prisma.editorialCalendarItem.create({ data: rest as any })
    }
  }
  revalidatePath('/planejamento')
  revalidatePath('/calendario')
}

export async function deleteCalendarItem(id: string) {
  await prisma.editorialCalendarItem.delete({ where: { id } })
  revalidatePath('/planejamento')
  revalidatePath('/calendario')
}

export async function updateCalendarItem(id: string, data: Partial<{
  scheduledDate: string
  scheduledTime: string
  dayOfWeek: number
  month: number
  day: number
  status: string
  priority: string
  color: string
  label: string
  description: string
  notes: string
  checklist: string
  responsible: string
  contentType: string
  territoryName: string
  assemblyStrategyId: string
}>) {
  await prisma.editorialCalendarItem.update({ where: { id }, data: data as any })
  revalidatePath('/planejamento')
  revalidatePath('/calendario')
}

export async function getCalendarItems(profileId?: string, month?: number, year?: number) {
  const where: Record<string, unknown> = {}
  if (profileId) where.profileId = profileId
  if (month !== undefined) where.month = month
  if (year !== undefined) {
    // year filter via scheduledDate start/end
  }

  return prisma.editorialCalendarItem.findMany({
    where: where as Record<string, unknown>,
    orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
  })
}

export async function getScriptsByProfileForCalendar(profileId: string) {
  return prisma.script.findMany({
    where: {
      OR: [
        { profileId },
        { instagramAnalysisId: profileId },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: { analysis: { select: { username: true } } },
  })
}

export async function getCalendarIndicators(profileId: string) {
  const [totalItems, byStatus, byContentType] = await Promise.all([
    prisma.editorialCalendarItem.count({ where: { profileId } }),
    prisma.editorialCalendarItem.groupBy({
      by: ['status'],
      where: { profileId },
      _count: true,
    }),
    prisma.editorialCalendarItem.groupBy({
      by: ['contentType'],
      where: { profileId },
      _count: true,
    }),
  ])
  return { totalItems, byStatus, byContentType }
}

export async function getAssemblyStrategy(id: string) {
  return prisma.assemblyStrategy.findUnique({
    where: { id },
    include: { participants: true, interviewees: true, canvasItems: true },
  })
}
