import type { ScriptFormData, GeneratedScript } from "@/types";

const speechOpeners: Record<string, string[]> = {
  gancho_forte: [
    "Senhoras e senhores, estamos diante de um momento que exige decisão.",
    "O que está em jogo não é pequeno. É o futuro que a gente quer construir.",
  ],
  historia_pessoal: [
    "Eu venho de onde vocês vêm. E é por isso que estou aqui.",
    "Deixa eu contar de onde eu tirei a força pra estar aqui hoje.",
  ],
  manifesto: [
    "Eu não vim aqui fazer promessas. Vim fazer um compromisso.",
    "Chegou a hora de dizer o que ninguém quer ouvir, mas precisa ser dito.",
  ],
};

const closingStatements = [
  "Porque política se faz com coragem, verdade e amor ao próximo.",
  "Que a gente saia daqui com a certeza de que o trabalho só começou.",
  "Obrigado pela confiança. A resposta será trabalho.",
  "Juntos, a gente chega mais longe. E a gente vai chegar.",
];

export function generateSpeechScript(formData: ScriptFormData): GeneratedScript {
  const themeLabel = formData.theme.replace(/_/g, " ");
  const styleLabel = formData.style.replace(/_/g, " ");

  const isLong = formData.duration === "5min" || formData.duration === "10min";
  const isMedium = formData.duration === "3min";

  const openerPool = speechOpeners[formData.format || "gancho_forte"] || speechOpeners.gancho_forte;
  const opener = openerPool[Math.floor(Math.random() * openerPool.length)];

  const title = `Discurso: ${themeLabel} - ${formData.duration} - ${styleLabel}`;

  const durationMap: Record<string, { words: number; pauses: string }> = {
    "15s": { words: 40, pauses: "" },
    "30s": { words: 80, pauses: "\n[PAUSA — 1s]" },
    "45s": { words: 120, pauses: "\n[PAUSA — 2s]" },
    "1min": { words: 180, pauses: "\n[PAUSA — 2s]" },
    "3min": { words: 500, pauses: "\n[PAUSA — 3s]\n[RESPIRAÇÃO]" },
    "5min": { words: 850, pauses: "\n[PAUSA — 3s]\n[RESPIRAÇÃO]\n[PAUSA — 2s]" },
    "10min": { words: 1700, pauses: "\n[PAUSA — 5s]\n[RESPIRAÇÃO PROFUNDA]\n[PAUSA — 3s]" },
  };

  const config = durationMap[formData.duration] || durationMap["1min"];

  const body = `${opener}\n\n` +
    `[DIR: ${formData.style === "natural_rua" ? "Tom coloquial, gestos abertos" :
      formData.style === "institucional_leve" ? "Tom formal porém acessível" :
      formData.style === "emocional" ? "Voz embargada, olhar no horizonte" :
      "Tom direto e firme"}]\n\n` +
    `Eu quero falar diretamente sobre ${themeLabel}. Não como quem discursa, mas como quem conversa.\n\n` +
    `${config.pauses}\n\n` +
    `A gente sabe que ${themeLabel} não é pauta de um dia. É compromisso de cada instante. ` +
    `E é por isso que estou aqui: pra reafirmar que esse tema está no centro das nossas prioridades.\n\n` +
    `[PAUSA — 2s]\n\n` +
    `Não vim com promessas vazias. Vim com propostas construídas no diálogo, com a escuta de quem vive ` +
    `a realidade todos os dias. Porque política pública de verdade se faz com participação.\n\n` +
    (isLong || isMedium ? `${config.pauses}\n\n` +
      `É importante a gente lembrar que cada avanço, por menor que pareça, ` +
      `representa a vida de alguém que foi impactada positivamente. ` +
      `E é por essas pessoas que a gente está aqui.\n\n` +
      `[PAUSA — 2s]\n\n` +
      `Mas também precisamos ser honestos sobre os desafios. ` +
      `Nada é simples quando se trata de transformar realidades. ` +
      `O que nos move não é a ilusão, mas a determinação.` : "") +
    `${isLong ? `\n\n${config.pauses}\n\n` +
      `Quero aproveitar pra responder algumas perguntas que tenho recebido. ` +
      `Sobre prazos: a gente sabe que a pressa é inimiga da qualidade. ` +
      `Mas também sabemos que não podemos parar.\n\n` +
      `[PAUSA — 2s]\n\n` +
      `Sobre parcerias: a gente não faz nada sozinho. Cada mão que se junta ` +
      `fortalece o que a gente constrói. E é de mãos dadas que a gente vai mais longe.\n\n` +
      `[PAUSA — 2s]\n\n` +
      `Sobre o futuro: ele começa agora. Nas pequenas decisões, ` +
      `nos gestos de cuidado, na escuta atenta.\n\n` +
      `[PAUSA — 3s]` : ""}` +
    `\n\n[ENCERRAMENTO]\n\n` +
    `${closingStatements[Math.floor(Math.random() * closingStatements.length)]}`;

  const shortVersion = `${opener}\n\n` +
    `${themeLabel} é prioridade. E a gente prova com trabalho, não com palavras.\n\n` +
    `${closingStatements[0]}`;

  const emotionalVersion = `${opener}\n\n` +
    `[VOZ EMBARGADA]\n\n` +
    `Eu olho pra trás e vejo o caminho que a gente percorreu. ` +
    `Não foi fácil. Mas cada lágrima, cada luta, valeu a pena.\n\n` +
    `[PAUSA — 3s]\n\n` +
    `Porque ${themeLabel} não é sobre estatística. É sobre pessoas. ` +
    `E pessoas são feitas de histórias, de sonhos, de luta.`;

  const institutionalVersion = `${opener}\n\n` +
    `[TOM INSTITUCIONAL]\n\n` +
    `Declaro publicamente o compromisso desta gestão com ${themeLabel}. ` +
    `Com base em evidências, planejamento e diálogo institucional, ` +
    `reafirmamos nossa responsabilidade com a população.\n\n` +
    `Seguimos trabalhando com transparência e dedicação.`;

  const hashtags = `#${themeLabel.replace(/\s+/g, "")} #Discurso #Política #Cidadania #Transparência #${formData.style.replace(/_/g, "")}`;

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    hook: opener,
    fullScript: body,
    pauseMarks: config.pauses,
    cameraDir: "Câmera frontal, enquadramento médio",
    sceneSuggestion: "Palco, tribuna ou espaço de fala pública",
    captionSuggestion:
      "Discurso na íntegra sobre " +
      themeLabel +
      ". Comunicação transparente e responsável.",
    ctaSuggestion:
      "Compartilhe este discurso com quem precisa ouvir esta mensagem. " +
      "A política se fortalece com participação.",
    hashtags,
    shortVersion,
    emotionalVersion,
    institutionalVersion,
  };
}
