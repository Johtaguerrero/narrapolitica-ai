export function exportStrategyTxt(data: {
  profileName?: string
  instagram?: string
  scriptTitle?: string
  theme?: string
  videoType?: string
  recordingDate?: string | null
  recordingLocation?: string
  participants?: Array<{ name: string; role: string }>
  interviewees?: Array<{ name: string; profile: string; mainQuestion: string }>
  centralMessage?: string
  visualHook?: string
  firstLine?: string
  objective?: string
  intervieweeQuestions?: string
  equipment?: string
  notes?: string
  caption?: string
  hashtags?: string
}) {
  const lines = [
    'NARRATIVA AI — ESTRATÉGIA DE MONTAGEM',
    '═══════════════════════════════════════',
    '',
    `Perfil: ${data.profileName || ''}`,
    `Instagram: ${data.instagram || ''}`,
    `Roteiro: ${data.scriptTitle || ''}`,
    `Tema: ${data.theme || ''}`,
    `Tipo de vídeo: ${data.videoType || ''}`,
    `Data de gravação: ${data.recordingDate || ''}`,
    `Local: ${data.recordingLocation || ''}`,
    '',
    'Pessoas envolvidas:',
    ...(data.participants?.map(p => `  - ${p.name} (${p.role})`) || ['  (nenhum)']),
    '',
    'Entrevistados:',
    ...(data.interviewees?.map(i => `  - ${i.name} — ${i.profile || ''} — ${i.mainQuestion || ''}`) || ['  (nenhum)']),
    '',
    `Mensagem central: ${data.centralMessage || ''}`,
    `Gancho visual: ${data.visualHook || ''}`,
    `Primeira frase: ${data.firstLine || ''}`,
    `Estratégia de filmagem: ${data.objective || ''}`,
    `Perguntas: ${data.intervieweeQuestions || ''}`,
    `Equipamentos: ${data.equipment || ''}`,
    `Observações: ${data.notes || ''}`,
    '',
    'Legenda:',
    data.caption || '',
    '',
    'Hashtags:',
    data.hashtags || '',
  ]

  return lines.join('\n')
}
