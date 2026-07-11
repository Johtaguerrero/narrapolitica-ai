import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) { console.error('Missing env vars'); process.exit(1) }

const client = createClient({ url, authToken })

async function main() {
  await client.execute("DROP TABLE IF EXISTS EditorialCalendarItem")
  console.log('EditorialCalendarItem table dropped')
  client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
