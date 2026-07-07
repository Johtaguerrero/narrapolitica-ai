interface CaptionInput {
  theme: string;
  publicName?: string;
  username?: string;
  bioSummary?: string;
  hook?: string;
  style: string;
  audience?: string;
  hashtags: string;
  cta?: string;
}

export function generateCaption(input: CaptionInput): string {
  const name = input.publicName || input.username || "";
  const themeLabel = input.theme.replace(/_/g, " ");

  const impactLines: string[] = [
    `${themeLabel} é mais do que pauta — é compromisso.`,
    `${themeLabel} não é promessa, é prioridade.`,
    `Falar sobre ${themeLabel} é falar de gente.`,
    `${themeLabel} transforma realidades.`,
    `O que você sabe sobre ${themeLabel}?`,
  ];

  const impact = impactLines[Math.floor(Math.random() * impactLines.length)];

  const explanations: string[] = [
    `É por isso que seguimos trabalhando com responsabilidade, escutando a população e construindo soluções reais.`,
    `A comunicação pública de verdade começa com diálogo, transparência e ação.`,
    `Porque política se faz com conversa sincera, não com discurso pronto.`,
    `Informação de qualidade é o primeiro passo para uma sociedade mais participativa.`,
    `É sobre conectar, ouvir e agir — sempre com foco em quem mais precisa.`,
  ];

  const explanation = explanations[Math.floor(Math.random() * explanations.length)];

  const ctas: string[] = [
    `E você, o que pensa sobre ${themeLabel}? Deixa aqui seu comentário.`,
    `Compartilhe com alguém que precisa refletir sobre esse tema.`,
    `O que você acha que ainda pode ser feito? Sua opinião importa.`,
    `Vamos construir juntos? Deixe sua ideia nos comentários.`,
    `Sua voz também faz parte dessa conversa. Comente abaixo.`,
  ];

  const cta = input.cta || ctas[Math.floor(Math.random() * ctas.length)];

  let caption = `${impact}\n\n${explanation}\n\n${cta}`;

  if (name) {
    const intros: string[] = [
      `${name} fala sobre ${themeLabel}.`,
      `${name} compartilha uma reflexão sobre ${themeLabel}.`,
      `${name} conversa sobre ${themeLabel} — e você é nosso convidado.`,
    ];
    caption = `${intros[Math.floor(Math.random() * intros.length)]}\n\n${caption}`;
  }

  caption += `\n\n${input.hashtags}`;

  return caption;
}
