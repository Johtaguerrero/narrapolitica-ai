import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

const REGIONS = [
  { n: 1, r: 'I', name: 'Plano Piloto', slug: 'plano-piloto', aliases: ['Brasília', 'Asa Norte', 'Asa Sul', 'Vila Planalto', 'Setor Central'] },
  { n: 2, r: 'II', name: 'Gama', slug: 'gama', aliases: [] },
  { n: 3, r: 'III', name: 'Taguatinga', slug: 'taguatinga', aliases: [] },
  { n: 4, r: 'IV', name: 'Brazlândia', slug: 'brazlandia', aliases: [] },
  { n: 5, r: 'V', name: 'Sobradinho', slug: 'sobradinho', aliases: [] },
  { n: 6, r: 'VI', name: 'Planaltina', slug: 'planaltina', aliases: [] },
  { n: 7, r: 'VII', name: 'Paranoá', slug: 'paranoa', aliases: [] },
  { n: 8, r: 'VIII', name: 'Núcleo Bandeirante', slug: 'nucleo-bandeirante', aliases: [] },
  { n: 9, r: 'IX', name: 'Ceilândia', slug: 'ceilandia', aliases: [] },
  { n: 10, r: 'X', name: 'Guará', slug: 'guara', aliases: [] },
  { n: 11, r: 'XI', name: 'Cruzeiro', slug: 'cruzeiro', aliases: [] },
  { n: 12, r: 'XII', name: 'Samanbaia', slug: 'samanbaia', aliases: [] },
  { n: 13, r: 'XIII', name: 'Santa Maria', slug: 'santa-maria', aliases: [] },
  { n: 14, r: 'XIV', name: 'São Sebastião', slug: 'sao-sebastiao', aliases: [] },
  { n: 15, r: 'XV', name: 'Recanto das Emas', slug: 'recanto-das-emas', aliases: [] },
  { n: 16, r: 'XVI', name: 'Lago Sul', slug: 'lago-sul', aliases: [] },
  { n: 17, r: 'XVII', name: 'Riacho Fundo', slug: 'riacho-fundo', aliases: [] },
  { n: 18, r: 'XVIII', name: 'Lago Norte', slug: 'lago-norte', aliases: [] },
  { n: 19, r: 'XIX', name: 'Candangolândia', slug: 'candangolandia', aliases: [] },
  { n: 20, r: 'XX', name: 'Águas Claras', slug: 'aguas-claras', aliases: [] },
  { n: 21, r: 'XXI', name: 'Riacho Fundo II', slug: 'riacho-fundo-ii', aliases: [] },
  { n: 22, r: 'XXII', name: 'Sudoeste/Octogonal', slug: 'sudoeste-octogonal', aliases: ['Sudoeste', 'Octogonal'] },
  { n: 23, r: 'XXIII', name: 'Varjão', slug: 'varjao', aliases: [] },
  { n: 24, r: 'XXIV', name: 'Park Way', slug: 'park-way', aliases: [] },
  { n: 25, r: 'XXV', name: 'SCIA/Estrutural', slug: 'scia-estrutural', aliases: ['Estrutural', 'Cidade Estrutural', 'SCIA'] },
  { n: 26, r: 'XXVI', name: 'Sobradinho II', slug: 'sobradinho-ii', aliases: [] },
  { n: 27, r: 'XXVII', name: 'Jardim Botânico', slug: 'jardim-botanico', aliases: [] },
  { n: 28, r: 'XXVIII', name: 'Itapoã', slug: 'itapoa', aliases: [] },
  { n: 29, r: 'XXIX', name: 'SIA', slug: 'sia', aliases: ['Setor de Indústria e Abastecimento'] },
  { n: 30, r: 'XXX', name: 'Vicente Pires', slug: 'vicente-pires', aliases: [] },
  { n: 31, r: 'XXXI', name: 'Fercal', slug: 'fercal', aliases: [] },
  { n: 32, r: 'XXXII', name: 'Sol Nascente/Pôr do Sol', slug: 'sol-nascente-por-do-sol', aliases: ['Sol Nascente', 'Pôr do Sol'] },
  { n: 33, r: 'XXXIII', name: 'Arniqueira', slug: 'arniqueira', aliases: [] },
  { n: 34, r: 'XXXIV', name: 'Arapoanga', slug: 'arapoanga', aliases: [] },
  { n: 35, r: 'XXXV', name: 'Água Quente', slug: 'agua-quente', aliases: [] },
]

async function main() {
  const client = createClient({
    url: url || 'file:./prisma/dev.db',
    authToken,
  })

  for (const r of REGIONS) {
    const existing = await client.execute({
      sql: 'SELECT id FROM AdministrativeRegion WHERE officialNumber = ?',
      args: [r.n],
    })
    if (existing.rows.length > 0) {
      await client.execute({
        sql: `UPDATE AdministrativeRegion SET officialName = ?, romanNumber = ?, slug = ?, aliases = ?, "updatedAt" = datetime('now') WHERE officialNumber = ?`,
        args: [r.name, r.r, r.slug, JSON.stringify(r.aliases), r.n],
      })
    } else {
      await client.execute({
        sql: `INSERT INTO AdministrativeRegion (id, officialNumber, romanNumber, officialName, slug, aliases, "updatedAt") VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: [`seed-${r.slug}`, r.n, r.r, r.name, r.slug, JSON.stringify(r.aliases)],
      })
    }
  }
  console.log(`Seeded ${REGIONS.length} Administrative Regions.`)
  client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
