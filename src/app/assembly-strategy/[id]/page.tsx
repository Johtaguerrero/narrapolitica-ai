import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { getMergedProfiles } from '@/lib/assembly/assembly-actions'
import { AssemblyStrategyClient } from './assembly-strategy-client'

export const dynamic = 'force-dynamic'

export default async function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const strategy = await prisma.assemblyStrategy.findUnique({
    where: { id },
    include: {
      canvasItems: { orderBy: { position: 'asc' } },
      participants: true,
      interviewees: true,
      profile: true,
      script: true,
    },
  })
  if (!strategy) notFound()

  const [profiles, regions] = await Promise.all([
    getMergedProfiles(),
    prisma.administrativeRegion.findMany({ orderBy: { officialNumber: 'asc' } }),
  ])

  return (
    <AssemblyStrategyClient
      strategy={JSON.parse(JSON.stringify(strategy))}
      profiles={JSON.parse(JSON.stringify(profiles))}
      regions={JSON.parse(JSON.stringify(regions))}
    />
  )
}
