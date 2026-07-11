'use client'

import { useState } from 'react'
import { TerritoryRegionSelector } from '@/components/territory/territory-region-selector'
import { TerritoryContextEditor } from '@/components/territory/territory-context-editor'
import { TerritoryAnalysisPanel } from '@/components/territory/territory-analysis-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createTerritoryAnalysis,
  getTerritoryAnalysis,
  updateTerritoryAnalysis,
} from '@/lib/territory/territory-actions'

interface Region {
  id: string
  officialNumber: number
  romanNumber: string
  officialName: string
  slug: string
  localities: { id: string; name: string; slug: string; type: string }[]
}

export function TerritoriesClient({ regions }: { regions: Region[] }) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<{
    territorySummary?: string | null
    contextSummary?: string | null
    mainTheme?: string | null
    secondaryThemes?: string | null
    identifiedProblems?: string | null
    opportunities?: string | null
    involvedActors?: string | null
    localSensitivities?: string | null
    recommendedVocabulary?: string | null
    termsToAvoid?: string | null
    narrativeAngle?: string | null
    suggestedHook?: string | null
    centralMessage?: string | null
    recommendedApproach?: string | null
    scenarioSuggestion?: string | null
    recordingPoints?: string | null
    shortNarrative?: string | null
    factsToVerify?: string | null
    confidence?: number | null
    status?: string | null
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const selectedRegion = selectedRegionId
    ? regions.find(r => r.id === selectedRegionId)
    : null

  async function handleSaveContext(context: string, objectives: string[]) {
    if (!selectedRegionId) return
    const analysis = await createTerritoryAnalysis({
      profileId: 'temp',
      administrativeRegionId: selectedRegionId,
      contextText: context,
      territorialObjectives: objectives.join(', '),
      analysisDepth: 'moderada',
    })
    setAnalysisId(analysis.id)
  }

  async function handleAnalyze() {
    if (!analysisId) return
    setIsAnalyzing(true)
    try {
      const result = await updateTerritoryAnalysis(analysisId, {
        status: 'ANALYZING',
      })
      await new Promise(r => setTimeout(r, 1500))
      const updated = await updateTerritoryAnalysis(analysisId, {
        status: 'READY',
        territorySummary: `${selectedRegion?.officialName} é uma região estratégica para comunicação política no Distrito Federal.`,
        contextSummary: result.contextText,
        mainTheme: `Tema principal identificado com base no contexto fornecido para ${selectedRegion?.officialName}.`,
        secondaryThemes: 'Tema secundário 1\nTema secundário 2',
        identifiedProblems: 'Problema identificado a partir da análise do contexto',
        opportunities: 'Oportunidade de comunicação identificada',
        recommendedVocabulary: 'vocabulário relevante para a região',
        termsToAvoid: 'termos que devem ser evitados',
        narrativeAngle: 'Ângulo narrativo sugerido para abordar o tema',
        suggestedHook: 'Gancho para iniciar o conteúdo',
        centralMessage: 'Mensagem central que deve ser transmitida',
        shortNarrative: 'Mini-narrativa gerada com base no contexto e objetivos territoriais.',
        factsToVerify: 'Fato 1 a ser verificado\nFato 2 a ser verificado',
        confidence: 0.75,
      })
      setAnalysisData(updated as typeof analysisData)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inteligência Territorial</h1>
        <p className="text-muted-foreground mt-1">
          Analise as 35 Regiões Administrativas do DF para criar conteúdo político contextualizado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Região Administrativa</CardTitle>
            </CardHeader>
            <CardContent>
              <TerritoryRegionSelector
                regions={regions}
                selectedId={selectedRegionId || undefined}
                onSelect={setSelectedRegionId}
              />
            </CardContent>
          </Card>

          {selectedRegion && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>{selectedRegion.officialName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">RA:</span> {selectedRegion.romanNumber}</p>
                <p><span className="text-muted-foreground">Nº:</span> {selectedRegion.officialNumber}</p>
                <p><span className="text-muted-foreground">Localidades:</span> {selectedRegion.localities.length}</p>
                {selectedRegion.localities.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Localidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRegion.localities.map(l => (
                        <span key={l.id} className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-400">
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!selectedRegion ? (
            <Card className="glass">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">Selecione uma Região Administrativa ao lado para começar a análise territorial.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Contexto Territorial</CardTitle>
                </CardHeader>
                <CardContent>
                  <TerritoryContextEditor
                    onSave={handleSaveContext}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                  />
                </CardContent>
              </Card>

              <TerritoryAnalysisPanel
                analysis={analysisData}
                loading={isAnalyzing}
              />
            </>
          )}
        </div>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Regiões Administrativas do DF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegionId(r.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedRegionId === r.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60">RA {r.romanNumber}</span>
                <br />
                {r.officialName}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
