'use client'

type AnalysisData = {
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
}

interface Props {
  analysis?: AnalysisData | null
  loading?: boolean
}

export function TerritoryAnalysisPanel({ analysis = null, loading = false }: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
        <div className="h-3 w-full bg-zinc-800 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse" />
      </div>
    )
  }

  if (!analysis || analysis.status === 'WAITING') {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
        <p className="text-xs text-zinc-500">Nenhuma análise disponível. Adicione contexto e clique em "Analisar território".</p>
      </div>
    )
  }

  const section = (label: string, content?: string | null) => {
    if (!content) return null
    return (
      <div className="space-y-1">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</h4>
        <p className="text-sm text-zinc-300 whitespace-pre-wrap">{content}</p>
      </div>
    )
  }

  const listSection = (label: string, content?: string | null) => {
    if (!content) return null
    const items = content.split('\n').filter(Boolean)
    return (
      <div className="space-y-1">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</h4>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-0.5">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Análise Territorial</h3>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
          analysis.status === 'READY' ? 'bg-emerald-900/50 text-emerald-400' :
          analysis.status === 'INSUFFICIENT_DATA' ? 'bg-amber-900/50 text-amber-400' :
          'bg-zinc-800 text-zinc-400'
        }`}>
          {analysis.status === 'READY' ? 'Pronto' :
           analysis.status === 'INSUFFICIENT_DATA' ? 'Dados insuficientes' :
           analysis.status || 'Pendente'}
        </span>
      </div>

      {section('Resumo', analysis.territorySummary)}
      {section('Contexto', analysis.contextSummary)}
      {section('Situação central', analysis.mainTheme)}
      {listSection('Temas secundários', analysis.secondaryThemes)}
      {listSection('Problemas identificados', analysis.identifiedProblems)}
      {listSection('Oportunidades', analysis.opportunities)}
      {listSection('Atores envolvidos', analysis.involvedActors)}
      {listSection('Sensibilidades locais', analysis.localSensitivities)}
      {listSection('Vocabulário recomendado', analysis.recommendedVocabulary)}
      {listSection('Termos a evitar', analysis.termsToAvoid)}
      {section('Ângulo narrativo', analysis.narrativeAngle)}
      {section('Gancho sugerido', analysis.suggestedHook)}
      {section('Mensagem central', analysis.centralMessage)}
      {section('Abordagem recomendada', analysis.recommendedApproach)}
      {section('Sugestão de cenário', analysis.scenarioSuggestion)}
      {listSection('Pontos de gravação', analysis.recordingPoints)}
      {section('Mini-narrativa', analysis.shortNarrative)}
      {listSection('Fatos a verificar', analysis.factsToVerify)}

      {analysis.confidence != null && (
        <div className="pt-2 border-t border-zinc-800">
          <span className="text-[11px] text-zinc-500">
            Confiança da análise: {Math.round(analysis.confidence * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
