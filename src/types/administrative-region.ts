export interface AdministrativeRegionData {
  id: string
  officialNumber: number
  romanNumber: string
  officialName: string
  slug: string
  aliases: string[]
  stateCode: string
  countryCode: string
  divisionType: string
  status: string
  officialSourceName: string | null
  officialSourceUrl: string | null
  effectiveDate: string | null
  latitude: number | null
  longitude: number | null
}

export interface TerritoryLocalityData {
  id: string
  administrativeRegionId: string
  name: string
  slug: string
  type: string
  aliases: string[]
  status: string
  latitude: number | null
  longitude: number | null
}

export interface SavedTerritoryData {
  id: string
  profileId: string
  instagramAnalysisId: string | null
  administrativeRegionId: string
  localityId: string | null
  customLocalityName: string | null
  sector: string | null
  block: string | null
  referencePoint: string | null
  approximateAddress: string | null
  locationType: string | null
  title: string
  description: string | null
  status: string
}

export const ADMINISTRATIVE_REGIONS_SEED: Array<{
  officialNumber: number
  romanNumber: string
  officialName: string
  slug: string
  aliases: string[]
}> = [
  { officialNumber: 1, romanNumber: 'I', officialName: 'Plano Piloto', slug: 'plano-piloto', aliases: ['Brasília', 'Asa Norte', 'Asa Sul', 'Vila Planalto', 'Setor Central'] },
  { officialNumber: 2, romanNumber: 'II', officialName: 'Gama', slug: 'gama', aliases: [] },
  { officialNumber: 3, romanNumber: 'III', officialName: 'Taguatinga', slug: 'taguatinga', aliases: [] },
  { officialNumber: 4, romanNumber: 'IV', officialName: 'Brazlândia', slug: 'brazlandia', aliases: [] },
  { officialNumber: 5, romanNumber: 'V', officialName: 'Sobradinho', slug: 'sobradinho', aliases: [] },
  { officialNumber: 6, romanNumber: 'VI', officialName: 'Planaltina', slug: 'planaltina', aliases: [] },
  { officialNumber: 7, romanNumber: 'VII', officialName: 'Paranoá', slug: 'paranoa', aliases: [] },
  { officialNumber: 8, romanNumber: 'VIII', officialName: 'Núcleo Bandeirante', slug: 'nucleo-bandeirante', aliases: [] },
  { officialNumber: 9, romanNumber: 'IX', officialName: 'Ceilândia', slug: 'ceilandia', aliases: [] },
  { officialNumber: 10, romanNumber: 'X', officialName: 'Guará', slug: 'guara', aliases: [] },
  { officialNumber: 11, romanNumber: 'XI', officialName: 'Cruzeiro', slug: 'cruzeiro', aliases: [] },
  { officialNumber: 12, romanNumber: 'XII', officialName: 'Samanbaia', slug: 'samanbaia', aliases: [] },
  { officialNumber: 13, romanNumber: 'XIII', officialName: 'Santa Maria', slug: 'santa-maria', aliases: [] },
  { officialNumber: 14, romanNumber: 'XIV', officialName: 'São Sebastião', slug: 'sao-sebastiao', aliases: [] },
  { officialNumber: 15, romanNumber: 'XV', officialName: 'Recanto das Emas', slug: 'recanto-das-emas', aliases: [] },
  { officialNumber: 16, romanNumber: 'XVI', officialName: 'Lago Sul', slug: 'lago-sul', aliases: [] },
  { officialNumber: 17, romanNumber: 'XVII', officialName: 'Riacho Fundo', slug: 'riacho-fundo', aliases: [] },
  { officialNumber: 18, romanNumber: 'XVIII', officialName: 'Lago Norte', slug: 'lago-norte', aliases: [] },
  { officialNumber: 19, romanNumber: 'XIX', officialName: 'Candangolândia', slug: 'candangolandia', aliases: [] },
  { officialNumber: 20, romanNumber: 'XX', officialName: 'Águas Claras', slug: 'aguas-claras', aliases: [] },
  { officialNumber: 21, romanNumber: 'XXI', officialName: 'Riacho Fundo II', slug: 'riacho-fundo-ii', aliases: [] },
  { officialNumber: 22, romanNumber: 'XXII', officialName: 'Sudoeste/Octogonal', slug: 'sudoeste-octogonal', aliases: ['Sudoeste', 'Octogonal'] },
  { officialNumber: 23, romanNumber: 'XXIII', officialName: 'Varjão', slug: 'varjao', aliases: [] },
  { officialNumber: 24, romanNumber: 'XXIV', officialName: 'Park Way', slug: 'park-way', aliases: [] },
  { officialNumber: 25, romanNumber: 'XXV', officialName: 'SCIA/Estrutural', slug: 'scia-estrutural', aliases: ['Estrutural', 'Cidade Estrutural', 'SCIA'] },
  { officialNumber: 26, romanNumber: 'XXVI', officialName: 'Sobradinho II', slug: 'sobradinho-ii', aliases: [] },
  { officialNumber: 27, romanNumber: 'XXVII', officialName: 'Jardim Botânico', slug: 'jardim-botanico', aliases: [] },
  { officialNumber: 28, romanNumber: 'XXVIII', officialName: 'Itapoã', slug: 'itapoa', aliases: [] },
  { officialNumber: 29, romanNumber: 'XXIX', officialName: 'SIA', slug: 'sia', aliases: ['Setor de Indústria e Abastecimento'] },
  { officialNumber: 30, romanNumber: 'XXX', officialName: 'Vicente Pires', slug: 'vicente-pires', aliases: [] },
  { officialNumber: 31, romanNumber: 'XXXI', officialName: 'Fercal', slug: 'fercal', aliases: [] },
  { officialNumber: 32, romanNumber: 'XXXII', officialName: 'Sol Nascente/Pôr do Sol', slug: 'sol-nascente-por-do-sol', aliases: ['Sol Nascente', 'Pôr do Sol'] },
  { officialNumber: 33, romanNumber: 'XXXIII', officialName: 'Arniqueira', slug: 'arniqueira', aliases: [] },
  { officialNumber: 34, romanNumber: 'XXXIV', officialName: 'Arapoanga', slug: 'arapoanga', aliases: [] },
  { officialNumber: 35, romanNumber: 'XXXV', officialName: 'Água Quente', slug: 'agua-quente', aliases: [] },
]
