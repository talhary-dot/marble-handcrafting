"use client"

import { useState, useEffect, useRef, useMemo, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { 
  ShoppingBag, 
  SlidersHorizontal, 
  X, 
  Search, 
  Sparkles, 
  Heart, 
  ArrowUpDown, 
  Check, 
  Filter 
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { useWishlist } from "@/components/boty/wishlist-context"
import { products as staticProducts, type Product } from "@/lib/products"

const categories = [
  { id: "all", label: "All Works" },
  { id: "home", label: "Living & Trays" },
  { id: "tableware", label: "Tableware & Vessels" },
  { id: "sculptures", label: "Sculptures & Totems" },
  { id: "decor", label: "Stone Accents" }
]

const stoneTypes = [
  "All Stones",
  "Carrara",
  "Travertine",
  "Nero Marquina",
  "Onyx",
  "Rainforest Green",
  "Bespoke Marble"
]

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"
  const initialSearch = searchParams.get("search") || ""
  
  const [allProducts, setAllProducts] = useState<any[]>(staticProducts)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedStone, setSelectedStone] = useState("All Stones")
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "name_asc">("featured")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
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
              weight: p.sizes?.[0]?.weight || p.weight || "",
              stock: p.sizes?.[0]?.stock !== undefined ? p.sizes[0].stock : 10
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
    const searchParam = searchParams.get("search")
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [searchParams])

  const filteredAndSortedProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      
      const matchesStone = selectedStone === "All Stones" || 
        (product.stoneType && product.stoneType.toLowerCase().includes(selectedStone.toLowerCase()))

      const matchesStock = !inStockOnly || (product.stock && product.stock > 0)

      const matchesSearch = searchQuery.trim() === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.stoneType && product.stoneType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.origin && product.origin.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesStone && matchesStock && matchesSearch
    })

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price
      if (sortBy === "price_desc") return b.price - a.price
      if (sortBy === "name_asc") return a.name.localeCompare(b.name)
      return 0 // featured / default
    })

    return result
  }, [selectedCategory, selectedStone, inStockOnly, sortBy, searchQuery, allProducts])

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
  }, [selectedCategory, selectedStone, inStockOnly, sortBy, searchQuery])

  const hasActiveFilters = selectedCategory !== "all" || selectedStone !== "All Stones" || inStockOnly || searchQuery.trim() !== ""

  const resetAllFilters = () => {
    setSelectedCategory("all")
    setSelectedStone("All Stones")
    setInStockOnly(false)
    setSearchQuery("")
    setSortBy("featured")
  }

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

        {/* Categories Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60 overflow-x-auto">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide uppercase boty-transition whitespace-nowrap ${
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
          <div className="relative min-w-[240px] hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stone, origin..."
              className="w-full bg-card border border-border/60 rounded-full pl-10 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary boty-transition"
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

        {/* Advanced Filters & Sorting Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-card/60 border border-border/50 text-xs">
          {/* Left: Stone Variety & Stock Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span className="uppercase tracking-wider text-[11px] font-semibold text-foreground">Stone:</span>
            </div>
            <select
              value={selectedStone}
              onChange={(e) => setSelectedStone(e.target.value)}
              className="bg-background border border-border/60 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              {stoneTypes.map((stone) => (
                <option key={stone} value={stone}>
                  {stone}
                </option>
              ))}
            </select>

            {/* In Stock Checkbox */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-foreground/90 ml-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
              />
              <span className="text-[11px]">In-Stock Editions Only</span>
            </label>
          </div>

          {/* Right: Sorting */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <span className="uppercase tracking-wider text-[11px] font-semibold text-foreground">Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-background border border-border/60 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-medium"
            >
              <option value="featured">Atelier Curated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="relative w-full sm:hidden mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stone, origin..."
            className="w-full bg-card border border-border/60 rounded-full pl-10 pr-8 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary boty-transition"
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

        {/* Active Filter Chips & Product Count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              Showing <span className="text-foreground font-semibold">{filteredAndSortedProducts.length}</span> handcrafted {filteredAndSortedProducts.length === 1 ? "piece" : "pieces"}
            </p>

            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 ml-2">
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    {categories.find(c => c.id === selectedCategory)?.label}
                    <button type="button" onClick={() => setSelectedCategory("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedStone !== "All Stones" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    {selectedStone}
                    <button type="button" onClick={() => setSelectedStone("All Stones")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    In-Stock
                    <button type="button" onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    &ldquo;{searchQuery}&rdquo;
                    <button type="button" onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-primary hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-border/50">
            <p className="text-lg font-serif text-foreground mb-2">No matching stone pieces found</p>
            <p className="text-sm text-muted-foreground mb-6">Try broadening your stone variety, category, or search keywords.</p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-sm"
            >
              Reset All Filters & View All
            </button>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAndSortedProducts.map((product, index) => (
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
  product: any
  index: number
  isVisible: boolean
}) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const isFavorited = isInWishlist(product.id)

  return (
    <div
      className={`group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="bg-card rounded-3xl overflow-hidden border border-border/40 boty-shadow boty-transition group-hover:-translate-y-1 group-hover:border-primary/40 flex flex-col h-full relative">
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

          {/* Wishlist Button on Card */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stoneType: product.stoneType,
                origin: product.origin,
                description: product.dimensions
              })
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center boty-transition shadow-sm ${
              isFavorited
                ? "bg-primary/20 border-primary text-primary"
                : "bg-background/80 border-border/60 text-muted-foreground hover:text-foreground"
            }`}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-primary text-primary" : ""}`} />
          </button>

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
