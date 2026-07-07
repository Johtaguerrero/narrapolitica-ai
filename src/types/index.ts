export type ContentType =
  | "reels"
  | "discurso_curto"
  | "discurso_medio"
  | "discurso_longo"
  | "texto_instagram"
  | "legenda"
  | "carrossel"
  | "resposta_comentario"
  | "fala_bastidor"
  | "video_rua"
  | "video_institucional"
  | "video_emocional"
  | "video_prestacao_contas";

export type Duration =
  | "15s"
  | "30s"
  | "45s"
  | "1min"
  | "3min"
  | "5min"
  | "10min";

export type SpeechStyle =
  | "natural_rua"
  | "institucional_leve"
  | "popular_direto"
  | "emocional"
  | "tecnico_acessivel"
  | "juventude_cultura"
  | "periferia_respeito"
  | "fe_familia_comunidade"
  | "prestacao_contas"
  | "critica_sem_ataque"
  | "propositivo"
  | "bastidor_real"
  | "lideranca_tranquila";

export type Theme =
  | "cultura"
  | "juventude"
  | "educacao"
  | "saude"
  | "seguranca"
  | "emprego"
  | "moradia"
  | "mobilidade"
  | "esporte"
  | "mulher"
  | "familia"
  | "empreendedorismo"
  | "periferia"
  | "transparencia"
  | "comunidade"
  | "combate_fome"
  | "projetos_sociais";

export type ScriptFormat =
  | "gancho_forte"
  | "historia_pessoal"
  | "problema_solucao"
  | "pergunta_provocativa"
  | "bastidor"
  | "depoimento"
  | "manifesto"
  | "prestacao_contas"
  | "convite_participacao";

export type Objective =
  | "conscientizar"
  | "informar"
  | "mobilizar"
  | "engajar"
  | "prestar_contas"
  | "inspirar"
  | "educar"
  | "dialogar";

export type ReelStatus =
  | "ideia"
  | "roteirizado"
  | "gravado"
  | "editado"
  | "publicado"
  | "arquivado";

export interface AnalysisData {
  publicName?: string;
  username?: string;
  bioSummary?: string;
  detectedTone?: string;
  frequentThemes?: string;
  probableAudience?: string;
  strengths?: string;
  weaknesses?: string;
  contentOpportunities?: string;
  communicationRisks?: string;
  hashtagSuggestions?: string;
}

export interface ScriptFormData {
  type: ContentType;
  duration: Duration;
  style: SpeechStyle;
  theme: Theme;
  format?: ScriptFormat;
  profileId?: string;
  instagramAnalysisId?: string;
  analysisData?: AnalysisData;
  modoLivre?: boolean;
  modoLivreData?: {
    name?: string;
    theme?: string;
    audience?: string;
    tone?: string;
    goal?: string;
  };
  objective?: Objective;
}

export interface InstagramAnalysisData {
  instagramHandle: string;
  postLinks: string;
  manualDesc: string;
  mainThemes: string;
  publicComments: string;
  strengths: string;
  weaknesses: string;
  profileId?: string;
}

export interface GeneratedScript {
  title: string;
  hook: string;
  fullScript: string;
  pauseMarks: string;
  cameraDir: string;
  sceneSuggestion: string;
  captionSuggestion: string;
  ctaSuggestion: string;
  hashtags: string;
  shortVersion: string;
  emotionalVersion: string;
  institutionalVersion: string;
  scriptText?: string;
  captionText?: string;
  cta?: string;
  scenarioSuggestion?: string;
  framingSuggestion?: string;
  strategicNotes?: string;
  estimatedWords?: number;
}
