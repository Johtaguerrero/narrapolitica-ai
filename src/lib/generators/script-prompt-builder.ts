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

  if (input.territoryName) {
    bodyLines.push(`Estou aqui em ${input.territoryName}.`);
    bodyLines.push("");
    if (input.territoryContext) {
      bodyLines.push(`${input.territoryContext}`);
      bodyLines.push("");
    }
    if (input.territorialObjectives) {
      bodyLines.push(`Meu compromisso aqui é: ${input.territorialObjectives.replace(/_/g, " ")}.`);
      bodyLines.push("");
    }
  }

  if (name) {
    const greetings = [
      `Oi, eu sou ${name}.`,
      `Fala comigo, sou ${name}.`,
      `E aí, aqui é ${name}.`,
    ];
    if (tone.includes("institucional") || tone.includes("técnico") || tone.includes("formal")) {
      bodyLines.push(`Olá, eu sou ${name}.`);
    } else if (tone.includes("jovem") || tone.includes("popular") || tone.includes("emocional")) {
      bodyLines.push(greetings[Math.floor(Math.random() * greetings.length)]);
    } else {
      bodyLines.push(`Olá, sou ${name}.`);
    }
    if (username) bodyLines.push(`(@${username})`);
    bodyLines.push("");
  }

  if (input.objective === "prestar_contas" || input.objective === "informar") {
    bodyLines.push(`${hook}`);
  } else {
    const hooks = [
      `${hook}`,
      `Deixa eu começar com uma pergunta: você já parou pra pensar sobre ${themeContext}?`,
      `Sabe aquela sensação de que algo precisa mudar? É sobre isso que quero conversar.`,
      `${hook} — e é exatamente sobre isso que quero falar hoje.`,
    ];
    bodyLines.push(hooks[Math.floor(Math.random() * hooks.length)]);
  }
  bodyLines.push("");

  const transition = audience
    ? [
        `Quero conversar com ${audience.toLowerCase()} sobre ${themeContext}.`,
        `Hoje quero chamar a atenção de ${audience.toLowerCase()} pra um tema urgente: ${themeContext}.`,
        `Se você é ${audience.toLowerCase()}, esse papo é direto com você.`,
      ][Math.floor(Math.random() * 3)]
    : [
        `Quero conversar sobre ${themeContext}.`,
        `Vou ser sincero com você sobre ${themeContext}.`,
        `Deixa eu compartilhar uma visão sincera sobre ${themeContext}.`,
      ][Math.floor(Math.random() * 3)];
  bodyLines.push(transition);
  bodyLines.push("");

  const development = buildDevelopmentText(input.theme, input.objective, wordRange.avg, input.territoryName, input.territoryContext, name, tone, audience, strengths);
  bodyLines.push(development);
  bodyLines.push("");

  const closings = [
    `É assim que a gente constrói política pública de verdade: com diálogo, transparência e ação.${strengths ? ` E é isso que a gente sabe fazer: ${strengths.toLowerCase().substring(0, 80)}.` : ""}`,
    `No final, o que importa é o que a gente faz junto. ${strengths ? `E juntos a gente vai mais longe — essa é a nossa força.` : `E juntos a gente vai mais longe.`}`,
    `Política se faz com escuta, trabalho e responsabilidade. E é isso que nos move.`,
    `Comunicação pública de verdade é sobre conectar pessoas. ${audience ? `E é com ${audience.toLowerCase()} que a gente quer estar.` : `E é isso que estamos fazendo aqui.`}`,
  ];
  bodyLines.push(closings[Math.floor(Math.random() * closings.length)]);
  bodyLines.push("");

  bodyLines.push(`${cta}`);

  const scriptText = bodyLines.join("\n");

  const captionText = buildCaption(input, name, hashtags, cta, tone, audience);

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

