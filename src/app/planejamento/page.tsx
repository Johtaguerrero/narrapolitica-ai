import { prisma } from '@/lib/db/prisma'
import { PlanningCenter } from './planning-center'

export const dynamic = 'force-dynamic'

export default async function PlanejamentoPage() {
  const profiles = await prisma.politicalProfile.findMany({ orderBy: { name: 'asc' } })

  return <PlanningCenter profiles={JSON.parse(JSON.stringify(profiles))} />
}
