import { MetadataRoute } from "next"
import { db, ensureDbInitialized } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { products as staticProducts } from "@/lib/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.URL || 
    process.env.DEPLOY_PRIME_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  
  const baseUrl = rawBaseUrl.startsWith("http") ? rawBaseUrl : `https://${rawBaseUrl}`

  let productList: { slug: string; updatedAt?: Date }[] = []

  try {
    await ensureDbInitialized()
    const dbProds = await db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products)
    if (dbProds && dbProds.length > 0) {
      productList = dbProds
    }
  } catch {
    // Fallback to static products if DB is not reachable during build
    productList = staticProducts.map(p => ({ slug: p.id, updatedAt: new Date() }))
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bespoke`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/care`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }
  ]

  const productRoutes: MetadataRoute.Sitemap = productList.map(prod => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: prod.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
