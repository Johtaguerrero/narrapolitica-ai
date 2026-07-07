interface ExportData {
  profileName?: string | null;
  instagramUsername?: string | null;
  title: string;
  theme: string;
  contentType: string;
  duration: string;
  estimatedWords?: number;
  style: string;
  objective: string;
  scriptText: string;
  captionText: string;
  hashtags: string;
  cta?: string;
  scenarioSuggestion?: string;
  framingSuggestion?: string;
  strategicNotes?: string;
}

const labelMap: Record<string, string> = {
  reels: "Reels",
  discurso_curto: "Discurso curto",
  discurso_medio: "Discurso médio",
  discurso_longo: "Discurso longo",
  video_rua: "Vídeo de rua",
  video_institucional: "Vídeo institucional",
  video_emocional: "Vídeo emocional",
  video_prestacao_contas: "Prestação de contas",
  legenda: "Legenda",
  carrossel: "Carrossel",
  texto_instagram: "Texto para Instagram",
  resposta_comentario: "Resposta para comentário",
  fala_bastidor: "Fala de bastidor",
  "15s": "15 segundos",
  "30s": "30 segundos",
  "45s": "45 segundos",
  "1min": "1 minuto",
  "3min": "3 minutos",
  "5min": "5 minutos",
  "10min": "10 minutos",
};

function label(value: string): string {
  return labelMap[value] || value.replace(/_/g, " ");
}

export function exportScriptTxt(data: ExportData): string {
  const lines = [
    "=".repeat(50),
    "NARRATIVA AI",
    "=".repeat(50),
    "",
    `Perfil: ${data.profileName || "Não informado"}`,
    `Instagram: ${data.instagramUsername ? `@${data.instagramUsername}` : "Não informado"}`,
    `Tema: ${label(data.theme)}`,
    `Tipo: ${label(data.contentType)}`,
    `Tempo: ${label(data.duration)}`,
    `Palavras estimadas: ${data.estimatedWords || "—"}`,
    `Estilo: ${label(data.style)}`,
    `Objetivo: ${data.objective || "Não informado"}`,
    "",
    "=".repeat(50),
    "ROTEIRO PARA LEITURA CONTÍNUA",
    "=".repeat(50),
    "",
    data.scriptText,
    "",
    "=".repeat(50),
    "LEGENDA PARA POSTAGEM",
    "=".repeat(50),
    "",
    data.captionText,
    "",
    "=".repeat(50),
    "CTA",
    "=".repeat(50),
    "",
    data.cta || "",
    "",
    "=".repeat(50),
    "OBSERVAÇÕES",
    "=".repeat(50),
    "",
    `Cenário sugerido: ${data.scenarioSuggestion || "Não informado"}`,
    `Enquadramento: ${data.framingSuggestion || "Não informado"}`,
    "",
    data.strategicNotes || "Nenhuma observação adicional.",
    "",
    "=".repeat(50),
    "Gerado por NarraPolítica AI",
    "=".repeat(50),
  ];

  return lines.join("\n");
}

export function downloadScriptTxt(data: ExportData): void {
  const content = exportScriptTxt(data);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `roteiro-${data.theme}-${data.contentType}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
