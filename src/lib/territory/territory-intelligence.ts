import type { TerritorialObjective, AnalysisDepth } from '@/types/territory'

interface RaProfile {
  number: number
  roman: string
  name: string
  year: string
  population: string
  category: 'central' | 'periferia_consolidada' | 'periferia_nova' | 'elite' | 'rural' | 'industrial' | 'vulneravel'
  characteristics: string[]
  commonIssues: string[]
  vocabulary: string[]
  avoidTerms: string[]
  stereotypes: string[]
  positivePoints: string[]
}

const raProfiles: Record<number, RaProfile> = {
  1: {
    number: 1, roman: 'I', name: 'Plano Piloto', year: '1960', population: '214.000',
    category: 'central',
    characteristics: ['Centro político-administrativo do país', 'Concentração de órgãos públicos e monumentos', 'População de alta escolaridade', 'Referência em urbanismo modernista'],
    commonIssues: ['Mobilidade urbana e estacionamento', 'Custo de vida elevado', 'Preservação do patrimônio histórico', 'Desigualdade de acesso a serviços entre asas'],
    vocabulary: ['patrimônio', 'urbanismo', 'modernismo', 'inclusão', 'acessibilidade', 'preservação', 'planejamento urbano'],
    avoidTerms: ['bairrismo', 'exclusão', 'elitismo'],
    stereotypes: ['Brasília é só o Plano Piloto', 'Lugar de gente rica', 'Sem vida noturna'],
    positivePoints: ['Referência arquitetônica mundial', 'Áreas verdes preservadas', 'Qualidade de vida', 'Eixão do Lazer'],
  },
  2: {
    number: 2, roman: 'II', name: 'Gama', year: '1960', population: '160.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade-satélite mais antiga', 'Tradição industrial e comercial', 'Forte identidade cultural', 'Classe trabalhadora'],
    commonIssues: ['Saúde pública sobrecarregada', 'Transporte público defasado', 'Falta de opções de lazer para jovens', 'Comércio local precisa de incentivo'],
    vocabulary: ['trabalhador', 'tradição', 'comunidade', 'resistência', 'cultura local'],
    avoidTerms: ['cidade dormitório', 'periferia violenta'],
    stereotypes: ['Cidade violenta', 'Lugar de passagem', 'Sem opções culturais'],
    positivePoints: ['Comércio forte', 'Tradição cultural', 'Gente trabalhadora', 'Feiras e comércio popular'],
  },
  3: {
    number: 3, roman: 'III', name: 'Taguatinga', year: '1958', population: '220.000',
    category: 'periferia_consolidada',
    characteristics: ['Segunda maior cidade do DF', 'Polo comercial e de serviços', 'Grande fluxo de pessoas', 'Diversidade cultural'],
    commonIssues: ['Mobilidade urbana', 'Segurança pública', 'Saúde', 'Ocupação desordenada'],
    vocabulary: ['desenvolvimento', 'comércio', 'mobilidade', 'diversidade', 'crescimento'],
    avoidTerms: ['caos urbano', 'violência generalizada'],
    stereotypes: ['Cidade grande demais', 'Trânsito insuportável'],
    positivePoints: ['Comércio vibrante', 'Universidades', 'Hospitais regionais', 'Opções de lazer'],
  },
  4: {
    number: 4, roman: 'IV', name: 'Brazlândia', year: '1933', population: '55.000',
    category: 'rural',
    characteristics: ['Cidade mais antiga do DF', 'Forte produção agrícola', 'Tradição rural', 'Clima de cidade do interior'],
    commonIssues: ['Infraestrutura rural precária', 'Acesso à saúde distante', 'Esgotamento sanitário', 'Transporte público escasso'],
    vocabulary: ['agricultura', 'produtor rural', 'interior', 'tradição', 'campo', 'feira'],
    avoidTerms: ['atrasado', 'roça'],
    stereotypes: ['Cidade pequena sem importância', 'Lugar de idosos'],
    positivePoints: ['Produção agrícola forte', 'Tradição e história', 'Qualidade de vida', 'Festa do Morango'],
  },
  5: {
    number: 5, roman: 'V', name: 'Sobradinho', year: '1960', population: '70.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade-satélite histórica', 'Área de transição urbano-rural', 'Classe média trabalhadora', 'Crescimento populacional'],
    commonIssues: ['Saneamento básico', 'Saúde pública', 'Esgoto a céu aberto em algumas áreas', 'Falta de creches'],
    vocabulary: ['crescimento', 'melhoria', 'infraestrutura', 'comunidade'],
    avoidTerms: ['abandonado', 'esquecido'],
    stereotypes: ['Cidade esquecida pelo governo'],
    positivePoints: ['Vista privilegiada', 'Clima agradável', 'Comunidade unida'],
  },
  6: {
    number: 6, roman: 'VI', name: 'Planaltina', year: '1859', population: '95.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade mais antiga da região', 'Forte cultura religiosa', 'Tradição histórica', 'População carente'],
    commonIssues: ['Saneamento básico', 'Saúde pública deficiente', 'Transporte público', 'Falta de equipamentos culturais'],
    vocabulary: ['história', 'tradição', 'fé', 'comunidade', 'origem'],
    avoidTerms: ['cidade velha', 'abandonada'],
    stereotypes: ['Cidade sem infraestrutura', 'Lugar religioso demais'],
    positivePoints: ['História centenária', 'Missa do Vaqueiro', 'Patrimônio histórico', 'Comunidade acolhedora'],
  },
  7: {
    number: 7, roman: 'VII', name: 'Paranoá', year: '1961', population: '50.000',
    category: 'periferia_consolidada',
    characteristics: ['Próximo ao Lago Paranoá', 'Área de expansão', 'Crescimento populacional', 'Contraste urbano-rural'],
    commonIssues: ['Saneamento', 'Saúde', 'Transporte', 'Ocupação irregular'],
    vocabulary: ['lago', 'natureza', 'expansão', 'potencial'],
    avoidTerms: ['inundação', 'área de risco'],
    stereotypes: ['Cidade alagada', 'Lugar distante'],
    positivePoints: ['Lago Paranoá', 'Potencial turístico', 'Crescimento ordenado'],
  },
  8: {
    number: 8, roman: 'VIII', name: 'Núcleo Bandeirante', year: '1956', population: '26.000',
    category: 'central',
    characteristics: ['Cidade pioneira da construção de Brasília', 'População de classe média', 'Proximidade com Plano Piloto', 'Bairro residencial'],
    commonIssues: ['Drenagem urbana', 'Mobilidade', 'Comércio local'],
    vocabulary: ['pioneiro', 'história', 'candango', 'construção'],
    avoidTerms: ['cidade dormitório'],
    stereotypes: ['Bairro sem identidade'],
    positivePoints: ['História candanga', 'Localização estratégica', 'Feira do Núcleo'],
  },
  9: {
    number: 9, roman: 'IX', name: 'Ceilândia', year: '1971', population: '350.000',
    category: 'periferia_consolidada',
    characteristics: ['Maior cidade do DF em população', 'Polo cultural periférico', 'Potencial econômico enorme', 'Juventude protagonista'],
    commonIssues: ['Saúde pública sobrecarregada', 'Transporte lotado', 'Falta de áreas de lazer', 'Desemprego juvenil'],
    vocabulary: ['periferia', 'resistência', 'cultura', 'potencial', 'juventude', 'empreendedorismo'],
    avoidTerms: ['violência', 'cidade violenta', 'favelização'],
    stereotypes: ['Lugar violento', 'Cidade grande sem governo', 'Só problema'],
    positivePoints: ['Cultura forte (Ceilambola)', 'Comércio pujante', 'Juventude engajada', 'Potencial empreendedor', 'Coletivos culturais'],
  },
  10: {
    number: 10, roman: 'X', name: 'Guará', year: '1969', population: '130.000',
    category: 'central',
    characteristics: ['Cidade-planejamento', 'Classe média emergente', 'Próximo ao Plano Piloto', 'Boa infraestrutura'],
    commonIssues: ['Trânsito', 'Saúde', 'Áreas verdes', 'Crescimento desordenado'],
    vocabulary: ['qualidade de vida', 'planejamento', 'desenvolvimento', 'moradia'],
    avoidTerms: ['bairro rico', 'elitista'],
    stereotypes: ['Cidade de classe média alta', 'Bairro dormitório'],
    positivePoints: ['Estrutura urbana', 'Parques', 'Feira do Guará', 'Localização privilegiada'],
  },
  11: {
    number: 11, roman: 'XI', name: 'Cruzeiro', year: '1960', population: '40.000',
    category: 'central',
    characteristics: ['Bairro residencial planejado', 'Próximo ao centro', 'População estável', 'Áreas verdes'],
    commonIssues: ['Comércio local limitado', 'Envelhecimento populacional', 'Mobilidade'],
    vocabulary: ['residencial', 'tranquilidade', 'qualidade de vida', 'família'],
    avoidTerms: ['bairro de velhos', 'parado'],
    stereotypes: ['Lugar de militares', 'Bairro sem vida'],
    positivePoints: ['Tranquilidade', 'Áreas verdes', 'Vizinhança', 'Setor de Clubes próximo'],
  },
  12: {
    number: 12, roman: 'XII', name: 'Samanbaia', year: '1989', population: '220.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade planejada anos 80/90', 'População jovem', 'Grande potencial econômico', 'Comércio em expansão'],
    commonIssues: ['Saúde', 'Transporte público', 'Falta de emprego local', 'Infraestrutura incompleta'],
    vocabulary: ['jovem', 'potencial', 'crescimento', 'futuro', 'desenvolvimento'],
    avoidTerms: ['periferia problema', 'cidade nova sem nada'],
    stereotypes: ['Cidade-dormitório', 'Sem opções de lazer'],
    positivePoints: ['Cidade planejada', 'População jovem', 'Comércio crescente', 'Potencial esportivo'],
  },
  13: {
    number: 13, roman: 'XIII', name: 'Santa Maria', year: '1994', population: '130.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade mais nova entre as satélites', 'População jovem e carente', 'Crescimento acelerado', 'Desafios sociais'],
    commonIssues: ['Saúde', 'Segurança', 'Emprego', 'Infraestrutura', 'Esgoto'],
    vocabulary: ['jovem', 'futuro', 'oportunidade', 'desenvolvimento', 'comunidade'],
    avoidTerms: ['violenta', 'abandonada'],
    stereotypes: ['Cidade violenta', 'Sem perspectiva'],
    positivePoints: ['Juventude', 'Potencial de crescimento', 'Universidades próximas'],
  },
  14: {
    number: 14, roman: 'XIV', name: 'São Sebastião', year: '1960', population: '110.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade com forte vocação ecológica', 'Próximo a áreas de preservação', 'Crescimento populacional', 'Potencial turístico'],
    commonIssues: ['Saneamento', 'Saúde', 'Transporte', 'Regularização fundiária'],
    vocabulary: ['natureza', 'ecologia', 'preservação', 'turismo', 'comunidade'],
    avoidTerms: ['isolado', 'longe'],
    stereotypes: ['Cidade distante', 'Sem infraestrutura'],
    positivePoints: ['Belezas naturais', 'Potencial turístico', 'Qualidade de vida', 'Lago São Sebastião'],
  },
  15: {
    number: 15, roman: 'XV', name: 'Recanto das Emas', year: '1994', population: '140.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade planejada', 'População jovem', 'Comércio local ativo', 'Desafios urbanos'],
    commonIssues: ['Saúde', 'Transporte', 'Falta de emprego', 'Áreas de lazer'],
    vocabulary: ['comunidade', 'desenvolvimento', 'juventude', 'potencial'],
    avoidTerms: ['periferia distante'],
    stereotypes: ['Cidade dormitório'],
    positivePoints: ['Cidade planejada', 'Comunidade organizada', 'Potencial esportivo'],
  },
  16: {
    number: 16, roman: 'XVI', name: 'Lago Sul', year: '1960', population: '32.000',
    category: 'elite',
    characteristics: ['Alta renda', 'Margem do Lago Paranoá', 'Residências de alto padrão', 'Baixa densidade'],
    commonIssues: ['Preservação ambiental', 'Mobilidade', 'Segurança patrimonial', 'Regularização fundiária'],
    vocabulary: ['qualidade de vida', 'preservação', 'meio ambiente', 'exclusividade'],
    avoidTerms: ['luxo', 'elite', 'ricos'],
    stereotypes: ['Bairro de rico', 'Desconectado da realidade'],
    positivePoints: ['Belezas naturais', 'Qualidade de vida', 'Preservação ambiental', 'Clube de Golfe'],
  },
  17: {
    number: 17, roman: 'XVII', name: 'Riacho Fundo', year: '1994', population: '35.000',
    category: 'periferia_consolidada',
    characteristics: ['Cidade pequena', 'Ambiente familiar', 'Crescimento controlado', 'Proximidade com Taguatinga'],
    commonIssues: ['Saúde', 'Transporte', 'Comércio limitado'],
    vocabulary: ['família', 'comunidade', 'qualidade de vida', 'tranquilidade'],
    avoidTerms: ['cidade pequena sem futuro'],
    stereotypes: ['Cidade sem opções'],
    positivePoints: ['Tranquilidade', 'Clima familiar', 'Proximidade com Taguatinga'],
  },
  18: {
    number: 18, roman: 'XVIII', name: 'Lago Norte', year: '1960', population: '35.000',
    category: 'elite',
    characteristics: ['Alta renda', 'Margem do Lago Paranoá', 'Condomínios de alto padrão', 'Contato com natureza'],
    commonIssues: ['Preservação ambiental', 'Mobilidade', 'Regularização', 'Segurança'],
    vocabulary: ['natureza', 'qualidade de vida', 'preservação', 'moradia digna'],
    avoidTerms: ['luxo', 'elite'],
    stereotypes: ['Bolha de ricos'],
    positivePoints: ['Lago Paranoá', 'Áreas verdes', 'Tranquilidade', 'Clubes'],
  },
  19: {
    number: 19, roman: 'XIX', name: 'Candangolândia', year: '1956', population: '16.000',
    category: 'central',
    characteristics: ['Cidade pioneira', 'População pequena', 'Tradição candanga', 'Proximidade com aeroporto'],
    commonIssues: ['Ruído aeroportuário', 'Comércio limitado', 'Infraestrutura', 'Saúde'],
    vocabulary: ['pioneiro', 'candango', 'história', 'resistência'],
    avoidTerms: ['cidade pequena sem importância'],
    stereotypes: ['Cidade esquecida'],
    positivePoints: ['História candanga', 'Localização', 'Comunidade acolhedora'],
  },
  20: {
    number: 20, roman: 'XX', name: 'Águas Claras', year: '1992', population: '150.000',
    category: 'central',
    characteristics: ['Maior crescimento vertical do DF', 'População jovem e dinâmica', 'Classe média alta', 'Metrô'],
    commonIssues: ['Verticalização excessiva', 'Mobilidade', 'Sobre carga de infraestrutura', 'Áreas verdes insuficientes'],
    vocabulary: ['verticalização', 'crescimento', 'juventude', 'dinamismo', 'moradia'],
    avoidTerms: ['caos urbano', 'engarrafamento'],
    stereotypes: ['Cidade de prédios', 'Lugar de jovens ricos'],
    positivePoints: ['Metrô', 'Comércio diverso', 'Parques', 'Vida noturna', 'População jovem'],
  },
  21: {
    number: 21, roman: 'XXI', name: 'Riacho Fundo II', year: '1994', population: '50.000',
    category: 'periferia_consolidada',
    characteristics: ['Expansão do Riacho Fundo', 'População trabalhadora', 'Crescimento recente', 'Desafios de infraestrutura'],
    commonIssues: ['Saúde', 'Transporte', 'Creches', 'Asfalto'],
    vocabulary: ['crescimento', 'comunidade', 'infraestrutura', 'melhoria'],
    avoidTerms: ['esquecido'],
    stereotypes: ['Cidade sem infraestrutura'],
    positivePoints: ['Crescimento organizado', 'Vizinhança'],
  },
  22: {
    number: 22, roman: 'XXII', name: 'Sudoeste/Octogonal', year: '1990', population: '55.000',
    category: 'central',
    characteristics: ['Bairro planejado moderno', 'Classe média alta', 'Próximo ao Plano Piloto', 'Boa infraestrutura'],
    commonIssues: ['Trânsito', 'Custo de vida', 'Áreas verdes'],
    vocabulary: ['planejamento', 'qualidade de vida', 'urbanismo', 'moradia'],
    avoidTerms: ['elite', 'bairro rico'],
    stereotypes: ['Bairro de Playboy'],
    positivePoints: ['Estrutura urbana', 'Parques', 'Comércio', 'Metrô'],
  },
  23: {
    number: 23, roman: 'XXIII', name: 'Varjão', year: '1995', population: '10.000',
    category: 'vulneravel',
    characteristics: ['Menor RA do DF', 'Comunidade carente', 'Área de ocupação', 'Desafios sociais intensos'],
    commonIssues: ['Saneamento', 'Saúde', 'Educação', 'Habitação precária', 'Regularização fundiária'],
    vocabulary: ['comunidade', 'luta', 'direitos', 'moradia digna', 'inclusão'],
    avoidTerms: ['favelização', 'invasão'],
    stereotypes: ['Lugar esquecido', 'Sem solução'],
    positivePoints: ['Comunidade unida', 'Potencial de transformação', 'Localização central'],
  },
  24: {
    number: 24, roman: 'XXIV', name: 'Park Way', year: '1995', population: '25.000',
    category: 'elite',
    characteristics: ['Condomínios de alto padrão', 'Área de chácaras', 'Contato com natureza', 'Baixa densidade'],
    commonIssues: ['Regularização fundiária', 'Transporte', 'Saneamento rural'],
    vocabulary: ['natureza', 'qualidade de vida', 'condomínio', 'preservação'],
    avoidTerms: ['luxo', 'elite'],
    stereotypes: ['Lugar de ricos isolados'],
    positivePoints: ['Natureza preservada', 'Tranquilidade', 'Qualidade de vida'],
  },
  25: {
    number: 25, roman: 'XXV', name: 'SCIA/Estrutural', year: '2004', population: '40.000',
    category: 'vulneravel',
    characteristics: ['Antigo lixão', 'Comunidade resiliente', 'Processo de urbanização', 'Superação'],
    commonIssues: ['Saneamento', 'Saúde', 'Habitação', 'Contaminação do solo', 'Estigma social'],
    vocabulary: ['superação', 'resiliência', 'dignidade', 'transformação', 'esperança'],
    avoidTerms: ['lixão', 'favela', 'miserável'],
    stereotypes: ['Cidade do lixo', 'Lugar sem futuro'],
    positivePoints: ['História de superação', 'Comunidade forte', 'Processo de urbanização', 'Potencial de transformação'],
  },
  26: {
    number: 26, roman: 'XXVI', name: 'Sobradinho II', year: '1995', population: '45.000',
    category: 'periferia_consolidada',
    characteristics: ['Expansão do Sobradinho', 'Área de transição', 'Crescimento recente', 'População jovem'],
    commonIssues: ['Saneamento', 'Saúde', 'Transporte', 'Infraestrutura incompleta'],
    vocabulary: ['crescimento', 'expansão', 'infraestrutura', 'comunidade'],
    avoidTerms: ['esquecido'],
    stereotypes: ['Longe de tudo'],
    positivePoints: ['Crescimento ordenado', 'Potencial de desenvolvimento'],
  },
  27: {
    number: 27, roman: 'XXVII', name: 'Jardim Botânico', year: '2004', population: '30.000',
    category: 'elite',
    characteristics: ['Condomínios de alto padrão', 'Reserva ecológica', 'Área nobre', 'Expansão imobiliária'],
    commonIssues: ['Regularização fundiária', 'Mobilidade', 'Preservação ambiental', 'Infraestrutura'],
    vocabulary: ['natureza', 'preservação', 'qualidade de vida', 'condomínio', 'meio ambiente'],
    avoidTerms: ['elite', 'bolha'],
    stereotypes: ['Lugar de ricos isolados'],
    positivePoints: ['Jardim Botânico', 'Natureza', 'Qualidade de vida', 'Tranquilidade'],
  },
  28: {
    number: 28, roman: 'XXVIII', name: 'Itapoã', year: '2004', population: '60.000',
    category: 'periferia_nova',
    characteristics: ['Cidade nova', 'Expansão urbana', 'População jovem e carente', 'Ocupação recente'],
    commonIssues: ['Infraestrutura básica', 'Saúde', 'Transporte', 'Saneamento', 'Regularização'],
    vocabulary: ['novo', 'crescimento', 'oportunidade', 'futuro', 'construção'],
    avoidTerms: ['invasão', 'ocupação ilegal'],
    stereotypes: ['Cidade sem nada'],
    positivePoints: ['Potencial de crescimento', 'Juventude', 'Oportunidade de planejamento'],
  },
  29: {
    number: 29, roman: 'XXIX', name: 'SIA', year: '1970', population: '2.000',
    category: 'industrial',
    characteristics: ['Setor de Indústria e Abastecimento', 'Polo logístico e industrial', 'Baixa população residente', 'Grande fluxo de trabalhadores'],
    commonIssues: ['Mobilidade dos trabalhadores', 'Infraestrutura industrial', 'Saúde do trabalhador', 'Transporte público'],
    vocabulary: ['indústria', 'trabalho', 'geração de emprego', 'desenvolvimento econômico', 'logística'],
    avoidTerms: ['poluição', 'abandonado'],
    stereotypes: ['Só indústria', 'Lugar sem vida'],
    positivePoints: ['Geração de emprego', 'Potencial logístico', 'Movimento econômico'],
  },
  30: {
    number: 30, roman: 'XXX', name: 'Vicente Pires', year: '2009', population: '75.000',
    category: 'periferia_nova',
    characteristics: ['Crescimento explosivo', 'Ocupação desordenada', 'Classe média emergente', 'Desafios urbanos'],
    commonIssues: ['Saneamento', 'Asfalto', 'Regularização fundiária', 'Infraestrutura', 'Drenagem'],
    vocabulary: ['crescimento', 'regularização', 'infraestrutura', 'moradia', 'desenvolvimento'],
    avoidTerms: ['caos urbano', 'desorganizado'],
    stereotypes: ['Cidade bagunçada', 'Lugar sem planejamento'],
    positivePoints: ['Dinamismo', 'Potencial imobiliário', 'Comércio crescente'],
  },
  31: {
    number: 31, roman: 'XXXI', name: 'Fercal', year: '2012', population: '9.000',
    category: 'rural',
    characteristics: ['RA mais nova à época', 'Área rural', 'População pequena', 'Produção de calcário'],
    commonIssues: ['Saúde', 'Transporte', 'Infraestrutura rural', 'Saneamento'],
    vocabulary: ['rural', 'campo', 'calcário', 'trabalhador rural', 'interior'],
    avoidTerms: ['isolado', 'esquecido'],
    stereotypes: ['Lugar longe de tudo'],
    positivePoints: ['Tranquilidade', 'Tradição rural', 'Comunidade pequena e unida'],
  },
  32: {
    number: 32, roman: 'XXXII', name: 'Sol Nascente/Pôr do Sol', year: '2013', population: '90.000',
    category: 'vulneravel',
    characteristics: ['Maior ocupação urbana do DF', 'Crescimento acelerado', 'Desafios sociais imensos', 'População jovem'],
    commonIssues: ['Saneamento', 'Saúde', 'Regularização fundiária', 'Infraestrutura', 'Esgoto', 'Energia'],
    vocabulary: ['regularização', 'dignidade', 'direitos', 'moradia', 'inclusão', 'cidadania'],
    avoidTerms: ['invasão', 'favela', 'ilegal'],
    stereotypes: ['Favela', 'Lugar sem lei', 'Sem solução'],
    positivePoints: ['Comunidade organizada', 'Potencial de transformação', 'Resiliência', 'Luta por direitos'],
  },
  33: {
    number: 33, roman: 'XXXIII', name: 'Arniqueira', year: '2019', population: '35.000',
    category: 'periferia_nova',
    characteristics: ['RA mais recente', 'Área em consolidação', 'Ocupação mista', 'Desafios de infraestrutura'],
    commonIssues: ['Regularização fundiária', 'Saneamento', 'Infraestrutura', 'Saúde'],
    vocabulary: ['nova', 'regularização', 'consolidação', 'desenvolvimento', 'planejamento'],
    avoidTerms: ['invasão', 'ilegal'],
    stereotypes: ['Cidade sem identidade'],
    positivePoints: ['Potencial de planejamento', 'Localização estratégica'],
  },
  34: {
    number: 34, roman: 'XXXIV', name: 'Arapoanga', year: '2020', population: '40.000',
    category: 'periferia_nova',
    characteristics: ['RA mais jovem', 'Área em ocupação', 'Desafios de urbanização', 'População em formação'],
    commonIssues: ['Infraestrutura básica', 'Saúde', 'Transporte', 'Regularização', 'Saneamento'],
    vocabulary: ['novo', 'começo', 'futuro', 'construção', 'comunidade'],
    avoidTerms: ['invasão', 'ilegal'],
    stereotypes: ['Cidade que não existe'],
    positivePoints: ['Potencial de planejamento', 'Começar do zero organizado'],
  },
  35: {
    number: 35, roman: 'XXXV', name: 'Água Quente', year: '2020', population: '25.000',
    category: 'periferia_nova',
    characteristics: ['RA mais jovem', 'Área de expansão', 'Desafios iniciais', 'Potencial de crescimento'],
    commonIssues: ['Infraestrutura', 'Saúde', 'Transporte', 'Regularização', 'Saneamento'],
    vocabulary: ['novo', 'começo', 'futuro', 'esperança', 'desenvolvimento'],
    avoidTerms: ['invasão', 'ilegal'],
    stereotypes: ['Lugar longe'],
    positivePoints: ['Potencial de crescimento', 'Começo organizado'],
  },
}

