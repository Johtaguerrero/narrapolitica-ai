import { calculateWordRange } from "./time-calculator";
import { generateHashtags, hashtagsToString } from "./hashtag-generator";
import type { AnalysisData } from "@/types";

interface PromptInput {
  contentType: string;
  duration: string;
  theme: string;
  style: string;
  objective: string;
  analysisData?: AnalysisData | null;
  modoLivreData?: {
    name?: string;
    theme?: string;
    audience?: string;
    tone?: string;
    goal?: string;
  } | null;
  territoryName?: string;
  territoryContext?: string;
  territorialObjectives?: string;
}

export interface PromptResult {
  title: string;
  scriptText: string;
  captionText: string;
  hashtags: string;
  cta: string;
  scenarioSuggestion: string;
  framingSuggestion: string;
  strategicNotes: string;
  estimatedWords: number;
}

const styleScene: Record<string, string> = {
  natural_rua: "Rua do bairro, pessoas ao fundo, luz natural, clima espontâneo",
  institucional_leve: "Gabinete ou espaço público bem iluminado, câmera estável",
  popular_direto: "Feira, praça ou ponto de ônibus, contato direto com pessoas",
  emocional: "Ambiente intimista, meia luz, objeto simbólico ao fundo",
  tecnico_acessivel: "Quadro ou telão com apoio visual, tom didático",
  juventude_cultura: "Espaço cultural com grafite, jovens, música ambiente",
  periferia_respeito: "Comunidade, becos, quadra, pessoas reais do dia a dia",
  fe_familia_comunidade: "Sala de estar ou espaço comunitário, clima acolhedor",
  prestacao_contas: "Plenário, obra ou local de entrega, dados visíveis",
  critica_sem_ataque: "Estúdio neutro, sem partidarismo, tom moderado",
  propositivo: "Espaço amplo com horizonte, sensação de futuro",
  bastidor_real: "Sala de reunião ou corredor, momento espontâneo",
  lideranca_tranquila: "Biblioteca ou espaço silencioso, plantas ao fundo",
};

const styleFraming: Record<string, string> = {
  natural_rua: "Câmera na mão, movimentos naturais, olhar direto para câmera",
  institucional_leve: "Câmera fixa, enquadramento médio, tom sereno",
  popular_direto: "Câmera próxima, gestos com as mãos, linguagem aberta",
  emocional: "Close no rosto, luz suave, respiro entre falas",
  tecnico_acessivel: "Alterna entre câmera e apoio visual, tom explicativo",
  juventude_cultura: "Câmera dinâmica, cortes rápidos, linguagem visual jovem",
  periferia_respeito: "Câmera observadora, enquadramento natural, sem pressa",
  fe_familia_comunidade: "Plano médio, ambiente acolhedor, tom sereno",
  prestacao_contas: "Câmera fixa, fundo institucional, dados na tela",
  critica_sem_ataque: "Câmera frontal, enquadramento justo, tom moderado",
  propositivo: "Plano aberto, linguagem de futuro, otimismo no olhar",
  bastidor_real: "Câmera distante, sem interferência, momento real",
  lideranca_tranquila: "Câmera no nível dos olhos, tom firme e calmo",
};

const objectives: Record<string, { hook: string; cta: string; notes: string }> = {
  conscientizar: {
    hook: "Tem coisa que a gente só percebe quando para pra pensar.",
    cta: "Compartilhe esse vídeo com alguém que precisa refletir sobre isso.",
    notes: "Conteúdo com tom de despertar de consciência. Evite alarmismo.",
  },
  informar: {
    hook: "Vou explicar de forma simples e direta.",
    cta: "Salva esse vídeo pra consultar depois.",
    notes: "Conteúdo educativo, baseado em fatos. Tom claro e acessível.",
  },
  mobilizar: {
    hook: "Sua ação faz a diferença. E é por isso que estou aqui.",
    cta: "Chama alguém que precisa participar dessa conversa.",
    notes: "Conteúdo de chamado à ação. Foco em participação cívica.",
  },
  engajar: {
    hook: "Isso que vou falar agora merece sua atenção.",
    cta: "Deixa seu comentário: o que você pensa sobre isso?",
    notes: "Conteúdo para gerar discussão. Perguntas abertas no texto.",
  },
  prestar_contas: {
    hook: "Prometemos, fizemos e vamos te mostrar.",
    cta: "Acompanhe nosso trabalho e cobre resultados.",
    notes: "Conteúdo com dados concretos. Transparência e clareza.",
  },
  inspirar: {
    hook: "Deixa eu te contar uma história que me marcou.",
    cta: "Marque alguém que precisa ouvir essa história hoje.",
    notes: "Tom emocional mas sem exageros. História real e genuína.",
  },
  educar: {
    hook: "Sabia disso? Vou te explicar de um jeito simples.",
    cta: "Compartilhe com quem precisa entender melhor esse tema.",
    notes: "Conteúdo didático. Analogias e exemplos práticos.",
  },
  dialogar: {
    hook: "Eu quero ouvir você. Porque é com diálogo que a gente avança.",
    cta: "Me conta nos comentários: qual sua opinião sobre isso?",
    notes: "Conteúdo de escuta. Tom aberto e convidativo.",
  },
};

