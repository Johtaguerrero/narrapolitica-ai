'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createStrategy, getScriptsByProfile, resolveProfileId } from '@/lib/assembly/assembly-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MergedProfile {
  id: string
  name: string
  instagram: string
  source: 'profile' | 'analysis'
}

interface Script {
  id: string
  title: string
  type: string
}

export function NewStrategyForm({ profiles, initialProfileId, initialScriptId, initialTitle }: {
  profiles: MergedProfile[]
  initialProfileId?: string
  initialScriptId?: string
  initialTitle?: string
}) {
  const router = useRouter()
  const [profileId, setProfileId] = useState(initialProfileId || '')
  const [scripts, setScripts] = useState<Script[]>([])
  const [scriptId, setScriptId] = useState(initialScriptId || '')
  const [loading, setLoading] = useState(false)

  const selectedProfile = profiles.find(p => p.id === profileId)

  useEffect(() => {
    if (profileId) {
      getScriptsByProfile(profileId).then(s => setScripts(s as Script[]))
    }
  }, [profileId])

  useEffect(() => {
    if (initialProfileId && initialScriptId) {
      getScriptsByProfile(initialProfileId).then(s => {
        setScripts(s as Script[])
        setScriptId(initialScriptId)
      })
    }
  }, [initialProfileId, initialScriptId])

  async function handleProfileChange(id: string) {
    setProfileId(id)
    setScriptId('')
    if (id) {
      const s = await getScriptsByProfile(id)
      setScripts(s as Script[])
    } else {
      setScripts([])
    }
  }

  async function handleCreate() {
    if (!profileId || !scriptId || !selectedProfile) return
    setLoading(true)
    try {
      let resolvedId = profileId
      if (selectedProfile.source === 'analysis') {
        const realId = await resolveProfileId(profileId, 'analysis')
        if (!realId) throw new Error('Não foi possível resolver o perfil')
        resolvedId = realId
      }

      const script = scripts.find(s => s.id === scriptId)
      const strategy = await createStrategy({
        profileId: resolvedId,
        scriptId,
        title: initialTitle || script?.title || 'Nova estratégia',
      })
      router.push(`/assembly-strategy/${strategy.id}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Estratégia</h1>
        <p className="text-muted-foreground mt-1">Selecione um perfil e um roteiro para criar a estratégia de montagem</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Seleção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Perfil salvo</label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
              value={profileId}
              onChange={e => handleProfileChange(e.target.value)}
            >
              <option value="">Selecionar perfil</option>
              {profiles.map(p => (
                <option key={`${p.source}-${p.id}`} value={p.id}>
                  {p.name} (@{p.instagram}){p.source === 'analysis' ? ' • análise' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Roteiro</label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
              value={scriptId}
              onChange={e => setScriptId(e.target.value)}
              disabled={!profileId}
            >
              <option value="">Selecionar roteiro</option>
              {scripts.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.type})</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleCreate}
            disabled={!profileId || !scriptId || loading}
            className="w-full"
          >
            {loading ? 'Criando...' : 'Criar Estratégia'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
