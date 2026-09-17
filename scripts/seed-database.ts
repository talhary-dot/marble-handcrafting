import fs from "fs"
import path from "path"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import * as schema from "../lib/db/schema"
import { initialSeedProducts } from "../lib/db/seed"
import { eq } from "drizzle-orm"

// Simple environment file loader without external dependencies
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env")
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const idx = trimmed.indexOf("=")
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim()
        const val = trimmed.slice(idx + 1).trim()
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}

loadEnv()

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URI || process.env.POSTGRES_URL

  if (!connectionString) {
    console.error("Error: No DATABASE_URL or POSTGRES_URI found in environment variables.")
    process.exit(1)
  }

  console.log("Connecting to PostgreSQL database...")
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql, { schema })

  try {
    console.log("Applying migrations...")
    const migrationsFolder = path.join(process.cwd(), "drizzle")
    await migrate(db, { migrationsFolder })
    console.log("Migrations applied successfully.")

    console.log(`Seeding ${initialSeedProducts.length} products with size variants...`)
    for (const item of initialSeedProducts) {
      const { sizes, ...prodData } = item

      // Upsert product
      await db.insert(schema.products).values({
        ...prodData,
        gallery: JSON.stringify(sizes.flatMap(s => s.images))
      }).onConflictDoUpdate({
        target: schema.products.id,
        set: {
          ...prodData,
          gallery: JSON.stringify(sizes.flatMap(s => s.images)),
          updatedAt: new Date()
        }
      })

      // Clean existing size variants for this product
      await db.delete(schema.productSizes).where(eq(schema.productSizes.productId, prodData.id))

      // Insert size variants
      for (let i = 0; i < sizes.length; i++) {
        const s = sizes[i]
        await db.insert(schema.productSizes).values({
          id: `${prodData.id}-size-${i + 1}`,
          productId: prodData.id,
          sizeName: s.sizeName,
          dimensions: s.dimensions,
          weight: s.weight,
          price: s.price,
          originalPrice: s.originalPrice,
          stock: s.stock,
          sku: s.sku,
          images: JSON.stringify(s.images),
          isDefault: s.isDefault,
          sortOrder: i
        })
      }
    }

    // Verify insertion
    const allProducts = await db.select().from(schema.products)
    const allSizes = await db.select().from(schema.productSizes)

    console.log(`\nVerification successful:`)
    console.log(`- Products in database: ${allProducts.length}`)
    console.log(`- Product size variants in database: ${allSizes.length}`)
    console.log("\nSample products in DB:")
    for (const p of allProducts.slice(0, 5)) {
      console.log(`  * ${p.name} [ID: ${p.id}, Category: ${p.category}, Stone: ${p.stoneType}]`)
    }
  } catch (error) {
    console.error("Database initialization / seeding error:", error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()
