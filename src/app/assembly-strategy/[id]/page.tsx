import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
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

  const profiles = await prisma.politicalProfile.findMany({ orderBy: { name: 'asc' } })

  return <AssemblyStrategyClient strategy={JSON.parse(JSON.stringify(strategy))} profiles={JSON.parse(JSON.stringify(profiles))} />
}
