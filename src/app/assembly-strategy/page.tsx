import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { statusLabel } from '@/lib/assembly/assembly-rules'

export const dynamic = 'force-dynamic'

export default async function AssemblyStrategyPage() {
  const strategies = await prisma.assemblyStrategy.findMany({
    include: { profile: true, script: true, _count: { select: { canvasItems: true, participants: true, interviewees: true } } },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estratégia de Montagem</h1>
          <p className="text-muted-foreground mt-1">
            Planejamento visual de gravação por perfil e roteiro
          </p>
        </div>
        <Link href="/assembly-strategy/new">
          <Button>Nova Estratégia</Button>
        </Link>
      </div>

      {strategies.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Nenhuma estratégia de montagem criada.</p>
            <Link href="/assembly-strategy/new">
              <Button>Criar primeira estratégia</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {strategies.map(s => (
            <Link key={s.id} href={`/assembly-strategy/${s.id}`}>
              <Card className="glass hover:shadow-md transition-all cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{s.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {s.profile && <span>Perfil: {s.profile.name}</span>}
                        {s.script && <span>Roteiro: {s.script.title}</span>}
                        <span>Tipo: {s.videoType}</span>
                        <span>Status: {statusLabel(s.status)}</span>
                        <span>{s._count.canvasItems} cards · {s._count.participants} participantes · {s._count.interviewees} entrevistados</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
