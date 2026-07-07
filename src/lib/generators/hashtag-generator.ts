interface HashtagInput {
  profileName?: string;
  username?: string;
  city?: string;
  theme: string;
  style: string;
  audience?: string;
  frequentThemes?: string;
  suggestedHashtags?: string;
}

export function generateHashtags(input: HashtagInput): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();

  const add = (tag: string) => {
    const cleaned = tag.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (cleaned && !seen.has(cleaned)) {
      seen.add(cleaned);
      tags.push(`#${cleaned}`);
    }
  };

  if (input.suggestedHashtags) {
    input.suggestedHashtags.split(/[,#\s]+/).filter(Boolean).forEach((t) => add(t.trim()));
  }

  add(input.theme);
  add(input.style);
  if (input.city) add(input.city);
  if (input.profileName) add(input.profileName);
  if (input.username) add(input.username);
  if (input.audience) add(input.audience);

  const themeVariants: Record<string, string[]> = {
    educacao: ["educacao", "ensinopublico", "professores", "futuro"],
    saude: ["saude", "sus", "saudepublica", "bemestar"],
    seguranca: ["seguranca", "paz", "comunidadeprotegida", "vizinhanca"],
    emprego: ["emprego", "trabalho", "empregabilidade", "oportunidade"],
    moradia: ["moradia", "casa", "habitacao", "dignidade"],
    mobilidade: ["mobilidade", "transporte", "urbanismo", "acessibilidade"],
    cultura: ["cultura", "arte", "musicabrasileira", "diversidade"],
    juventude: ["juventude", "jovens", "futuro", "protagonismo"],
    esporte: ["esporte", "atividadefisica", "esportebrasil", "inclusao"],
    mulher: ["mulher", "empoderamento", "igualdade", "respeito"],
    familia: ["familia", "uniao", "valores", "amor"],
    empreendedorismo: ["empreendedorismo", "negocios", "inovacao", "microempreendedor"],
    periferia: ["periferia", "quebrada", "comunidade", "resistencia"],
    transparencia: ["transparencia", "prestacaodecontas", "govaberto", "eticapublica"],
    comunidade: ["comunidade", "uniaopopular", "mutirao", "solidariedade"],
    combate_fome: ["combateafome", "segurancaalimentar", "nutricao", "solidariedade"],
    projetos_sociais: ["projetossociais", "impactosocial", "transformacao", "voluntariado"],
  };

  const variants = themeVariants[input.theme];
  if (variants) {
    variants.forEach(add);
  }

  add("comunicacaopublica");
  add("politicacomresponsabilidade");

  if (tags.length > 15) {
    return tags.slice(0, 15);
  }

  return tags;
}

export function hashtagsToString(tags: string[]): string {
  return tags.join(" ");
}
