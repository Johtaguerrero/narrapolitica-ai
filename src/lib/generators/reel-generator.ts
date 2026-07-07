import type { ScriptFormData, GeneratedScript } from "@/types";

const hooks: Record<string, string[]> = {
  gancho_forte: [
    "Você sabia que [tema] impacta diretamente a sua vida?",
    "O que você faria se [problema] acontecesse com você?",
    "Isso aqui vai mudar a forma como você vê [tema].",
  ],
  historia_pessoal: [
    "Eu vou te contar uma história que pouca gente conhece.",
    "Quando eu era criança, eu via [situação] e pensava: isso precisa mudar.",
    "Deixa eu te contar como tudo começou.",
  ],
  problema_solucao: [
    "Tem um problema que afeta [público] todo dia. A solução é mais simples do que parece.",
    "Você já passou por [situação]? Pois é, a gente resolveu assim.",
  ],
  pergunta_provocativa: [
    "Se você pudesse mudar uma coisa agora, o que seria?",
    "Quem decide por você?",
    "O que [tema] tem a ver com a sua vida?",
  ],
  bastidor: [
    "O que pouca gente vê por trás de [ação].",
    "Bastidor de uma decisão que vai impactar sua vida.",
  ],
  depoimento: [
    "Eu ouvi de [pessoa] uma história que nunca vou esquecer.",
    "Deixa eu compartilhar o que [pessoa] me disse hoje.",
  ],
  manifesto: [
    "Chega de [problema]. A gente merece mais.",
    "Eu acredito em [valor]. E por isso estou aqui.",
  ],
  prestacao_contas: [
    "Prometemos e fizemos. Vem ver.",
    "No começo do mandato era assim. Agora está assim.",
  ],
  convite_participacao: [
    "Eu quero te convidar pra fazer parte de algo maior.",
    "Sua opinião importa. Vem construir com a gente.",
  ],
};

const styleDirections: Record<string, string> = {
  natural_rua: "Câmera na mão, movimentos naturais, olhar direto pra câmera",
  institucional_leve: "Câmera fixa, enquadramento médio, tom sereno",
  popular_direto: "Câmera próxima, gestos com as mãos, linguagem corporal aberta",
  emocional: "Close no rosto, luz suave, pausas dramáticas",
  tecnico_acessivel: "Gráficos de apoio, câmera estável, tom explicativo",
  juventude_cultura: "Câmera dinâmica, cortes rápidos, linguagem visual jovem",
  periferia_respeito: "Cenário de rua, pessoas reais, tom de pertencimento",
  fe_familia_comunidade: "Ambiente familiar, tom acolhedor, valores coletivos",
  prestacao_contas: "Câmera fixa, fundo institucional, dados visuais",
  critica_sem_ataque: "Tom moderado, câmera frontal, argumentos claros",
  propositivo: "Enquadramento aberto, linguagem de futuro, otimismo",
  bastidor_real: "Câmera observadora, movimentos reais, sem roteiro aparente",
  lideranca_tranquila: "Câmera no nível dos olhos, tom firme e calmo",
};

const sceneSuggestions: Record<string, string> = {
  natural_rua: "Rua movimentada do bairro, pessoas ao fundo, luz natural",
  institucional_leve: "Gabinete ou espaço público bem iluminado",
  popular_direto: "Feira, praça ou ponto de ônibus",
  emocional: "Ambiente intimista, meia luz, objeto simbólico",
  tecnico_acessivel: "Quadro ou telão com informações visuais",
  juventude_cultura: "Espaço cultural, grafite, jovens, música ao fundo",
  periferia_respeito: "Comunidade, becos, quadra, pessoas reais",
  fe_familia_comunidade: "Sala de estar, igreja, espaço comunitário",
  prestacao_contas: "Plenário, obra, local de entrega",
  critica_sem_ataque: "Estúdio neutro, sem elementos partidários",
  propositivo: "Espaço amplo, horizonte, obra em andamento",
  bastidor_real: "Sala de reunião, corredor, momento espontâneo",
  lideranca_tranquila: "Biblioteca, espaço silencioso, planta ao fundo",
};

