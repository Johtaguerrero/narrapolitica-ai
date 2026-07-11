'use client'

import { useState } from 'react'

interface Props {
  initialContext?: string
  onSave: (context: string, objectives: string[]) => void
  onAnalyze?: () => void
  isAnalyzing?: boolean
}

const OBJECTIVE_OPTIONS: { value: string; label: string }[] = [
  { value: 'apresentar_problema', label: 'Apresentar problema local' },
  { value: 'valorizar_territorio', label: 'Valorizar o território' },
  { value: 'contar_historia_local', label: 'Contar história local' },
  { value: 'registrar_visita', label: 'Registrar visita' },
  { value: 'mostrar_acao', label: 'Mostrar ação realizada' },
  { value: 'apresentar_proposta', label: 'Apresentar proposta' },
  { value: 'explicar_politica_publica', label: 'Explicar política pública' },
  { value: 'prestar_contas', label: 'Prestar contas' },
  { value: 'ouvir_comunidade', label: 'Ouvir a comunidade' },
  { value: 'convidar_dialogo', label: 'Convidar ao diálogo' },
  { value: 'divulgar_evento', label: 'Divulgar evento' },
  { value: 'divulgar_projeto_social', label: 'Divulgar projeto social' },
  { value: 'abordar_infraestrutura', label: 'Abordar infraestrutura' },
  { value: 'abordar_mobilidade', label: 'Abordar mobilidade' },
  { value: 'abordar_saude', label: 'Abordar saúde' },
  { value: 'abordar_educacao', label: 'Abordar educação' },
  { value: 'abordar_seguranca_comunitaria', label: 'Abordar segurança comunitária' },
]

export function TerritoryContextEditor({ initialContext, onSave, onAnalyze, isAnalyzing }: Props) {
  const [context, setContext] = useState(initialContext || '')
  const [objectives, setObjectives] = useState<string[]>([])

  const toggleObjective = (value: string) => {
    setObjectives(prev =>
      prev.includes(value) ? prev.filter(o => o !== value) : [...prev, value]
    )
  }

  const handleSave = () => {
    onSave(context, objectives)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Contexto do território
        </label>
        <textarea
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500"
          rows={5}
          placeholder="Descreva a situação local, o que está acontecendo nesta região, dados relevantes, percepções da comunidade..."
          value={context}
          onChange={e => setContext(e.target.value)}
        />
        <p className="text-[11px] text-zinc-500">
          {context.length} caracteres {context.length < 20 ? '(mínimo 20 para análise)' : ''}
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Objetivos territoriais
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {OBJECTIVE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggleObjective(opt.value)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                objectives.includes(opt.value)
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          Salvar contexto
        </button>
        {onAnalyze && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || context.length < 20}
            className="px-4 py-2 rounded-lg bg-violet-600 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analisando...' : 'Analisar território'}
          </button>
        )}
      </div>
    </div>
  )
}
