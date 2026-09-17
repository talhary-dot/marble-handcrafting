"use client"

import { useState, useEffect, useRef, useMemo, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ShoppingBag, SlidersHorizontal, X, Search, Sparkles } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { products as staticProducts, type Product } from "@/lib/products"

const categories = [
  { id: "all", label: "All Works" },
  { id: "home", label: "Living & Trays" },
  { id: "tableware", label: "Tableware & Vessels" },
  { id: "sculptures", label: "Sculptures & Totems" },
  { id: "decor", label: "Stone Accents" }
]

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"
  
  const [allProducts, setAllProducts] = useState<any[]>(staticProducts)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          const mapped = data.products.map((p: any) => {
            const minPrice = p.sizes?.length ? Math.min(...p.sizes.map((s: any) => s.price)) : 0
            return {
              id: p.slug || p.id,
              name: p.name,
              description: p.description,
              price: minPrice,
              originalPrice: p.sizes?.[0]?.originalPrice || null,
              image: p.featuredImage,
              category: p.category,
              badge: p.badge,
              stoneType: p.stoneType,
              origin: p.origin,
              dimensions: p.sizes?.[0]?.dimensions || p.dimensions || "",
              weight: p.sizes?.[0]?.weight || p.weight || ""
            }
          })
          setAllProducts(mapped)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam && categories.some(c => c.id === categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesSearch = searchQuery.trim() === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.stoneType && product.stoneType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.origin && product.origin.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery, allProducts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) {
      observer.observe(gridRef.current)
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 40)
    return () => clearTimeout(timer)
  }, [selectedCategory, searchQuery])

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Handcrafted Stone Catalogue</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4 text-balance font-medium">
            Atelier Collection
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Every piece is sculpted from solid Italian, Spanish, and Rajasthani marble, featuring burnished copper bronze fittings and hand-honed surfaces.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border/60">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground bg-card border border-border/60 px-5 py-2.5 rounded-full"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filter Categories ({categories.find(c => c.id === selectedCategory)?.label})
          </button>

          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide uppercase boty-transition ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(158,86,50,0.3)]"
                    : "bg-card text-foreground/75 hover:text-foreground border border-border/50 hover:border-primary/30"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stone, origin..."
              className="w-full bg-card border border-border/60 rounded-full pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary boty-transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <h2 className="font-serif text-2xl text-foreground font-medium">Stone Collections</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="p-2 text-foreground/80 hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setShowFilters(false)
                  }}
                  className={`w-full px-6 py-4 rounded-2xl text-left text-sm font-medium tracking-wide uppercase boty-transition ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-foreground border border-border/50"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground tracking-wider uppercase">
            Showing <span className="text-foreground font-semibold">{filteredProducts.length}</span> handcrafted {filteredProducts.length === 1 ? "piece" : "pieces"}
          </p>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="text-xs text-primary hover:underline font-medium"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-border/50">
            <p className="text-lg font-serif text-foreground mb-2">No matching stone pieces found</p>
            <p className="text-sm text-muted-foreground mb-6">Try searching for &quot;Carrara&quot;, &quot;Travertine&quot;, or &quot;Bowl&quot;.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all")
                setSearchQuery("")
              }}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider"
            >
              View All Works
            </button>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ 
  product, 
  index, 
  isVisible 
}: { 
  product: Product
  index: number
  isVisible: boolean
}) {
  const { addItem } = useCart()

  return (
    <div
      className={`group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="bg-card rounded-3xl overflow-hidden border border-border/40 boty-shadow boty-transition group-hover:-translate-y-1 group-hover:border-primary/40 flex flex-col h-full">
        {/* Image Box */}
        <Link href={`/product/${product.id}`} className="relative aspect-[4/3] bg-muted overflow-hidden block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover boty-transition group-hover:scale-105 duration-700"
          />
          
          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
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

          {/* Stone Origin */}
          <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md text-[11px] font-medium bg-background/85 backdrop-blur-sm text-foreground/80 border border-white/20">
            {product.origin}
          </span>

          {/* Quick Add To Cart Button */}
          <button
            type="button"
            className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition shadow-md hover:bg-primary/90"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image
              })
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </Link>

        {/* Info */}
        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <Link href={`/product/${product.id}`} className="hover:text-primary boty-transition">
                <h3 className="font-serif text-xl text-foreground font-medium">{product.name}</h3>
              </Link>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg font-semibold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-primary font-medium tracking-wider uppercase mb-2">
              {product.stoneType}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
              {product.description ? product.description.replace(/<[^>]+>/g, " ") : ""}
            </p>

          </div>

          <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>Dimensions: {product.dimensions}</span>
            <span className="font-medium text-foreground">{product.weight}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="pt-40 text-center text-muted-foreground">Loading collection...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </main>
  )
}
