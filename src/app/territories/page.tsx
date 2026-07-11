import { prisma } from '@/lib/db/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { TerritoriesClient } from './territories-client'

export const dynamic = 'force-dynamic'

export default async function TerritoriesPage() {
  const regions = await prisma.administrativeRegion.findMany({
    orderBy: { officialNumber: 'asc' },
    include: { localities: true },
  })

  return <TerritoriesClient regions={JSON.parse(JSON.stringify(regions))} />
}
