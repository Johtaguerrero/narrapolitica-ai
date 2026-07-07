/**
 * Instagram Analyzer Service
 *
 * MVP: análise simulada baseada no @ do Instagram.
 * Preparado para integração futura com:
 * - Instagram Graph API
 * - Apify
 * - Firecrawl
 * - SerpAPI
 * - OpenAI Responses API
 * - Gemini
 * - Ollama
 */

export interface InstagramAnalysisResult {
  profileUrl: string;
  username: string;
  publicName: string;
  bioSummary: string;
  detectedTone: string;
  frequentThemes: string;
  probableAudience: string;
  strengths: string;
  weaknesses: string;
  contentOpportunities: string;
  reelIdeas: string;
  speechIdeas: string;
  communicationRisks: string;
  captionSuggestions: string;
  hashtagSuggestions: string;
  rawAnalysis: string;
}

function extractUsername(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:instagram\.com\/)([a-zA-Z0-9_.]+)|@([a-zA-Z0-9_.]+)|^([a-zA-Z][a-zA-Z0-9_.]{2,29})$/
  );
  if (match) {
    return match[1] || match[2] || match[3] || trimmed.replace("@", "");
  }
  return trimmed.replace("@", "").split("/").pop() || trimmed;
}

function simulateAnalysis(username: string): InstagramAnalysisResult {
  const themes = [
    "educação", "saúde", "moradia", "emprego", "cultura",
    "juventude", "esporte", "transparência", "comunidade",
    "empreendedorismo", "segurança", "mobilidade", "mulher",
    "periferia", "combate à fome", "projetos sociais",
  ];

  const selectedThemes = themes
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .join(", ");

  const tones = [
    "Tom direto e popular, com linguagem acessível",
    "Tom institucional leve, com preocupação com credibilidade",
    "Tom emocional, com forte apelo a histórias pessoais",
    "Tom técnico informativo, busca passar confiança",
    "Tom jovem e cultural, conectado com periferia",
    "Tom de liderança tranquila, passa segurança e maturidade",
  ];

  const randomTone = tones[Math.floor(Math.random() * tones.length)];

  return {
    profileUrl: `https://instagram.com/${username}`,
    username,
    publicName: `@${username}`,
    bioSummary: `Perfil público de ${username} com foco em temas políticos e sociais. ` +
      `O conteúdo aborda pautas como ${selectedThemes}. A comunicação busca engajamento ` +
      `e proximidade com a população.`,
    detectedTone: randomTone,
    frequentThemes: selectedThemes,
    probableAudience: `Cidadãos interessados em política local, ` +
      `jovens entre 18-34 anos, moradores da região de atuação, ` +
      `seguidores engajados em pautas sociais e comunitárias.`,
    strengths: [
      "Comunicação direta e sem rodeios",
      "Presença consistente nas redes",
      "Capacidade de explicar temas complexos de forma simples",
      "Bom relacionamento com a comunidade local",
    ].join("\n"),
    weaknesses: [
      "Tom pode parecer muito informal em alguns momentos",
      "Falta de variedade nos formatos de conteúdo",
      "Pouco uso de dados e estatísticas para embasar argumentos",
      "Baixa frequência de interação com seguidores nos comentários",
    ].join("\n"),
    contentOpportunities: [
      "Criar série de Reels educativos sobre direitos da população",
      "Produzir conteúdo de bastidor para humanizar o perfil",
      "Usar depoimentos da comunidade para fortalecer credibilidade",
      "Responder perguntas frequentes em formato de carrossel",
      "Criar calendário fixo de prestação de contas semanais",
    ].join("\n"),
    reelIdeas: [
      `"O que faz um político? — 30s explicando o dia a dia"`,
      `"${selectedThemes.split(",")[0]} em números: dados que importam"`,
      `"Perguntei na rua: o que você sabe sobre política?"`,
      `"Bastidor de uma reunião importante — sem edição"`,
      `"Um dia no mandato: mostrando o trabalho real"`,
    ].join("\n"),
    speechIdeas: [
      `Discurso de abertura sobre ${selectedThemes.split(",")[0]} e desenvolvimento local`,
      `Fala em evento comunitário: união e trabalho como caminho`,
      `Discurso de prestação de contas com transparência`,
      `Manifesto por mais participação popular`,
      `Fala emocional em homenagem a lideranças locais`,
    ].join("\n"),
    communicationRisks: [
      "Evitar linguagem muito técnica que afaste o público",
      "Não fazer promessas impossíveis de cumprir",
      "Cuidado com tom institucional excessivo que pareça distante",
      "Evitar responder críticas com agressividade",
      "Não depender de um único tema para engajamento",
    ].join("\n"),
    captionSuggestions: [
      `"Política é sobre pessoas. E pessoas se conectam com verdade."`,
      `"Dados não mentem. E os números mostram o caminho."`,
      `"Toda obra começa com uma conversa. Vamos conversar?"`,
      `"Não se faz política sozinho. Se faz junto."`,
      `"O que importa não é o cargo. É o que a gente faz com ele."`,
    ].join("\n"),
    hashtagSuggestions:
      "#PolíticaResponsável #ComunicaçãoCidadã #Transparência " +
      "#MandatoParticipativo #PolíticaComVerdade",
    rawAnalysis: JSON.stringify(
      {
        analyzedAt: new Date().toISOString(),
        source: "mvp-simulator",
        username,
        platform: "instagram",
        note: "Análise simulada para MVP. Integrar API real em produção.",
      },
      null,
      2
    ),
  };
}

export async function analyzeInstagramProfile(
  input: string
): Promise<InstagramAnalysisResult> {
  const username = extractUsername(input);

  // -- FUTURE INTEGRATIONS --
  // if (process.env.INSTAGRAM_GRAPH_API_TOKEN) {
  //   return analyzeWithGraphAPI(username);
  // }
  // if (process.env.APIFY_API_KEY) {
  //   return analyzeWithApify(username);
  // }
  // if (process.env.FIRECRAWL_API_KEY) {
  //   return analyzeWithFirecrawl(username);
  // }
  // if (process.env.SERPAPI_API_KEY) {
  //   return analyzeWithSerpAPI(username);
  // }
  // if (process.env.OPENAI_API_KEY) {
  //   return analyzeWithOpenAI(username);
  // }
  // if (process.env.GEMINI_API_KEY) {
  //   return analyzeWithGemini(username);
  // }

  // Simulated delay to mimic real API call
  await new Promise((r) => setTimeout(r, 2000));

  return simulateAnalysis(username);
}
