export interface AssemblyCanvasCard {
  id: string
  type: string
  title: string
  content: string
  x: number
  y: number
  width: number
  height: number
  position: number
  color: string
  metadata: string
}

export interface AssemblyParticipantData {
  id: string
  name: string
  role: string
  phone: string
  instagram: string
  responsibility: string
  status: 'confirmado' | 'pendente' | 'cancelado'
}

export interface AssemblyIntervieweeData {
  id: string
  name: string
  profile: string
  speechTheme: string
  mainQuestion: string
  supportQuestions: string
  imageAuthorizationStatus: 'sim' | 'nao' | 'pendente'
  status: 'confirmado' | 'pendente' | 'cancelado'
}

export interface AssemblyStrategyData {
  id: string
  profileId: string | null
  scriptId: string | null
  title: string
  videoType: string
  objective: string
  centralMessage: string
  visualHook: string
  firstLine: string
  recordingLocation: string
  recordingAddress: string
  recordingDate: string | null
  recordingTime: string | null
  postingDate: string | null
  postingTime: string | null
  status: string
  notes: string
  canvasItems: AssemblyCanvasCard[]
  participants: AssemblyParticipantData[]
  interviewees: AssemblyIntervieweeData[]
}

export type VideoType =
  | 'solo'
  | 'entrevistado'
  | 'equipe'
  | 'populacao'
  | 'bastidor'
  | 'rua'
  | 'institucional'
  | 'evento'

export type StrategyStatus =
  | 'rascunho'
  | 'planejamento'
  | 'pronto'
  | 'gravado'
  | 'edicao'
  | 'publicado'
  | 'arquivado'

export const SHORTLIST_ITEMS = [
  { type: 'gancho_inicial', label: 'Gancho inicial' },
  { type: 'cena_principal', label: 'Cena principal' },
  { type: 'cena_apoio', label: 'Cena de apoio' },
  { type: 'bastidor', label: 'Bastidor' },
  { type: 'entrevistado', label: 'Entrevistado' },
  { type: 'fala_solo', label: 'Fala solo' },
  { type: 'corte_emocional', label: 'Corte emocional' },
  { type: 'pergunta_rua', label: 'Pergunta de rua' },
  { type: 'cta', label: 'Chamada para ação' },
  { type: 'legenda', label: 'Legenda' },
  { type: 'hashtags', label: 'Hashtags' },
  { type: 'local', label: 'Local' },
  { type: 'participante', label: 'Participante' },
  { type: 'equipamento', label: 'Equipamento' },
  { type: 'observacao', label: 'Observação' },
  { type: 'data_gravacao', label: 'Data de gravação' },
  { type: 'data_postagem', label: 'Data de postagem' },
]

export const STRATEGY_STATUS_OPTIONS: { value: StrategyStatus; label: string }[] = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'planejamento', label: 'Em planejamento' },
  { value: 'pronto', label: 'Pronto para gravar' },
  { value: 'gravado', label: 'Gravado' },
  { value: 'edicao', label: 'Em edição' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'arquivado', label: 'Arquivado' },
]

export const VIDEO_TYPE_OPTIONS: { value: VideoType; label: string }[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'entrevistado', label: 'Com entrevistado' },
  { value: 'equipe', label: 'Com equipe' },
  { value: 'populacao', label: 'Com população' },
  { value: 'bastidor', label: 'Bastidor' },
  { value: 'rua', label: 'Rua' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'evento', label: 'Evento' },
]
