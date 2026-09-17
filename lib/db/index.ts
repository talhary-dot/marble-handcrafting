import { drizzle as drizzlePglite } from "drizzle-orm/pglite"
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator"
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js"
import { migrate as migratePg } from "drizzle-orm/postgres-js/migrator"
import { PGlite } from "@electric-sql/pglite"
import postgres from "postgres"
import * as schema from "./schema"
import path from "path"
import fs from "fs"

const dataDir = path.join(process.cwd(), ".pglite")
const migrationsFolder = path.join(process.cwd(), "drizzle")
export const getDatabaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URI || process.env.POSTGRES_URL

declare global {
  // eslint-disable-next-line no-var
  var __pglite_client: PGlite | undefined
  // eslint-disable-next-line no-var
  var __postgres_client: ReturnType<typeof postgres> | undefined
  // eslint-disable-next-line no-var
  var __drizzle_instance: any | undefined
  // eslint-disable-next-line no-var
  var __db_migrated: boolean | undefined
}

function getPgliteClient(): PGlite {
  if (globalThis.__pglite_client) {
    return globalThis.__pglite_client
  }

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  try {
    const client = new PGlite(dataDir)
    globalThis.__pglite_client = client
    return client
  } catch {
    const client = new PGlite()
    globalThis.__pglite_client = client
    return client
  }
}

export function getDb() {
  if (globalThis.__drizzle_instance) {
    return globalThis.__drizzle_instance
  }

  const dbUrl = getDatabaseUrl()

  // Production / Remote: use Postgres if connection string available
  if (dbUrl) {
    const queryClient = globalThis.__postgres_client ?? postgres(dbUrl, { max: 10 })
    if (process.env.NODE_ENV !== "production") {
      globalThis.__postgres_client = queryClient
    }
    const dbInstance = drizzlePg(queryClient, { schema })
    globalThis.__drizzle_instance = dbInstance
    return dbInstance
  }

  // Local development fallback: use PGlite
  const client = getPgliteClient()
  const dbInstance = drizzlePglite(client, { schema })
  globalThis.__drizzle_instance = dbInstance
  return dbInstance
}

// Dynamic proxy export for Drizzle db instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDb()
    return instance[prop]
  }
})

export async function ensureDbInitialized() {
  if (globalThis.__db_migrated) return

  const dbUrl = getDatabaseUrl()

  try {
    if (dbUrl) {
      const dbInstance = getDb()
      await migratePg(dbInstance, { migrationsFolder })
    } else {
      const dbInstance = getDb()
      await migratePglite(dbInstance, { migrationsFolder })
    }
    globalThis.__db_migrated = true
  } catch (err) {
    console.error("Drizzle migration error:", err)
  }
}

