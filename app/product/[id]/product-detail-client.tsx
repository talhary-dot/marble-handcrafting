"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  ChevronDown, 
  Gem, 
  Hammer, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Check, 
  Layers
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { sanitizeHtml } from "@/lib/sanitize"


export interface SizeItem {
  id: string
  sizeName: string
  dimensions: string
  weight: string
  price: number
  originalPrice?: number | null
  stock: number
  images: string[]
  isDefault?: boolean
}

export interface ClientProduct {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  badge?: string | null
  stoneType: string
  origin: string
  finish: string
  details: string
  careInstructions: string
  artisanStory: string
  shipping: string
  featuredImage: string
  gallery: string[]
  sizes: SizeItem[]
}

const benefits = [
  { icon: Gem, label: "100% Solid Stone" },
  { icon: Hammer, label: "Hand-Honed Craft" },
  { icon: Sparkles, label: "Copper Bronze" },
  { icon: ShieldCheck, label: "Insured Crating" }
]

type AccordionSection = "specs" | "artisan" | "care" | "shipping"

export function ProductDetailClient({ product }: { product: ClientProduct }) {
  const { addItem } = useCart()

  // Find default size or first size
  const defaultIndex = Math.max(0, product.sizes.findIndex(s => s.isDefault))
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(defaultIndex)
  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0]

  // Image Gallery: Combine size-specific images + featured image
  const sizeImages = currentSize?.images?.length ? currentSize.images : [product.featuredImage]
  const [selectedImage, setSelectedImage] = useState(sizeImages[0])

  // Update active image when size changes
  useEffect(() => {
    if (currentSize?.images?.length) {
      setSelectedImage(currentSize.images[0])
    } else {
      setSelectedImage(product.featuredImage)
    }
  }, [selectedSizeIndex, currentSize, product.featuredImage])

  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<AccordionSection | null>("specs")
  const [isAdded, setIsAdded] = useState(false)

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${currentSize.id}`,
      name: `${product.name} — ${currentSize.sizeName}`,
      description: `${currentSize.dimensions} • ${product.stoneType}`,
      price: currentSize.price,
      image: selectedImage || product.featuredImage
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2200)
  }

  const accordionItems: { key: AccordionSection; title: string; content: string }[] = [
    { 
      key: "specs", 
      title: "Geological Specs & Dimensions", 
      content: `${product.details} Current size: ${currentSize.sizeName} measuring ${currentSize.dimensions} with heavy weight of ${currentSize.weight}. Quarried in ${product.origin}.` 
    },
    { 
      key: "artisan", 
      title: "Artisan Stonecraft & Provenance", 
      content: product.artisanStory || "Hand-chiseled by generational stonemasons in Sang Tarash ateliers."
    },
    { 
      key: "care", 
      title: "Stone Care & Maintenance", 
      content: product.careInstructions || "Wipe clean with a damp microfiber cloth. Avoid acidic liquids."
    },
    { 
      key: "shipping", 
      title: "Custom Crating & Transit Guarantee", 
      content: product.shipping || "Ships in reinforced high-density foam packaging."
    }
  ]

  return (
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
            {/* Product Image Stage & Size Gallery */}
            <div className="space-y-4 sticky top-28">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-card border border-border/50 boty-shadow">
                <Image
                  src={selectedImage || product.featuredImage}
                  alt={`${product.name} - ${currentSize.sizeName}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover boty-transition"
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

              {/* Thumbnails Gallery for this size */}
              {sizeImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {sizeImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 boty-transition ${
                        selectedImage === img
                          ? "border-primary shadow-sm ring-1 ring-primary/40"
                          : "border-border/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Live Stone Specs Card */}
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

            {/* Product Narrative & Purchase Panel */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{product.stoneType}</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-2 font-medium">
                  {product.name}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground italic mb-4">
                  {product.tagline}
                </p>
                
                {/* Rating & Authenticity */}
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

                <div
                  className="product-rich-description text-foreground/85 leading-relaxed text-sm sm:text-base mb-6"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>


              {/* Dynamic Price Display */}
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

              {/* Option to Select Each Size (CRITICAL REQUIREMENT) */}
              <div className="mb-8 p-5 rounded-2xl bg-card/70 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Choose Size & Dimension Variant *
                  </label>
                  <span className="text-xs text-primary font-medium">
                    {currentSize.sizeName}: {currentSize.dimensions}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {product.sizes.map((size, index) => {
                    const isSelected = selectedSizeIndex === index
                    return (
                      <button
                        key={size.id || index}
                        type="button"
                        onClick={() => setSelectedSizeIndex(index)}
                        className={`p-3.5 rounded-xl text-left border boty-transition relative flex flex-col justify-between ${
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
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8 flex items-center gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2 block">
                    Quantity
                  </label>
                  <div className="inline-flex items-center gap-4 bg-card rounded-full px-3 py-1.5 border border-border/50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground hover:text-primary boty-transition border border-border/40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-medium text-foreground text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground hover:text-primary boty-transition border border-border/40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-6 text-xs text-muted-foreground">
                  Subtotal: <span className="text-foreground font-semibold font-serif text-sm">${currentSize.price * quantity}</span>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-medium tracking-wide boty-transition ${
                    isAdded
                      ? "bg-primary/90 text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_25px_rgba(158,86,50,0.35)]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added {currentSize.sizeName} to Cart</span>
                    </>
                  ) : (
                    <>
                      <span>Acquire Piece • ${currentSize.price * quantity}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/25 text-foreground px-8 py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-foreground/5"
                >
                  Instant Checkout
                </button>
              </div>

              {/* Stone Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.label}
                    className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-card/60 border border-border/40 text-center"
                  >
                    <benefit.icon className="w-5 h-5 text-primary" />
                    <span className="text-[11px] font-medium text-muted-foreground">{benefit.label}</span>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="border-t border-border/50">
                {accordionItems.map((item) => (
                  <div key={item.key} className="border-b border-border/50">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.key)}
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <span className="font-serif text-base text-foreground font-medium group-hover:text-primary boty-transition">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground boty-transition ${
                          openAccordion === item.key ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden boty-transition ${
                        openAccordion === item.key ? "max-h-96 pb-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
