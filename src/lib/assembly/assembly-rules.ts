import type { AssemblyStrategyData } from '@/types/assembly'

export function canAddInterviewee(strategy: Pick<AssemblyStrategyData, 'videoType'>) {
  return strategy.videoType !== 'solo'
}

export function hasSoloVideo(strategy: Pick<AssemblyStrategyData, 'videoType'>) {
  return strategy.videoType === 'solo'
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    rascunho: 'Rascunho',
    planejamento: 'Em planejamento',
    pronto: 'Pronto para gravar',
    gravado: 'Gravado',
    edicao: 'Em edição',
    publicado: 'Publicado',
    arquivado: 'Arquivado',
  }
  return labels[status] || status
}