const themeContexts: Record<string, string> = {
  cultura: "cultura, arte, música e expressão popular",
  juventude: "juventude, protagonismo jovem e futuro",
  educacao: "educação, escola, professores e formação cidadã",
  saude: "saúde pública, bem-estar e qualidade de vida",
  seguranca: "segurança comunitária, paz e prevenção",
  emprego: "emprego, renda e oportunidades",
  moradia: "moradia digna, direito à cidade e habitação",
  mobilidade: "mobilidade urbana, transporte e acessibilidade",
  esporte: "esporte, lazer e inclusão social",
  mulher: "direitos da mulher, igualdade e respeito",
  familia: "família, união e valores comunitários",
  empreendedorismo: "empreendedorismo, inovação e negócios locais",
  periferia: "periferia, quebrada e resistência cultural",
  transparencia: "transparência, dados abertos e participação",
  comunidade: "comunidade, união e mutirão",
  combate_fome: "combate à fome, segurança alimentar e dignidade",
  projetos_sociais: "projetos sociais, impacto e transformação",
};

export function buildPrompt(input: PromptInput): PromptResult {
  const ad = input.analysisData;
  const ml = input.modoLivreData;

  const name = ad?.publicName || ml?.name || "";
  const username = ad?.username || "";
  const tone = ad?.detectedTone || ml?.tone || "";
  const audience = ad?.probableAudience || ml?.audience || "";
  const strengths = ad?.strengths || "";
  const risks = ad?.communicationRisks || "";
  const suggestedHashtags = ad?.hashtagSuggestions || "";

  const wordRange = calculateWordRange(input.duration, input.contentType);

  const themeContext = themeContexts[input.theme] || input.theme.replace(/_/g, " ");
  const objectiveData = objectives[input.objective] || objectives.conscientizar;
  const scene = styleScene[input.style] || "Ambiente neutro e bem iluminado";
  const framing = styleFraming[input.style] || "Câmera frontal, tom direto";

  const hook = objectiveData.hook;
  const cta = objectiveData.cta;

  const hashtagArray = generateHashtags({
    profileName: name,
    username,
    theme: input.theme,
    style: input.style,
    audience: audience || undefined,
    frequentThemes: ad?.frequentThemes || undefined,
    suggestedHashtags: suggestedHashtags || undefined,
  });
  const hashtags = hashtagsToString(hashtagArray);

  const bodyLines: string[] = [];

  if (input.territoryContext && input.territoryName) {
    bodyLines.push(`Estou aqui na ${input.territoryName}.`);
    bodyLines.push("");
    bodyLines.push(`${input.territoryContext}`);
    bodyLines.push("");
    if (input.territorialObjectives) {
      bodyLines.push(`Meu compromisso aqui é: ${input.territorialObjectives.replace(/_/g, " ")}.`);
      bodyLines.push("");
    }
  }

  if (name) {
    bodyLines.push(`Olá, sou ${name}.`);
    if (username) bodyLines.push(`(@${username})`);
    bodyLines.push("");
  }

  bodyLines.push(`${hook}`);
  bodyLines.push("");

  const bridges = [
    `Vamos conversar sobre ${themeContext}.`,
    `Quero trazer uma reflexão sincera sobre ${themeContext}.`,
    `Hoje quero falar sobre algo que impacta diretamente a nossa vida: ${themeContext}.`,
  ];
  bodyLines.push(bridges[Math.floor(Math.random() * bridges.length)]);
  bodyLines.push("");

  const development = buildDevelopmentText(input.theme, input.objective, wordRange.avg);
  bodyLines.push(development);
  bodyLines.push("");

  const closings = [
    "E é assim que a gente constrói política pública de verdade: com diálogo, transparência e ação.",
    "No final, o que importa é o que a gente faz junto. E juntos a gente vai mais longe.",
    "Porque política se faz com escuta, trabalho e responsabilidade. E é isso que nos move.",
    "Comunicação pública de verdade é sobre conectar pessoas. E é isso que estamos fazendo aqui.",
  ];
  bodyLines.push(closings[Math.floor(Math.random() * closings.length)]);
  bodyLines.push("");

  const personalCTA = `${cta}`;
  bodyLines.push(personalCTA);

  const scriptText = bodyLines.join("\n");

  const captionText = buildCaption(input, name, hashtags, cta);

  const strategicNotes = [
    input.territoryName ? `Território: ${input.territoryName}.` : "",
    input.territorialObjectives ? `Objetivos territoriais: ${input.territorialObjectives.replace(/_/g, " ")}.` : "",
    input.territoryContext ? `Contexto local informado: ${input.territoryContext.substring(0, 200)}${input.territoryContext.length > 200 ? "..." : ""}.` : "",
    strengths ? `Pontos fortes do perfil: ${strengths}.` : "",
    risks ? `Atenção aos riscos: ${risks}.` : "",
    audience ? `Público-alvo: ${audience}.` : "",
    tone ? `Tom de voz: ${tone}.` : "",
    objectiveData.notes,
  ]
    .filter(Boolean)
    .join("\n");

  const title = [name, input.theme.replace(/_/g, " "), input.contentType.replace(/_/g, " ")]
    .filter(Boolean)
    .join(" - ");

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    scriptText,
    captionText,
    hashtags,
    cta,
    scenarioSuggestion: scene,
    framingSuggestion: framing,
    strategicNotes,
    estimatedWords: wordRange.avg,
  };
}

