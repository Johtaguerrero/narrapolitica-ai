export type TerritoryStatus = 'ACTIVE' | 'PENDING' | 'HISTORICAL' | 'INACTIVE'

export type AnalysisStatus =
  | 'WAITING'
  | 'COLLECTING_CONTEXT'
  | 'ANALYZING'
  | 'VERIFYING'
  | 'READY'
  | 'INSUFFICIENT_DATA'
  | 'ERROR'
  | 'OUTDATED'

export type AnalysisDepth = 'superficial' | 'moderada' | 'profunda'

export type SourceType = 'USER_PROVIDED' | 'DATABASE' | 'PUBLIC_SOURCE' | 'AI_INFERENCE' | 'UNVERIFIED'

export type TerritorialObjective =
  | 'apresentar_problema'
  | 'valorizar_territorio'
  | 'contar_historia_local'
  | 'registrar_visita'
  | 'mostrar_acao'
  | 'apresentar_proposta'
  | 'explicar_politica_publica'
  | 'prestar_contas'
  | 'ouvir_comunidade'
  | 'convidar_dialogo'
  | 'divulgar_evento'
  | 'divulgar_projeto_social'
  | 'valorizar_artistas_locais'
  | 'valorizar_comerciantes_locais'
  | 'destacar_juventude'
  | 'abordar_mobilidade'
  | 'abordar_saude'
  | 'abordar_educacao'
  | 'abordar_cultura'
  | 'abordar_seguranca_comunitaria'
  | 'abordar_infraestrutura'
  | 'criar_identificacao_territorial'
  | 'contextualizar_discurso'
  | 'outro'

export interface TerritoryAnalysisResult {
  territorySummary: string
  contextSummary: string
  mainTheme: string
  secondaryThemes: string[]
  centralSituation: string
  identifiedProblems: string[]
  identifiedOpportunities: string[]
  involvedActors: string[]
  mentionedInstitutions: string[]
  relatedPublic: string[]
  localSensitivities: string[]
  recommendedVocabulary: string[]
  termsToAvoid: string[]
  narrativeAngle: string
  suggestedHook: string
  centralMessage: string
  recommendedApproach: string
  scenarioSuggestion: string
  recordingPoints: string[]
  confirmedFacts: string[]
  userProvidedFacts: string[]
  aiInferences: string[]
  factsToVerify: string[]
  generalizationRisks: string[]
  communicationRisks: string[]
  shortNarrative: string
  sourcesUsed: string[]
  confidence: number
}

export interface TerritoryNarrativeRequest {
  profileName: string
  regionName: string
  localityName?: string
  context: string
  mainTheme: string
  objectives: TerritorialObjective[]
  analysis?: TerritoryAnalysisResult
  format: NarrativeFormat
  targetDuration: string
}

export type NarrativeFormat =
  | 'gancho_territorial_10s'
  | 'micro_narrativa_15_25s'
  | 'narrativa_curta_30s'
  | 'narrativa_45s'
  | 'narrativa_1min'
  | 'introducao_discurso'
  | 'abertura_reels'
  | 'contextualizacao_legenda'
  | 'texto_visita_territorial'
  | 'texto_prestacao_contas'
  | 'texto_video_moradores'
  | 'texto_video_solo'

export interface TerritoryTimeConfig {
  speechRate: 'rapida' | 'natural' | 'reflexiva'
  wordsPerMinute: number
  targetWords: number
  toleranceMin: number
  toleranceMax: number
}
