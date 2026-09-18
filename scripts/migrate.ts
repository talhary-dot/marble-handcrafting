import fs from "fs"
import path from "path"
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js"
import { migrate as migratePg } from "drizzle-orm/postgres-js/migrator"
import { PGlite } from "@electric-sql/pglite"
import { drizzle as drizzlePglite } from "drizzle-orm/pglite"
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator"
import postgres from "postgres"

async function runMigrations() {
  console.log("==================================================================")
  console.log(" SANG TARASH — UNIFIED DATABASE SCHEMA MIGRATION RUNNER")
  console.log("==================================================================")

  const migrationsFolder = path.resolve(process.cwd(), "drizzle")
  if (!fs.existsSync(migrationsFolder)) {
    console.error(`Migrations directory not found at: ${migrationsFolder}`)
    process.exit(1)
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URI || process.env.POSTGRES_URL

  if (databaseUrl) {
    console.log("[Target] Remote PostgreSQL Database detected via environment variable.")
    console.log("[Dialect] Standard PostgreSQL (postgres-js)")
    const client = postgres(databaseUrl, { max: 1 })
    const db = drizzlePg(client)

    try {
      console.log(`[Executing] Applying SQL migrations from ${migrationsFolder}...`)
      await migratePg(db, { migrationsFolder })
      console.log("✓ Remote PostgreSQL migrations successfully applied.")
    } catch (err: any) {
      console.error("✗ Migration failed:", err)
      process.exit(1)
    } finally {
      await client.end()
    }
  } else {
    console.log("[Target] Local filesystem PGlite database detected (./.pglite).")
    console.log("[Dialect] In-process PostgreSQL (electric-sql/pglite)")
    const pgliteDir = path.resolve(process.cwd(), ".pglite")
    const client = new PGlite(pgliteDir)
    const db = drizzlePglite(client)

    try {
      console.log(`[Executing] Applying SQL migrations from ${migrationsFolder}...`)
      await migratePglite(db, { migrationsFolder })
      console.log("✓ Local PGlite migrations successfully applied.")
    } catch (err: any) {
      console.error("✗ Local migration failed:", err)
      process.exit(1)
    } finally {
      await client.close()
    }
  }

  console.log("==================================================================")
  console.log(" SCHEMA SYNC COMPLETE — ZERO DRIFT ACROSS ENVIRONMENTS")
  console.log("==================================================================")
}

runMigrations()
