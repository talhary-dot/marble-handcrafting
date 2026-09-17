import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL

export default defineConfig(
  databaseUrl
    ? {
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        dbCredentials: {
          url: databaseUrl
        }
      }
    : {
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        driver: "pglite",
        dbCredentials: {
          url: "./.pglite"
        }
      }
)
