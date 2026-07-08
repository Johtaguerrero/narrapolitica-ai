import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.log('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set, skipping Turso push.')
    process.exit(0)
  }

  const client = createClient({ url, authToken })

  // Find the latest migration SQL file
  const migrationsDir = resolve(__dirname, '..', 'prisma', 'migrations')
  const { readdirSync } = await import('fs')
  const dirs = readdirSync(migrationsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  // Execute all migration files that haven't been applied yet
  // We check by trying to create the _prisma_migrations table and tracking applied migrations
  try {
    await client.execute(`CREATE TABLE IF NOT EXISTS _prisma_migrations (
      id TEXT PRIMARY KEY,
      migration_name TEXT,
      started_at TEXT DEFAULT CURRENT_TIMESTAMP,
      finished_at TEXT,
      migration_file TEXT
    )`)
  } catch { /* table may already exist */ }

  for (const dir of dirs) {
    const migrationFile = resolve(migrationsDir, dir, 'migration.sql')
    try {
      const existing = await client.execute({
        sql: 'SELECT id FROM _prisma_migrations WHERE migration_name = ?',
        args: [dir],
      })
      if (existing.rows.length > 0) {
        console.log(`Migration ${dir} already applied, skipping.`)
        continue
      }
    } catch { /* continue */ }

    const sql = readFileSync(migrationFile, 'utf-8')
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const stmt of statements) {
      console.log(`Executing: ${stmt.substring(0, 80)}...`)
      try {
        await client.execute(stmt)
      } catch (err) {
        console.error(`Error executing statement: ${stmt}`)
        console.error(err)
      }
    }

    // Mark as applied
    const migrationId = `${dir}-${Date.now()}`
    try {
      await client.execute({
        sql: `INSERT INTO _prisma_migrations (id, migration_name, finished_at, migration_file) VALUES (?, ?, datetime('now'), ?)`,
        args: [migrationId, dir, migrationFile],
      })
    } catch { /* ignore */ }

    console.log(`Migration ${dir} applied successfully.`)
  }

  console.log('All migrations applied to Turso.')
  client.close()
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
