import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.URL || 
    process.env.DEPLOY_PRIME_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  
  const baseUrl = rawBaseUrl.startsWith("http") ? rawBaseUrl : `https://${rawBaseUrl}`

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
