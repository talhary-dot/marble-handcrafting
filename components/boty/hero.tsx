"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Star, Layers, ShieldCheck, ChevronRight } from "lucide-react"

interface FeaturedPiece {
  id: string
  slug: string
  name: string
  shortName: string
  tagline: string
  stoneType: string
  origin: string
  price: number
  image: string
  dimensions: string
  badge: string
}

const FEATURED_PIECES: FeaturedPiece[] = [
  {
    id: "vein-marble-tray",
    slug: "vein-marble-tray",
    name: "Vein Marble Tray",
    shortName: "Marble Tray",
    tagline: "Solid Carrara slab with hand-carved chamfered rim",
    stoneType: "Carrara White & Bronze",
    origin: "Tuscany, Italy",
    price: 85,
    image: "/images/products/vein-marble-tray.jpg",
    dimensions: '12" L x 8" W x 1" H',
    badge: "Atelier Signature"
  },
  {
    id: "carved-stone-bowl",
    slug: "carved-stone-bowl",
    name: "Fluted Stone Vessel",
    shortName: "Stone Vessel",
    tagline: "Chiseled from a single block of raw metamorphic rock",
    stoneType: "Honed Statuario Marble",
    origin: "Balochistan Range",
    price: 120,
    image: "/images/products/carved-stone-bowl.jpg",
    dimensions: '10" Dia x 5" H',
    badge: "Masterpiece"
  },
  {
    id: "travertine-candleholder",
    slug: "travertine-candleholder",
    name: "Travertine Totem Stand",
    shortName: "Totem Stand",
    tagline: "Porous architectural column with warm ochre texture",
    stoneType: "Roman Travertine",
    origin: "Tivoli, Italy",
    price: 65,
    image: "/images/products/travertine-candleholder.jpg",
    dimensions: '4" W x 4" D x 8" H',
    badge: "Limited Edition"
  }
]

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePiece = FEATURED_PIECES[activeIndex]

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-b from-[#F4EFEA] via-[#EFE9E0] to-[#E9E1D6] pt-28 pb-16 sm:py-24 lg:py-28">
      {/* Ambient warm copper bronze glow & atmospheric textures */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial aura top right */}
        <div className="absolute -top-24 right-0 w-[600px] h-[600px] bg-primary/12 rounded-full blur-3xl" />
        {/* Soft aura bottom left */}
        <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-[#C47952]/10 rounded-full blur-3xl" />
        
        {/* Subtle geometric architectural guideline */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-stone-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-stone-grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Brand Narrative & CTAs */}
          <div className="lg:col-span-6 xl:col-span-5 text-center lg:text-left pt-2 lg:pt-0">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium mb-5 sm:mb-6 animate-blur-in"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Hand-Carved in Natural Stone</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] mb-4 sm:mb-6 text-foreground tracking-tight">
              <span className="block font-normal">
                The Art of
              </span>
              <span className="block italic text-primary font-serif font-medium">
                Marble Living.
              </span>
            </h1>

            <p className="text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 text-foreground/80">
              Sculptural marble handicrafts, chiseled and honed by hand to bring timeless geological beauty and warm copper bronze warmth into everyday spaces.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link 
                href="/shop" 
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-7 py-3.5 sm:px-8 sm:py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-primary/90 shadow-[0_8px_25px_rgba(158,86,50,0.25)] hover:shadow-[0_12px_30px_rgba(158,86,50,0.35)] cursor-pointer"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </Link>
              <Link 
                href="#craft-story" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground px-7 py-3.5 sm:px-8 sm:py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-foreground/5"
              >
                Our Stone Craft
              </Link>
            </div>

            {/* Atelier Trust Metrics */}
            <div className="pt-5 sm:pt-6 border-t border-border/60 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left">
              <div>
                <span className="block font-serif text-lg sm:text-2xl font-bold text-foreground">100%</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground block mt-0.5">Solid Stone</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-2xl font-bold text-foreground">Hand-Cut</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground block mt-0.5">Chiseled Finish</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-2xl font-bold text-foreground">Global</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground block mt-0.5">Crate Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Masterpiece Interactive Showcase */}
          <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center w-full">
            
            {/* Interactive Piece Selector Tabs */}
            <div className="w-full max-w-lg mb-3 sm:mb-4 flex items-center justify-between gap-1 p-1 rounded-2xl bg-card/80 backdrop-blur-md border border-border/60 shadow-xs">
              {FEATURED_PIECES.map((piece, idx) => (
                <button
                  key={piece.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-medium boty-transition text-center ${
                    activeIndex === idx
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <span className="hidden sm:inline text-[10px] opacity-75 mr-1">0{idx + 1}.</span>
                  <span className="hidden sm:inline">{piece.name}</span>
                  <span className="sm:hidden">{piece.shortName}</span>
                </button>
              ))}
            </div>

            {/* Masterpiece Visual Display Frame */}
            <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/13] rounded-3xl overflow-hidden border border-primary/25 shadow-[0_25px_60px_-15px_rgba(158,86,50,0.22)] bg-card group">
              
              {/* High-Resolution Stone Masterpiece Image */}
              <div className="relative w-full h-full">
                <Image
                  src={activePiece.image}
                  alt={activePiece.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Soft gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Floating Top-Left Badge: Signature Badge */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 max-w-[calc(100%-1.5rem)] sm:max-w-none">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-white/20 text-foreground text-[11px] sm:text-xs font-medium shadow-md">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                  <span className="truncate">{activePiece.badge}</span>
                  <span className="text-muted-foreground/60 hidden sm:inline">•</span>
                  <span className="text-primary font-semibold hidden sm:inline truncate">{activePiece.stoneType}</span>
                </div>
              </div>

              {/* Floating Top-Right: Origin Pill */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 hidden sm:block">
                <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[11px] uppercase tracking-wider font-medium">
                  {activePiece.origin}
                </div>
              </div>

              {/* Floating Bottom Card: Product Specs & Quick Action */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-20">
                <div className="p-3 sm:p-5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-lg flex items-center justify-between gap-2.5 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif text-sm sm:text-lg font-bold text-foreground truncate">
                        {activePiece.name}
                      </h3>
                      <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                        ${activePiece.price}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground truncate hidden sm:block">
                      {activePiece.tagline} • Dimensions: {activePiece.dimensions}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground sm:hidden truncate">
                      {activePiece.dimensions}
                    </p>
                  </div>

                  <Link
                    href={`/product/${activePiece.slug}`}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 boty-transition shadow-sm"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Proof Strip below the showcase */}
            <div className="w-full max-w-lg mt-3 sm:mt-4 flex items-center justify-between gap-2 px-1 text-[10px] sm:text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="font-medium text-foreground text-[10px] sm:text-[11px]">5.0 (140+ Reviews)</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Solid Natural Stone</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Subtle bottom scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-foreground/50">
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium">Scroll</span>
        <div className="w-px h-8 bg-foreground/20">
          <div className="w-full h-1/2 bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