const categoryLabels: Record<string, string> = {
  central: 'região central e estruturada',
  periferia_consolidada: 'periferia consolidada',
  periferia_nova: 'periferia em expansão',
  elite: 'região de alta renda',
  rural: 'região rural',
  industrial: 'polo industrial',
  vulneravel: 'comunidade em processo de urbanização',
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function generateTerritoryAnalysis(regionId: number, regionName: string, context: string, objectives: string[], depth: AnalysisDepth = 'moderada') {
  const profile = raProfiles[regionId]
  if (!profile) {
    return generateGenericAnalysis(regionName, context, objectives, depth)
  }

  const objText = objectives.join(', ').replace(/_/g, ' ')
  const hasContext = context.trim().length > 0

  const problemCount = depth === 'profunda' ? 5 : depth === 'moderada' ? 3 : 2
  const vocabCount = depth === 'profunda' ? 12 : depth === 'moderada' ? 8 : 5

  const problems = pickN(profile.commonIssues, problemCount)
  const vocab = pickN([...profile.vocabulary, ...(hasContext ? extractKeywords(context, 3) : [])], vocabCount)
  const avoid = pickN(profile.avoidTerms, 3)
  const sensitivities = pickN(profile.stereotypes, 2)

  const suggestedHook = hasContext
    ? pick([
        `Você sabia que ${context.substring(0, 60)}...? Vou te contar mais sobre isso.`,
        `${context.substring(0, 50)} — essa é a realidade de quem vive no ${regionName}.`,
        `O que está acontecendo em ${regionName}? ${context.substring(0, 60)}`,
        `${regionName} vive um momento que merece atenção: ${context.substring(0, 60)}`,
      ])
    : pick([
        `Hoje eu tô no ${regionName} e quero conversar com você sobre a realidade daqui.`,
        `Deixa eu te contar o que a gente encontra quando chega no ${regionName}.`,
        `O ${regionName} é muito mais do que você imagina. Vem comigo.`,
      ])

  const centralMessage = hasContext
    ? pick([
        `${context.substring(0, 80)} — e é sobre isso que precisamos conversar e agir.`,
        `A mensagem é clara: ${context.substring(0, 80)}. Não podemos ignorar.`,
      ])
    : pick([
        `${regionName} precisa de atenção, cuidado e políticas públicas que respeitem sua história e seu potencial.`,
        `O desenvolvimento do ${regionName} passa por ouvir sua gente e valorizar sua identidade.`,
      ])

  const narrativeAngle = pick([
    `Abordagem baseada na escuta da comunidade, destacando os anseios locais e propondo diálogo.`,
    `Tom de reconhecimento e valorização do território, mostrando conhecimento prévio da realidade local.`,
    `Narrativa de compromisso e ação, conectando as demandas históricas com propostas concretas.`,
    `Ângulo de superação e potencial, destacando os pontos positivos sem ignorar os desafios.`,
    `Abordagem com foco em juventude e futuro, conectando o território às novas gerações.`,
  ])

  let scenarioSuggestion: string
  if (profile.category === 'central') {
    scenarioSuggestion = pick([
      `Gravar em uma praça ou área pública movimentada do ${regionName}, com pessoas ao fundo para dar sensação de pertencimento.`,
      `Ambiente urbano com a arquitetura característica do ${regionName} ao fundo.`,
    ])
  } else if (profile.category === 'elite') {
    scenarioSuggestion = pick([
      `Gravar em área arborizada ou com vista para o Lago, transmitindo tranquilidade e qualidade de vida.`,
      `Ambiente residencial com áreas verdes ao fundo, destacando o equilíbrio entre urbano e natureza.`,
    ])
  } else if (profile.category === 'rural') {
    scenarioSuggestion = pick([
      `Gravar em área rural ou produtiva, com plantações ou criação ao fundo, valorizando a tradição do campo.`,
      `Ambiente de feira ou propriedade rural, destacando a produção local e o trabalho no campo.`,
    ])
  } else if (profile.category === 'vulneravel') {
    scenarioSuggestion = pick([
      `Gravar em espaço comunitário, com moradores ao fundo, transmitindo acolhimento e escuta.`,
      `Ambiente que mostre a transformação urbana, destacando melhorias e o potencial da comunidade.`,
    ])
  } else if (profile.category === 'industrial') {
    scenarioSuggestion = pick([
      `Gravar em via movimentada do SIA, com galpões e comércio ao fundo, destacando o movimento econômico.`,
      `Ambiente de trabalho, com trabalhadores e atividade industrial ao fundo.`,
    ])
  } else {
    scenarioSuggestion = pick([
      `Gravar em ponto movimentado do ${regionName}, com comércio local e moradores ao fundo.`,
      `Ambiente que represente o dia a dia do ${regionName}, valorizando a rotina da comunidade.`,
    ])
  }

  const recordingPoints = pickN(
    [
      `Praça central ou ponto de referência do ${regionName}`,
      `Feira local ou mercado popular`,
      `Espaço cultural ou quadra poliesportiva`,
      `Unidade de saúde ou centro de referência`,
      `Parada de ônibus ou estação de metrô`,
      `Margem do Lago ou mirante com vista`,
      `Comércio local ou rua movimentada`,
      `Escola ou centro educacional`,
      `Área verde ou parque urbano`,
      `Associação de moradores ou centro comunitário`,
    ],
    depth === 'profunda' ? 5 : 3,
  )

  const opportunities = profile.positivePoints.map(p => `Valorizar: ${p.toLowerCase()}`)

  const termsToAvoid = [
    ...avoid,
    ...(profile.stereotypes.map(s => `evitar visão estereotipada: ${s.toLowerCase()}`)),
  ]

  const factsToVerify = hasContext
    ? [
        `Verificar dados oficiais sobre ${context.substring(0, 50).toLowerCase()} na região`,
        `Confirmar informações com lideranças locais do ${regionName}`,
        `Checar estatísticas atualizadas da RA junto à CODEPLAN`,
      ]
    : [
        `Buscar dados populacionais e socioeconômicos do ${regionName} na CODEPLAN`,
        `Identificar lideranças comunitárias para escuta ativa`,
        `Verificar equipamentos públicos disponíveis na região`,
      ]

  const shortNarrative = hasContext
    ? [
        `Estou aqui no ${regionName}, e quero falar sobre algo que me chamou atenção. `,
        `${context.substring(0, 120)}. `,
        objText ? `Meu compromisso aqui é: ${objText}. ` : '',
        `${regionName} tem muito potencial, e a gente ta junto nessa caminhada.`,
      ].filter(Boolean).join('')
    : [
        `O ${regionName} é uma ${categoryLabels[profile.category] || 'região'} que carrega história, luta e potencial. `,
        `Aqui a gente encontra ${pick(profile.characteristics)?.toLowerCase() || 'gente trabalhadora'}, `,
        `mas também desafios que precisam de atenção. `,
        objText ? `É por isso que meu compromisso aqui é: ${objText}. ` : '',
        `${regionName} merece cuidado, escuta e ação. E é isso que vamos fazer.`,
      ].filter(Boolean).join('')

  const secondaryThemes = pickN(
    [...profile.commonIssues, ...profile.positivePoints].map(s => s.toLowerCase()),
    3,
  ).join('\n')

  const actors = [
    'Moradores e lideranças comunitárias',
    'Comerciantes e empreendedores locais',
    `${regionName}: associação de moradores`,
    ...(profile.category === 'rural' ? ['Produtores rurais', 'Trabalhadores do campo'] : []),
    ...(profile.category === 'vulneravel' ? ['Movimentos sociais', 'Coletivos culturais'] : []),
    ...(profile.category === 'periferia_consolidada' || profile.category === 'periferia_nova' ? ['Juventude organizada', 'Coletivos juvenis'] : []),
  ]

  const institutions = [
    'Administração Regional',
    ...(profile.category === 'rural' ? ['EMATER', 'Secretaria de Agricultura'] : []),
    'Secretaria de Saúde',
    'Secretaria de Educação',
    'CODEPLAN',
  ]

  const relatedPublic = [
    profile.category === 'elite' ? 'Moradores de condomínios' :
    profile.category === 'rural' ? 'População do campo' :
    profile.category === 'industrial' ? 'Trabalhadores da indústria e comércio' :
    'Moradores da região',
    'Comerciantes locais',
    'Jovens e estudantes',
    'Lideranças comunitárias',
  ]

  let territorySummary: string
  if (profile.category === 'central') {
    territorySummary = `${regionName} (RA ${profile.roman}) é uma ${categoryLabels[profile.category]} do Distrito Federal. Com cerca de ${profile.population} habitantes, destaca-se por ${pick(profile.characteristics)?.toLowerCase() || 'sua infraestrutura'}. Sua localização estratégica a torna relevante para a comunicação política.`
  } else if (profile.category === 'elite') {
    territorySummary = `${regionName} (RA ${profile.roman}) é uma ${categoryLabels[profile.category]} do DF, com aproximadamente ${profile.population} habitantes. Caracteriza-se por ${pick(profile.characteristics)?.toLowerCase() || 'alta qualidade de vida'}, em contato com áreas preservadas. A comunicação política deve valorizar o equilíbrio entre desenvolvimento e natureza.`
  } else if (profile.category === 'rural') {
    territorySummary = `${regionName} (RA ${profile.roman}) é uma ${categoryLabels[profile.category]} do DF, com cerca de ${profile.population} habitantes. Com forte tradição ${pick(profile.characteristics)?.toLowerCase() || 'agrícola'}, mantém características do interior e valoriza suas raízes.`
  } else if (profile.category === 'vulneravel') {
    territorySummary = `${regionName} (RA ${profile.roman}) é uma ${categoryLabels[profile.category]} do DF. Com aproximadamente ${profile.population} habitantes, a região tem uma história marcada por ${pick(profile.characteristics)?.toLowerCase() || 'luta e superação'}. A comunicação deve respeitar essa trajetória e destacar o potencial de transformação.`
  } else if (profile.category === 'industrial') {
    territorySummary = `${regionName} (RA ${profile.roman}) é o ${categoryLabels[profile.category]} do DF. Concentra atividades logísticas e industriais, com grande fluxo de trabalhadores. A comunicação deve focar em desenvolvimento econômico e geração de emprego.`
  } else {
    territorySummary = `${regionName} (RA ${profile.roman}) é uma ${categoryLabels[profile.category] || 'região administrativa'} do Distrito Federal, com aproximadamente ${profile.population} habitantes. ${pick(profile.characteristics) || 'Tem grande potencial de desenvolvimento'}.`
  }

  const mainTheme = hasContext
    ? pick([
        `Contexto local: ${context.substring(0, 100)}`,
        `Tema central identificado: ${extractMainTheme(context, profile, regionName)}`,
        `A partir do contexto fornecido, o tema principal é: ${context.substring(0, 80)}`,
      ])
    : pick([
        `Panorama geral do ${regionName}: desenvolvimento, desafios e potencialidades.`,
        `Realidade socioeconômica do ${regionName} e suas demandas prioritárias.`,
        `Identidade e potencial do ${regionName} como território de comunicação política.`,
      ])

  const confidence = depth === 'profunda' ? 0.85 : depth === 'moderada' ? 0.75 : 0.6

  return {
    territorySummary,
    contextSummary: context || 'Nenhum contexto adicional fornecido.',
    mainTheme,
    secondaryThemes,
    identifiedProblems: problems.join('\n'),
    opportunities: opportunities.slice(0, problemCount).join('\n'),
    involvedActors: actors.join('\n'),
    mentionedInstitutions: institutions.join('\n'),
    relatedPublic: relatedPublic.join('\n'),
    localSensitivities: sensitivities.join('\n'),
    recommendedVocabulary: vocab.join('\n'),
    termsToAvoid: termsToAvoid.slice(0, 4).join('\n'),
    narrativeAngle,
    suggestedHook,
    centralMessage,
    recommendedApproach: pick([
      `Abordagem direta e respeitosa, mostrando conhecimento do território e propondo escuta ativa.`,
      `Tom propositivo e otimista, destacando potencialidades sem ignorar desafios.`,
      `Comunicação baseada em dados e histórias reais, conectando política e vida cotidiana.`,
      `Linguagem acessível e próxima, valorizando a identidade local e a participação popular.`,
    ]),
    scenarioSuggestion,
    recordingPoints: recordingPoints.join('\n'),
    confirmedFacts: pickN([
      `${regionName} é a RA ${profile.roman} do DF`,
      `População estimada: ${profile.population} habitantes`,
      `${pick(profile.characteristics) || ''}`,
      `Fundação: ${profile.year}`,
    ], 2).join('\n'),
    userProvidedFacts: context || '',
    aiInferences: pickN([
      `Região com potencial de engajamento político em pautas de ${pick(profile.commonIssues)?.toLowerCase() || 'desenvolvimento urbano'}`,
      `A comunicação deve evitar termos que reforcem estereótipos sobre a região`,
      `O tom mais adequado é o de reconhecimento e compromisso com melhorias`,
    ], 2).join('\n'),
    factsToVerify: factsToVerify.slice(0, 3).join('\n'),
    generalizationRisks: pickN([
      `Evite generalizar a realidade do ${regionName} para todo o DF`,
      `Cada localidade dentro do ${regionName} pode ter realidades distintas`,
      `Não assuma que todos os moradores compartilham das mesmas opiniões`,
    ], 2).join('\n'),
    communicationRisks: pickN([
      `Cuidado ao abordar temas sensíveis como ${pick(profile.commonIssues)?.toLowerCase() || 'infraestrutura'} sem dados concretos`,
      `Evite promessas que não podem ser cumpridas`,
      `Não desconsidere as lutas históricas da comunidade`,
      `Atenção para não parecer oportunista ao visitar a região`,
    ], 2).join('\n'),
    shortNarrative,
    sourcesUsed: [
      'Perfil da RA - CODEPLAN',
      'Dados populacionais oficiais',
      'Análise territorial template-based',
      ...(hasContext ? ['Contexto fornecido pelo usuário'] : []),
    ].join('\n'),
    confidence,
  }
}

function generateGenericAnalysis(regionName: string, context: string, objectives: string[], depth: AnalysisDepth) {
  const objText = objectives.join(', ').replace(/_/g, ' ')
  const hasContext = context.trim().length > 0
  const confidence = depth === 'profunda' ? 0.7 : depth === 'moderada' ? 0.6 : 0.5

  return {
    territorySummary: `${regionName} é uma Região Administrativa do Distrito Federal, com características e demandas específicas que merecem atenção na comunicação política.`,
    contextSummary: context || 'Nenhum contexto adicional fornecido.',
    mainTheme: hasContext
      ? `Contexto informado: ${context.substring(0, 120)}`
      : `Panorama geral do ${regionName}`,
    secondaryThemes: 'Desenvolvimento local\nParticipação comunitária',
    identifiedProblems: hasContext
      ? `Desafios identificados a partir do contexto`
      : 'Demandas por infraestrutura e serviços públicos',
    opportunities: 'Diálogo com a comunidade\nValorização da identidade local',
    involvedActors: 'Moradores\nLideranças comunitárias\nComerciantes',
    mentionedInstitutions: 'Administração Regional\nSecretarias de Estado',
    relatedPublic: 'População local\nJovens\nTrabalhadores',
    localSensitivities: 'Evitar generalizações sobre a região',
    recommendedVocabulary: 'comunidade, desenvolvimento, diálogo, participação',
    termsToAvoid: 'generalizações, estereótipos',
    narrativeAngle: 'Abordagem de escuta e reconhecimento do território.',
    suggestedHook: hasContext
      ? `Você sabia que ${context.substring(0, 60)}...?`
      : `Hoje eu tô no ${regionName} e quero conversar com você.`,
    centralMessage: `${regionName} merece atenção, cuidado e políticas públicas eficientes.`,
    recommendedApproach: 'Tom respeitoso e propositivo.',
    scenarioSuggestion: `Gravar em ponto representativo do ${regionName}.`,
    recordingPoints: `Praça central do ${regionName}\nComércio local`,
    confirmedFacts: `${regionName} é uma RA do Distrito Federal`,
    userProvidedFacts: context,
    aiInferences: 'Região com potencial de comunicação política',
    factsToVerify: 'Buscar dados oficiais sobre a região',
    generalizationRisks: 'Evite generalizar a realidade local',
    communicationRisks: 'Cuidado ao abordar temas sem dados concretos',
    shortNarrative: hasContext
      ? `${context.substring(0, 150)}. ${objText ? `Meu compromisso: ${objText}.` : ''}`
      : `${regionName} é uma região que merece atenção e cuidado.`,
    sourcesUsed: 'Análise territorial template-based',
    confidence,
  }
}

function extractKeywords(text: string, count: number): string[] {
  const words = text.toLowerCase()
    .replace(/[^a-záéíóúãõâêîôûçàèìòùäëïöüñ\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4)
  const unique = [...new Set(words)]
  return pickN(unique, count)
}

function extractMainTheme(context: string, profile: RaProfile, regionName: string): string {
  const contextLower = context.toLowerCase()
  for (const issue of profile.commonIssues) {
    if (contextLower.includes(issue.toLowerCase().substring(0, 10))) {
      return issue
    }
  }
  return `Situação atual do ${regionName}: ${context.substring(0, 80)}`
}
