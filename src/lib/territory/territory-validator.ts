export function generateTimeConfig(targetDuration: string) {
  const speeds = {
    '15s': { speechRate: 'rapida' as const, wordsPerMinute: 180, targetWords: 45 },
    '30s': { speechRate: 'natural' as const, wordsPerMinute: 160, targetWords: 80 },
    '45s': { speechRate: 'natural' as const, wordsPerMinute: 150, targetWords: 112 },
    '60s': { speechRate: 'natural' as const, wordsPerMinute: 145, targetWords: 145 },
    '90s': { speechRate: 'reflexiva' as const, wordsPerMinute: 140, targetWords: 210 },
    '2min': { speechRate: 'reflexiva' as const, wordsPerMinute: 135, targetWords: 270 },
  }

  return speeds[targetDuration as keyof typeof speeds] || speeds['30s']
}

export function validateTerritorialObjectives(objectives: string[]): string[] {
  const valid = [
    'apresentar_problema', 'valorizar_territorio', 'contar_historia_local',
    'registrar_visita', 'mostrar_acao', 'apresentar_proposta',
    'explicar_politica_publica', 'prestar_contas', 'ouvir_comunidade',
    'convidar_dialogo', 'divulgar_evento', 'divulgar_projeto_social',
    'valorizar_artistas_locais', 'valorizar_comerciantes_locais',
    'destacar_juventude', 'abordar_mobilidade', 'abordar_saude',
    'abordar_educacao', 'abordar_cultura', 'abordar_seguranca_comunitaria',
    'abordar_infraestrutura', 'criar_identificacao_territorial',
    'contextualizar_discurso',
  ]

  return objectives.filter(o => valid.includes(o))
}

export function canAnalyzeTerritory(contextText: string): boolean {
  return contextText.trim().length >= 20
}

export function isAnalysisExpired(analyzedAt: Date | null, expiresAt: Date | null): boolean {
  if (!analyzedAt || !expiresAt) return true
  return new Date() > expiresAt
}

export function getAnalysisStatus(depth: string, contextLength: number): string {
  if (contextLength < 20) return 'INSUFFICIENT_DATA'
  if (depth === 'profunda' && contextLength < 100) return 'INSUFFICIENT_DATA'
  return 'READY'
}