export function generateReelScript(formData: ScriptFormData): GeneratedScript {
  const ad = formData.analysisData;
  const ml = formData.modoLivreData;
  const themeLabel = formData.theme.replace(/_/g, " ");
  const nameRef = ad?.publicName || ml?.name || "o político";
  const usernameRef = ad?.username || "";
  const audienceRef = ad?.probableAudience || ml?.audience || "nossa cidade";
  const strengthsRef = ad?.strengths || "";
  const opportunitiesRef = ad?.contentOpportunities || "";
  const riskRef = ad?.communicationRisks || "";
  const bioRef = ad?.bioSummary || "";
  const toneRef = ad?.detectedTone || ml?.tone || "";
  const suggestedHashtags = ad?.hashtagSuggestions || "";

  const hookPool = hooks[formData.format || "gancho_forte"] || hooks.gancho_forte;
  const hook = hookPool[Math.floor(Math.random() * hookPool.length)]
    .replace(/\[tema\]/g, themeLabel)
    .replace(/\[problema\]/g, "os desafios que enfrentamos")
    .replace(/\[público\]/g, audienceRef)
    .replace(/\[ação\]/g, "uma ação política")
    .replace(/\[pessoa\]/g, "um cidadão")
    .replace(/\[situação\]/g, "essa realidade")
    .replace(/\[valor\]/g, "mudança real");

  const title = ad
    ? `${ad.publicName || ad.username} - ${themeLabel} - ${formData.duration}`
    : `${themeLabel} - ${formData.duration} - ${formData.style.replace(/_/g, " ")}`;

  const personalIntro = ad
    ? `[CONTEXTO DO PERFIL]\n` +
      `${nameRef} (@${usernameRef}) — ${bioRef}\n` +
      `Tom detectado: ${toneRef}\n` +
      `Público: ${audienceRef}\n` +
      (strengthsRef ? `Forças: ${strengthsRef}\n` : "") +
      (opportunitiesRef ? `Oportunidades: ${opportunitiesRef}\n` : "") +
      (riskRef ? `Riscos: ${riskRef}\n` : "") +
      `\n`
    : "";

  const intro = personalIntro +
    `[CENA: ${sceneSuggestions[formData.style] || "Ambiente institucional"}]\n\n` +
    `[DIR: ${styleDirections[formData.style] || "Câmera frontal"}]\n\n` +
    `[GANCHO]\n${hook}\n\n`;

  let body = "";
  if (formData.format === "gancho_forte" || formData.format === "pergunta_provocativa") {
    body = `[DESENVOLVIMENTO]\n` +
      `É sobre isso que eu quero falar hoje. Porque quando a gente entende como ${themeLabel} funciona na prática, fica mais fácil cobrar e participar.\n\n` +
      `[PAUSA — 2s]\n\n` +
      `A verdade é que muita gente não sabe, mas ${themeLabel} é uma pauta que mexe com o dia a dia de cada um de nós. Das crianças às pessoas mais experientes.\n\n` +
      `[PAUSA — 1s]\n\n` +
      `E não é sobre promessa. É sobre trabalho, parceria e compromisso.`;
  } else if (formData.format === "historia_pessoal" || formData.format === "depoimento") {
    body = `[DESENVOLVIMENTO]\n` +
      `Essa história começa onde a maioria das histórias reais começam: na simplicidade.\n\n` +
      `[PAUSA — 2s]\n\n` +
      `Eu vi de perto o que ${themeLabel} significa pra quem mais precisa. E foi aí que decidi que não dava pra ficar parado.\n\n` +
      `[PAUSA — 1s]\n\n` +
      `Não é sobre mim. É sobre o que a gente pode fazer junto.`;
  } else if (formData.format === "problema_solucao") {
    body = `[DESENVOLVIMENTO]\n` +
      `O problema é real: a gente sabe que ${themeLabel} ainda enfrenta desafios enormes.\n\n` +
      `[PAUSA — 1s]\n\n` +
      `Mas tem solução. E ela passa por planejamento, diálogo e ação.\n\n` +
      `[PAUSA — 1s]\n\n` +
      `A gente já começa a mudar quando reconhece o problema e busca resolver com responsabilidade.`;
  } else {
    body = `[DESENVOLVIMENTO]\n` +
      `Hoje eu quero compartilhar com vocês uma reflexão sincera sobre ${themeLabel}.\n\n` +
      `[PAUSA — 2s]\n\n` +
      `Porque comunicação pública de verdade não é sobre aparecer. É sobre conectar.\n\n` +
      `[PAUSA — 1s]\n\n` +
      `E conectar significa ouvir, aprender e agir.`;
  }

  const closing = `\n\n[ENCERRAMENTO]\n\n` +
    `No final das contas, o que importa é o que a gente constrói junto. E eu acredito que ${themeLabel} pode ser uma força de transformação real.\n\n` +
    `[PAUSA FINAL — 2s]\n\n` +
    `Vamos juntos?`;

  const fullScript = intro + body + closing;

  const shortVersion = `[CENA RÁPIDA]\n${hook}\n\nTudo se resume a uma coisa: compromisso com ${themeLabel}.\nVamos juntos.`;

  const emotionalVersion = `[CENA ÍNTIMA]\n${hook}\n\n` +
    `[PAUSA — 3s]\n\n` +
    `Eu não estou aqui por cargo. Estou aqui porque acredito que ${themeLabel} muda vidas.\n\n` +
    `[PAUSA — 2s]\n\n` +
    `E eu vi mudar. Na pele de pessoas reais.`;

  const institutionalVersion = `[CENA INSTITUCIONAL]\n${hook}\n\n` +
    `Esta é uma posição clara sobre ${themeLabel}. Baseada em dados, diálogo e compromisso público.\n\n` +
    `Seguimos trabalhando com seriedade e transparência.`;

  const baseHashtags = `#${themeLabel.replace(/\s+/g, "")} #PolíticaResponsável #ComunicaçãoCidadã #Transparência #MandatoParticipativo #${formData.style.replace(/_/g, "")}`;
  const hashtags = suggestedHashtags
    ? `${suggestedHashtags} ${baseHashtags}`
    : baseHashtags;

  const captionSuggestion = ad
    ? `${nameRef} fala sobre ${themeLabel}.\n\n${hook}\n\n` +
      `Público: ${audienceRef}\n` +
      (bioRef ? `Bio: ${bioRef}\n\n` : "") +
      `Comunicação responsável é feita de diálogo, verdade e respeito.`
    : `Legenda: ${hook}\n\nComunicação responsável é feita de diálogo, verdade e respeito. ` +
      `Essa é a política que a gente quer ver.`;

  const ctaSuggestion = ad
    ? `${nameRef} quer saber sua opinião: o que você pensa sobre ${themeLabel}? Deixe seu comentário!`
    : `Compartilhe essa ideia com alguém que precisa ouvir. Deixe seu comentário: o que você pensa sobre ${themeLabel}?`;

  const sceneSuggestion = ad
    ? `${sceneSuggestions[formData.style] || "Ambiente institucional"} — alinhado ao perfil de ${nameRef}`
    : sceneSuggestions[formData.style] || "Ambiente neutro e bem iluminado";

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    hook,
    fullScript,
    pauseMarks: "PAUSA — 1s, PAUSA — 2s, PAUSA — 3s, PAUSA FINAL — 2s",
    cameraDir: styleDirections[formData.style] || "Câmera frontal, tom direto",
    sceneSuggestion,
    captionSuggestion,
    ctaSuggestion,
    hashtags,
    shortVersion,
    emotionalVersion,
    institutionalVersion,
  };
}
