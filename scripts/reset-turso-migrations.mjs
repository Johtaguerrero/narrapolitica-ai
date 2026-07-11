import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) { console.error('Missing env vars'); process.exit(1) }

const client = createClient({ url, authToken })

async function main() {
  // Delete tracking records for the 2 migrations that failed
  for (const name of ['20260708005757_add_assembly_models', '20260709000000_add_territory_models']) {
    const del = await client.execute({
      sql: 'DELETE FROM _prisma_migrations WHERE migration_name = ?',
      args: [name],
    })
    console.log(`Deleted ${del.rowsAffected} records for ${name}`)
  }
  client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