function buildDevelopmentText(theme: string, _objective: string, targetWords: number, territoryName?: string, territoryContext?: string, name?: string, tone?: string, audience?: string, strengths?: string): string {
  const themeLabel = theme.replace(/_/g, " ");
  const paragraphs: string[] = [];
  let wordCount = 0;

  const toneStyle = tone ? tone.toLowerCase() : "";
  const isDireto = toneStyle.includes("direto") || toneStyle.includes("popular");
  const isEmocional = toneStyle.includes("emocional");
  const isInstitucional = toneStyle.includes("institucional") || toneStyle.includes("técnico");
  const isJovem = toneStyle.includes("jovem") || toneStyle.includes("cultural");

  const aud = audience ? audience.toLowerCase() : "";
  const audRef = aud ? [`É com ${aud} que esse papo importa.`, `Quem vive ${aud === "jovens" || aud === "pessoas" ? "" : "na "}${aud} sabe do que tô falando.`, `E ${aud} merece resposta, não promessa.`] : [];

  const strengthRef = strengths
    ? [
        `A gente tem um jeito próprio de fazer as coisas: ${strengths.substring(0, 100).toLowerCase()}.`,
        `O que nos move é ${strengths.substring(0, 100).toLowerCase()}.`,
      ]
    : [];

  const locationRef = territoryName
    ? [
        `Aqui em ${territoryName}, a realidade não é diferente.`,
        `Na nossa ${territoryName}, a gente sente isso no dia a dia.`,
        `${territoryName} merece atenção e cuidado.`,
      ]
    : [];

  const problemRef = territoryContext
    ? [
        `A gente sabe que ${territoryContext.substring(0, 80).toLowerCase()}... isso precisa mudar.`,
        `Não dá pra ignorar o que a gente vê todo dia: ${territoryContext.substring(0, 100).toLowerCase()}.`,
        `É sobre isso que a gente precisa conversar: ${territoryContext.substring(0, 100).toLowerCase()}.`,
      ]
    : [];

  const allBridges = [...locationRef, ...problemRef, ...audRef, ...strengthRef];

  const templatePool = buildTemplatePool(themeLabel, territoryName, isDireto, isEmocional, isInstitucional, isJovem, name, aud);

  for (const template of templatePool) {
    if (wordCount >= targetWords) break;
    paragraphs.push(template);
    wordCount += template.split(" ").length;

    if (wordCount < targetWords && allBridges.length > 0 && Math.random() > 0.4) {
      const bridge = allBridges[Math.floor(Math.random() * allBridges.length)];
      paragraphs.push(bridge);
      wordCount += bridge.split(" ").length;
    }

    if (wordCount < targetWords && Math.random() > 0.6) {
      const genericBridges = [
        `Pense bem: ${themeLabel} está mais perto da sua realidade do que você imagina.`,
        `Toda mudança começa com uma conversa sincera.`,
        `Não precisa ser especialista pra entender o impacto de ${themeLabel} na nossa vida.`,
        `Se tem uma coisa que aprendi, é que política se constrói com escuta.`,
        `É sobre isso: olhar nos olhos, ouvir, e agir.`,
      ];
      paragraphs.push(genericBridges[Math.floor(Math.random() * genericBridges.length)]);
      wordCount += genericBridges[Math.floor(Math.random() * genericBridges.length)].split(" ").length;
    }
  }

  return paragraphs.join("\n\n");
}