function buildDevelopmentText(theme: string, _objective: string, targetWords: number): string {
  const themeLabel = theme.replace(/_/g, " ");
  const paragraphs: string[] = [];
  let wordCount = 0;

  const templates = [
    `Quando a gente fala de ${themeLabel}, não tem como não pensar no impacto que isso tem na vida de cada pessoa. Não é sobre estatística — é sobre histórias reais. É sobre a mãe que luta por um futuro melhor, o jovem que busca oportunidade, o trabalhador que quer ser ouvido.`,
    `E é por isso que esse tema é tão importante. Porque ele mexe com a vida de verdade. Não é sobre promessa vazia — é sobre compromisso assumido. E a gente sabe que compromisso se prova com ação, não com palavras bonitas.`,
    `O que a gente propõe é simples: diálogo aberto, escuta ativa e ação concreta. Nada de discurso decorado. A gente quer conversar de igual pra igual, porque política pública se faz com participação de verdade.`,
    `E você, o que pensa sobre isso? Sua opinião é fundamental pra construir soluções que realmente funcionem. Porque ninguém conhece melhor a realidade de um lugar do que quem vive lá todo dia.`,
    `Seguimos trabalhando com responsabilidade, transparência e respeito. Esse é o nosso compromisso. E é por isso que estamos aqui: pra construir junto com você um futuro melhor para todos.`,
    `Não é sobre partido. É sobre pessoas. É sobre fazer o que é certo, mesmo quando é difícil. É sobre olhar no olho e dizer a verdade. Porque é assim que a gente conquista confiança.`,
  ];

  for (const template of templates) {
    if (wordCount >= targetWords) break;
    paragraphs.push(template);
    wordCount += template.split(" ").length;

    if (wordCount < targetWords && Math.random() > 0.5) {
      const bridges = [
        `Pense bem: ${themeLabel} está mais perto da sua realidade do que você imagina.`,
        `É importante a gente lembrar que toda mudança começa com uma conversa sincera.`,
        `Não precisa ser especialista pra entender o impacto de ${themeLabel} na nossa vida.`,
      ];
      const bridge = bridges[Math.floor(Math.random() * bridges.length)];
      paragraphs.push(bridge);
      wordCount += bridge.split(" ").length;
    }
  }

  return paragraphs.join("\n\n");
}

function buildCaption(input: PromptInput, name: string, hashtags: string, cta: string): string {
  const themeLabel = input.theme.replace(/_/g, " ");
  const impactLines = [
    `${themeLabel} é mais do que pauta — é compromisso.`,
    `${themeLabel} não é promessa, é prioridade.`,
    `Falar sobre ${themeLabel} é falar de gente.`,
    `${themeLabel} transforma realidades.`,
    `O que você sabe sobre ${themeLabel}?`,
  ];
  const impact = impactLines[Math.floor(Math.random() * impactLines.length)];

  const explanations = [
    `É por isso que seguimos trabalhando com responsabilidade, escutando a população e construindo soluções reais.`,
    `A comunicação pública de verdade começa com diálogo, transparência e ação.`,
    `Porque política se faz com conversa sincera, não com discurso pronto.`,
    `Informação de qualidade é o primeiro passo para uma sociedade mais participativa.`,
  ];
  const explanation = explanations[Math.floor(Math.random() * explanations.length)];

  let caption = `${impact}\n\n${explanation}\n\n${cta}`;

  if (name) {
    const intros = [
      `${name} fala sobre ${themeLabel}.`,
      `${name} compartilha uma reflexão sobre ${themeLabel}.`,
    ];
    caption = `${intros[Math.floor(Math.random() * intros.length)]}\n\n${caption}`;
  }

  caption += `\n\n${hashtags}`;
  return caption;
}
