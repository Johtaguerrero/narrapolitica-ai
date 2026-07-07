import type { ScriptFormData, GeneratedScript } from "@/types";

export function generateTextScript(formData: ScriptFormData): GeneratedScript {
  const themeLabel = formData.theme.replace(/_/g, " ");
  const styleLabel = formData.style.replace(/_/g, " ");

  const title = `${formData.type.replace(/_/g, " ")}: ${themeLabel} - ${styleLabel}`;

  let fullScript = "";
  let hook = "";
  let shortVersion = "";
  let emotionalVersion = "";
  let institutionalVersion = "";

  if (formData.type === "legenda") {
    hook = `[LEGENDA]\nSobre ${themeLabel}: a gente precisa conversar com honestidade.`;
    fullScript =
      `${hook}\n\n` +
      `Não é sobre parecer bonito no feed. É sobre construir uma comunicação que gere identificação real.\n\n` +
      `${themeLabel} não é pauta de momento. É compromisso contínuo.\n\n` +
      `[PAUSA DE LEITURA]\n\n` +
      `E você, o que pensa sobre isso? Deixa aqui sua opinião.`;
    shortVersion = `${hook}\n\nComunicação que conecta. Essa é a nossa proposta.`;
    emotionalVersion = `${hook}\n\n` +
      `Eu olho pra cada história e penso: é por isso que a gente faz política. ` +
      `Porque ${themeLabel} muda vidas. E a gente muda junto.`;
    institutionalVersion = `${hook}\n\n` +
      `Posicionamento institucional sobre ${themeLabel}. ` +
      `Baseado em dados, diálogo e compromisso público.`;
  } else if (formData.type === "texto_instagram") {
    hook = `${themeLabel}: o que você precisa saber`;
    fullScript =
      `${hook}\n\n` +
      `A gente vive um momento em que ${themeLabel} está no centro dos debates. ` +
      `E é importante a gente se informar com responsabilidade.\n\n` +
      `[TÓPICOS]\n` +
      `• O que está acontecendo\n` +
      `• Como isso impacta sua vida\n` +
      `• O que está sendo feito\n` +
      `• Como você pode participar\n\n` +
      `[CHAMADA]\n` +
      `Informação de qualidade é o primeiro passo para uma sociedade mais participativa.`;
    shortVersion = `${hook}\n\n` +
      `Informação responsável é o que move a cidadania.`;
    emotionalVersion = `${hook}\n\n` +
      `Por trás de cada dado, tem uma história. Tem gente. Tem vida. ` +
      `E é por isso que a gente precisa falar sobre ${themeLabel}.`;
    institutionalVersion = `${hook}\n\n` +
      `Nota oficial sobre ${themeLabel}. Esclarecemos os fatos com transparência e responsabilidade.`;
  } else if (formData.type === "carrossel") {
    hook = `[CARROSSEL — 5 SLIDES]\nSlide 1: ${themeLabel} em números`;
    fullScript =
      `${hook}\n\n` +
      `Slide 2: O cenário atual\n` +
      `Dados mostram que ${themeLabel} precisa de atenção contínua.\n\n` +
      `Slide 3: O que mudou\n` +
      `Com trabalho e parceria, avançamos em pontos estratégicos.\n\n` +
      `Slide 4: Ainda há desafios\n` +
      `Reconhecer onde precisamos melhorar é parte do compromisso.\n\n` +
      `Slide 5: O próximo passo\n` +
      `Seguimos com planejamento, diálogo e ação.`;
    shortVersion = `${hook}\n\nResumo visual de ${themeLabel}.`;
    emotionalVersion = `${hook}\n\n` +
      `Cada número representa uma vida. Cada avanço, uma história de superação.`;
    institutionalVersion = `${hook}\n\n` +
      `Relatório institucional com dados verificados sobre ${themeLabel}.`;
  } else if (formData.type === "resposta_comentario") {
    hook = `[RESPOSTA]\nObrigado pelo comentário! Vou responder com transparência.`;
    fullScript =
      `${hook}\n\n` +
      `Sobre sua pergunta a respeito de ${themeLabel}: ` +
      `é uma pauta que levamos muito a sério. Já estamos trabalhando em ` +
      `ações concretas, e em breve compartilharemos mais detalhes.\n\n` +
      `Acompanhe nossas redes para ficar por dentro. Sua participação é fundamental!`;
    shortVersion = `Obrigado pela pergunta! Já estamos atuando em ${themeLabel} e em breve traremos novidades.`;
    emotionalVersion = `Sua pergunta mostra o quanto você se importa. E é por pessoas como você que a gente segue firme.`;
    institutionalVersion = `Resposta institucional: informamos que ${themeLabel} está em nossa pauta de prioridades. Em breve, divulgação oficial.`;
  } else {
    hook = `[BASTIDOR]\nO que acontece nos bastidores de ${themeLabel}.`;
    fullScript =
      `${hook}\n\n` +
      `Nem todo mundo vê, mas o trabalho acontece todos os dias.\n\n` +
      `[CENA]\n` +
      `Reuniões, planejamento, escuta, decisões.\n\n` +
      `[REFLEXÃO]\n` +
      `Bastidor não é segredo. É parte do processo democrático.\n\n` +
      `E a gente quer que você faça parte também.`;
    shortVersion = `Bastidor de ${themeLabel}: trabalho que acontece todo dia.`;
    emotionalVersion = `O que pouca gente vê: o coração por trás de cada decisão sobre ${themeLabel}.`;
    institutionalVersion = `Registro institucional das atividades relacionadas a ${themeLabel}. Transparência é o caminho.`;
  }

  const hashtags = `#${themeLabel.replace(/\s+/g, "")} #ComunicaçãoCidadã #PolíticaResponsável #Transparência #${formData.type.replace(/_/g, "")}`;

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    hook,
    fullScript,
    pauseMarks: "PAUSA DE LEITURA",
    cameraDir: "Formato texto, sem direção de câmera",
    sceneSuggestion: "Formato feed, sem cenário específico",
    captionSuggestion: fullScript,
    ctaSuggestion: "Compartilhe este conteúdo com quem precisa refletir sobre este tema.",
    hashtags,
    shortVersion,
    emotionalVersion,
    institutionalVersion,
  };
}
