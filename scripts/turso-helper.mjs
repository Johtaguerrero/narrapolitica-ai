import { createClient } from '@libsql/client'
const [,,action,name] = process.argv
const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN
if (!url || !authToken) { console.error('Missing env vars'); process.exit(1) }
const client = createClient({ url, authToken })
async function main() {
  if (action === 'delete') {
    const r = await client.execute({ sql: 'DELETE FROM _prisma_migrations WHERE migration_name = ?', args: [name] })
    console.log(`Deleted ${r.rowsAffected} records`)
  } else if (action === 'seed') {
    const { default: regions } = await import('./seed-territories.mjs')
  }
  client.close()
}
main().catch(e => { console.error(e); process.exit(1) })
