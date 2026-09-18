import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Layers, Star, Sparkles } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { getProductBySlugOrIdFromDb } from "@/lib/db/queries"
import { getProductById as getStaticProductById } from "@/lib/products"
import { AddToCartSection } from "@/components/product/add-to-cart-section"
import { sanitizeHtml } from "@/lib/sanitize"


interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ size?: string }>
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}
function getSiteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  if (process.env.URL) return process.env.URL.replace(/\/$/, "") // Netlify production site URL
  if (process.env.DEPLOY_PRIME_URL) return process.env.DEPLOY_PRIME_URL.replace(/\/$/, "") // Netlify deploy preview URL
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "")
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
  return ""
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { size: sizeParam } = await searchParams
  const dbProduct = await getProductBySlugOrIdFromDb(id).catch(() => null)
  const product = dbProduct || getStaticProductById(id)

  if (!product) {
    return {
      title: "Product Not Found | Sang Tarash",
      description: "Handcrafted marble objects and stone sculptures by Sang Tarash."
    }
  }

  const baseTitle = (product as any).seoTitle || `${product.name} | Sang Tarash Marble Handicrafts`
  const title = sizeParam ? `${product.name} (${sizeParam}) | Sang Tarash` : baseTitle
  const cleanDescription = (product as any).seoDescription || (product.description ? product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) : "Handcrafted natural marble and architectural stoneware by Sang Tarash.")
  const siteUrl = getSiteBaseUrl()
  const productPath = `/product/${(product as any).slug || product.id}`
  const canonicalUrl = siteUrl ? `${siteUrl}${productPath}` : productPath

  return {
    title,
    description: cleanDescription,

    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: "Sang Tarash Atelier",
      images: [
        {
          url: (product as any).featuredImage || (product as any).image,
          width: 1200,
          height: 900,
          alt: product.name,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [(product as any).featuredImage || (product as any).image],
    }
  }
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { size: sizeParam } = await searchParams

  const dbProduct = await getProductBySlugOrIdFromDb(id).catch(() => null)
  const staticProduct = getStaticProductById(id)

  if (!dbProduct && !staticProduct) {
    notFound()
  }

  // Normalize product data
  const product = dbProduct
    ? {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        tagline: dbProduct.tagline || "",
        description: dbProduct.description,
        category: dbProduct.category,
        badge: dbProduct.badge,
        stoneType: dbProduct.stoneType,
        origin: dbProduct.origin,
        finish: dbProduct.finish,
        details: dbProduct.details || "",
        careInstructions: dbProduct.careInstructions || "",
        artisanStory: dbProduct.artisanStory || "",
        shipping: dbProduct.shipping || "",
        featuredImage: dbProduct.featuredImage,
        gallery: dbProduct.gallery ? JSON.parse(dbProduct.gallery) : [],
        sizes: (dbProduct.sizes || []).map(s => ({
          id: s.id,
          sizeName: s.sizeName,
          dimensions: s.dimensions,
          weight: s.weight,
          price: s.price,
          originalPrice: s.originalPrice,
          stock: s.stock,
          images: s.images ? JSON.parse(s.images) : [],
          isDefault: s.isDefault
        }))
      }
    : {
        id: staticProduct!.id,
        slug: staticProduct!.id,
        name: staticProduct!.name,
        tagline: staticProduct!.tagline,
        description: staticProduct!.description,
        category: staticProduct!.category,
        badge: staticProduct!.badge,
        stoneType: staticProduct!.stoneType,
        origin: staticProduct!.origin,
        finish: staticProduct!.finish,
        details: staticProduct!.details,
        careInstructions: staticProduct!.careInstructions,
        artisanStory: staticProduct!.artisanStory,
        shipping: staticProduct!.shipping,
        featuredImage: staticProduct!.image,
        gallery: [staticProduct!.image],
        sizes: [
          {
            id: `${staticProduct!.id}-default`,
            sizeName: "Standard",
            dimensions: staticProduct!.dimensions,
            weight: staticProduct!.weight,
            price: staticProduct!.price,
            originalPrice: staticProduct!.originalPrice || null,
            stock: 12,
            images: [staticProduct!.image],
            isDefault: true
          }
        ]
      }

  // Pick up active size from URL search parameter (SSR first, no internal state for picking!)
  let currentSize = product.sizes[0]
  if (sizeParam) {
    const cleanParam = sizeParam.toLowerCase().trim()
    const matched = product.sizes.find(s => 
      slugify(s.sizeName) === cleanParam || 
      s.id.toLowerCase() === cleanParam ||
      s.sizeName.toLowerCase() === cleanParam
    )
    if (matched) {
      currentSize = matched
    }
  } else {
    currentSize = product.sizes.find(s => s.isDefault) || product.sizes[0]
  }

  // Active images for current size (SSR rendered)
  const sizeImages = currentSize?.images?.length ? currentSize.images : [product.featuredImage]
  const mainImage = sizeImages[0] || product.featuredImage

  // JSON-LD Structured Schema
  const allImages = Array.from(new Set([
    product.featuredImage,
    ...product.sizes.flatMap(s => s.images),
    ...product.gallery
  ])).filter(Boolean)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": allImages,
    "description": product.seoDescription || product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500),
    "sku": `ST-${product.id.toUpperCase()}`,

    "material": product.stoneType,
    "countryOfOrigin": {
      "@type": "Country",
      "name": product.origin
    },
    "brand": {
      "@type": "Brand",
      "name": "Sang Tarash"
    },
    "offers": product.sizes.map(size => ({
      "@type": "Offer",
      "name": `${product.name} - ${size.sizeName}`,
      "price": size.price,
      "priceCurrency": "USD",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": size.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${getSiteBaseUrl()}/product/${product.slug || product.id}?size=${slugify(size.sizeName)}`
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "32"
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": getSiteBaseUrl()
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collection",
        "item": `${getSiteBaseUrl()}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "Art",
        "item": `${getSiteBaseUrl()}/shop?category=${encodeURIComponent(product.category || "home")}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `${getSiteBaseUrl()}/product/${product.slug || product.id}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="min-h-screen bg-background">
        <Header />

        <div className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Breadcrumb / Back Link */}
            <div className="flex items-center gap-2 text-xs tracking-wider uppercase mb-8 text-muted-foreground">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 hover:text-primary boty-transition font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Collection</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Column: Image Stage (SSR Rendered) */}
              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-card border border-border/50 boty-shadow">
                  <Image
                    src={mainImage}
                    alt={`${product.name} - ${currentSize.sizeName}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />

                  {product.badge && (
                    <span
                      className={`absolute top-5 left-5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                        product.badge === "Sale"
                          ? "bg-destructive text-destructive-foreground"
                          : product.badge === "New"
                          ? "bg-accent text-accent-foreground"
                          : "bg-primary text-primary-foreground shadow-sm"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  <div className="absolute bottom-5 left-5 px-3 py-1.5 rounded-lg bg-background/85 backdrop-blur-md border border-white/20 text-xs font-medium text-foreground/90">
                    <span>{currentSize.sizeName} ({currentSize.dimensions})</span>
                  </div>
                </div>

                {/* Additional gallery thumbnails if available for this size */}
                {sizeImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {sizeImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                          mainImage === img
                            ? "border-primary shadow-sm ring-1 ring-primary/40"
                            : "border-border/60 opacity-80"
                        }`}
                      >
                        <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* SSR Stone Specs Badge Strip */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-card/60 border border-border/40 text-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Stone Type</span>
                    <p className="text-xs font-medium text-foreground mt-0.5 truncate">{product.stoneType}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Dimensions</span>
                    <p className="text-xs font-medium text-foreground mt-0.5">{currentSize.dimensions}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Stone Weight</span>
                    <p className="text-xs font-medium text-foreground mt-0.5">{currentSize.weight}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Full SSR Narrative & Details */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{product.stoneType} • Origin: {product.origin}</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-2 font-medium">
                    {product.name}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground italic mb-4">
                    {product.tagline}
                  </p>

                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Sang Tarash Atelier Certified • Solid Metamorphic Rock
                    </span>
                  </div>

                  {/* SSR Rich Description (Full-fledged narrative with rich typography & inline stone imagery) */}
                  <div
                    className="product-rich-description text-foreground/90 leading-relaxed text-sm sm:text-base mb-6"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                  />
                </div>


                {/* SSR Price for Selected Variant */}
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="font-serif text-3xl sm:text-4xl font-semibold text-primary">
                    ${currentSize.price}
                  </span>
                  {currentSize.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${currentSize.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-2">
                    In Stock ({currentSize.stock} available)
                  </span>
                </div>

                {/* URL-driven Size Selection (NO internal state! Driven by Link to URL) */}
                <div className="mb-8 p-5 rounded-2xl bg-card/70 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Choose Size & Dimension Variant
                    </label>
                    <span className="text-xs text-primary font-medium">
                      Selected: {currentSize.sizeName}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.sizes.map((size) => {
                      const isSelected = size.id === currentSize.id
                      const sizeSlug = slugify(size.sizeName)
                      const targetUrl = `/product/${product.slug}?size=${sizeSlug}`

                      return (
                        <Link
                          key={size.id}
                          href={targetUrl}
                          scroll={false}
                          className={`p-3.5 rounded-xl text-left border boty-transition relative flex flex-col justify-between block ${
                            isSelected
                              ? "bg-background border-primary shadow-md ring-1 ring-primary/40"
                              : "bg-background/50 border-border/70 hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {size.sizeName}
                            </span>
                            <span className="font-serif text-xs font-bold text-primary">
                              ${size.price}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{size.dimensions}</span>
                            <span>{size.weight}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Interactive Add to Cart & Accordions */}
                <AddToCartSection
                  product={product}
                  currentSize={currentSize}
                  selectedImage={mainImage}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