function buildTemplatePool(themeLabel: string, territoryName: string | undefined, isDireto: boolean, isEmocional: boolean, isInstitucional: boolean, isJovem: boolean, name: string | undefined, aud: string): string[] {
  const loc = territoryName || "nossa cidade";

  const templates: string[] = [];

  if (isDireto) {
    templates.push(
      `Vou ser direto: ${themeLabel} não pode esperar. A gente precisa de ação, não de conversa fiada. Enquanto uns empurram com a barriga, a realidade aperta. E quem sente no bolso e no dia a dia é o povo.`,
      `${themeLabel} afeta sua vida mais do que você imagina. Não adianta fechar os olhos. O problema tá aí, batendo na porta. E a gente precisa encarar de frente, com coragem e honestidade.`,
      `Sabe o que eu vejo na rua todo dia? Pessoas lutando, se virando, tentando sobreviver. E o poder público muitas vezes empurrando com a barriga. Isso tem que mudar.`,
      `Não vou ficar aqui dando rodeio. O que importa é o seguinte: ${themeLabel} é prioridade. E a gente precisa tratar como tal. Com seriedade, com responsabilidade e com ação.`,
      `A verdade é uma só: ou a gente age agora, ou depois é tarde. ${themeLabel} não é pauta de campanha — é compromisso de mandato.`,
    );
  }

  if (isEmocional) {
    templates.push(
      `Sabe aquela sensação de olhar pro lado e ver alguém que precisa de ajuda? É assim que me sinto quando penso em ${themeLabel}. Não é sobre números — é sobre pessoas reais, com sonhos, medos e esperanças.`,
      `Eu acredito que política é sobre cuidar. E cuidar de verdade é olhar nos olhos, ouvir em silêncio e agir com o coração. ${themeLabel} mexe com a vida de verdade. E isso não tem preço.`,
      `Teve um dia desses que eu parei e pensei: será que a gente tem feito o suficiente? Porque ${themeLabel} não é só pauta — é vida real. E cada história que a gente ouve, cada abraço que a gente recebe, me lembra por que eu tô aqui.`,
      `Não é fácil falar sobre ${themeLabel} sem se emocionar. Porque por trás de cada dado, tem uma família. Por trás de cada estatística, tem um sonho. E a gente não pode esquecer disso.`,
      `O que me move é saber que a gente pode fazer diferente. Que ${themeLabel} pode ser um motivo de orgulho, não de dor. E é por isso que eu acordo todo dia com vontade de trabalhar.`,
    );
  }

  if (isJovem) {
    templates.push(
      `Fala sério: ${themeLabel} é assunto que mexe com todo mundo. E a galera nova tem um papel fundamental nessa mudança. É a nossa vez de ocupar espaço, de falar o que pensa, de cobrar e de propor.`,
      `A real é que ${themeLabel} não pode ficar pra depois. A gente vive num mundo que muda rápido, e quem não acompanha, fica pra trás. É hora de trazer a juventude pra dentro da conversa.`,
      `Se tem uma coisa que a nova geração entende, é que esperar sentado não resolve. A gente quer participação, quer voz ativa. E ${themeLabel} é o ponto de partida pra construir algo novo.`,
      `${themeLabel} é isso: movimento, troca, energia. Não é sobre discurso pronto — é sobre atitude. E a juventude tem atitude de sobra pra transformar a realidade.`,
    );
  }

  if (isInstitucional) {
    templates.push(
      `A gestão pública tem o dever de priorizar ${themeLabel} com planejamento, transparência e eficiência. É assim que a gente transforma recursos em resultados e promessas em entregas concretas.`,
      `Quando a gente fala de ${themeLabel}, a gente tá falando de compromisso firmado com a população. Cada passo precisa ser dado com responsabilidade fiscal e responsabilidade social.`,
      `A população espera resultados — e a gente tem a obrigação de entregar. ${themeLabel} exige trabalho sério, baseado em dados, diálogo e planejamento estratégico.`,
    );
  }

  templates.push(
    territoryName
      ? `Quando a gente fala de ${themeLabel} em ${territoryName}, não tem como não pensar no impacto na vida de cada pessoa. Não é sobre estatística — é sobre histórias reais.`
      : `Quando a gente fala de ${themeLabel}, não tem como não pensar no impacto que isso tem na vida de cada pessoa. Não é sobre estatística — é sobre histórias reais.`,
  );

  if (aud) {
    templates.push(
      `E ${aud} é quem mais sente isso no dia a dia. É pra vocês que esse trabalho existe. Porque a gente sabe que ${themeLabel} não é um tema distante — é uma necessidade real de quem vive ${aud === "jovens" || aud === "pessoas" ? "essa" : "nessa"} realidade.`,
    );
  }

  if (name) {
    templates.push(
      `Eu, ${name}, acredito que a política precisa ser feita com verdade. E verdade em relação a ${themeLabel} é reconhecer os desafios, mas também apresentar caminhos.`,
    );
  }

  templates.push(
    `O que move a gente é simples: vontade de acertar, de fazer o melhor, de não desistir. ${themeLabel} é um desses temas que exige perseverança. E a gente não vai parar.`,
    `É por isso que a gente não pode se calar. Porque ${themeLabel} diz respeito a todo mundo. Não é sobre agradar — é sobre fazer o que é certo.`,
    `E você, o que pensa sobre isso? Sua opinião é essencial pra construir soluções que realmente funcionem. Porque ninguém conhece melhor a realidade de um lugar do que quem vive lá todo dia.`,
    `Seguimos trabalhando com responsabilidade, transparência e respeito. Esse é o compromisso. E é por isso que estamos aqui: pra construir junto um futuro melhor.`,
  );

  if (isDireto || isJovem) {
    templates.push(
      `Resumo da ópera: ${themeLabel} importa. E a gente tá aqui pra isso. Pra trabalhar, pra ouvir, pra agir. Sem firula, sem joguinho.`,
    );
  }

  return templates;
}

function buildCaption(input: PromptInput, name: string, hashtags: string, cta: string, tone?: string, audience?: string): string {
  const themeLabel = input.theme.replace(/_/g, " ");
  const toneLower = (tone || "").toLowerCase();
  const aud = audience ? audience.toLowerCase() : "";

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
    `Comunicação pública de verdade começa com diálogo, transparência e ação.`,
    `Política se faz com conversa sincera, não com discurso pronto.`,
    `Informação de qualidade é o primeiro passo para uma sociedade mais participativa.`,
  ];

  if (aud) {
    explanations.push(`Especialmente pra ${aud} — essa mensagem é pra vocês.`);
  }

  if (toneLower.includes("direto") || toneLower.includes("popular")) {
    explanations.push(`Sem enrolação — o recado é claro e direto pra quem quer entender.`);
  }

  const explanation = explanations[Math.floor(Math.random() * explanations.length)];

  let caption = `${impact}\n\n${explanation}\n\n${cta}`;

  if (name) {
    const intros = [
      `${name} fala sobre ${themeLabel}.`,
      `${name} compartilha uma reflexão sobre ${themeLabel}.`,
      `📢 ${name} traz um papo sincero sobre ${themeLabel}.`,
    ];
    caption = `${intros[Math.floor(Math.random() * intros.length)]}\n\n${caption}`;
  }

  caption += `\n\n${hashtags}`;
  return caption;
}
