export function exportTerritoryAnalysisTxt(data: {
  regionName?: string
  territoryName?: string
  contextSummary?: string
  mainTheme?: string
  identifiedProblems?: string
  opportunities?: string
  recommendedVocabulary?: string
  termsToAvoid?: string
  suggestedHook?: string
  centralMessage?: string
  narrativeAngle?: string
  shortNarrative?: string
  factsToVerify?: string
  recordingPoints?: string
  scenarioSuggestion?: string
}) {
  const lines = [
    'NARRATIVA AI — ANÁLISE TERRITORIAL',
    '═══════════════════════════════════════',
    '',
    `Região: ${data.regionName || ''}`,
    `Território: ${data.territoryName || ''}`,
    '',
    'Resumo do contexto:',
    data.contextSummary || '(sem contexto)',
    '',
    `Tema principal: ${data.mainTheme || ''}`,
    '',
    'Problemas identificados:',
    data.identifiedProblems || '(nenhum)',
    '',
    'Oportunidades:',
    data.opportunities || '(nenhuma)',
    '',
    'Vocabulário recomendado:',
    data.recommendedVocabulary || '(nenhum)',
    '',
    'Termos a evitar:',
    data.termsToAvoid || '(nenhum)',
    '',
    `Gancho sugerido: ${data.suggestedHook || ''}`,
    `Mensagem central: ${data.centralMessage || ''}`,
    `Ângulo narrativo: ${data.narrativeAngle || ''}`,
    '',
    'Mini-narrativa:',
    data.shortNarrative || '(não gerada)',
    '',
    'Fatos a verificar:',
    data.factsToVerify || '(nenhum)',
    '',
    'Pontos de gravação:',
    data.recordingPoints || '(nenhum)',
    '',
    `Sugestão de cenário: ${data.scenarioSuggestion || ''}`,
  ]

  return lines.join('\n')
}
