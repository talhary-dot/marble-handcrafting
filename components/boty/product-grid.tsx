"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ArrowRight, Heart } from "lucide-react"
import { useCart } from "./cart-context"
import { useWishlist } from "./wishlist-context"
import { products, type Product } from "@/lib/products"

type Category = "home" | "tableware" | "sculptures" | "decor"

const categories: { value: Category; label: string }[] = [
  { value: "home", label: "Home & Living" },
  { value: "tableware", label: "Tableware" },
  { value: "sculptures", label: "Sculptures" },
  { value: "decor", label: "Decor Accents" }
]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("home")
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const filteredProducts = products.filter(product => product.category === selectedCategory)

  const handleCategoryChange = (category: Category) => {
    if (category !== selectedCategory) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedCategory(category)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 250)
    }
  }

  useEffect(() => {
    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) {
      gridObserver.observe(gridRef.current)
    }

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    return () => {
      if (gridRef.current) {
        gridObserver.unobserve(gridRef.current)
      }
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-card" id="collection">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span 
            className={`text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
            style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}
          >
            The Marble & Stone Collection
          </span>
          <h2 
            className={`font-serif leading-tight text-foreground mb-4 text-balance text-4xl sm:text-5xl lg:text-6xl ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
            style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}
          >
            Objects with Presence
          </h2>
          <p 
            className={`text-base sm:text-lg text-muted-foreground max-w-lg mx-auto ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
            style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}
          >
            Hand-chiseled and honed natural stone pieces designed for timeless spaces and daily rituals.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex bg-background/80 backdrop-blur-md rounded-full p-1.5 border border-border/60 shadow-sm gap-1 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryChange(category.value)}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(158,86,50,0.3)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div 
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <div
              key={`${selectedCategory}-${product.id}`}
              className={`group transition-all duration-500 ease-out ${
                isVisible && !isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: isTransitioning ? '0ms' : `${index * 90}ms` }}
            >
              <div className="bg-background rounded-3xl overflow-hidden border border-border/40 boty-shadow boty-transition group-hover:-translate-y-1 group-hover:border-primary/30 flex flex-col h-full">
                {/* Image & Badges */}
                <Link href={`/product/${product.id}`} className="block relative aspect-[4/3] bg-muted overflow-hidden">
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
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase ${
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

                  {/* Stone Origin Tag */}
                  <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md text-[11px] font-medium bg-background/80 backdrop-blur-sm text-foreground/80 border border-white/20">
                    {product.stoneType.split('&')[0].trim()}
                  </span>

                  {/* Wishlist Button */}
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
                      isInWishlist(product.id)
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-background/80 border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-primary text-primary" : ""}`} />
                  </button>

                  {/* Quick Add Button */}
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
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                      Origin: {product.origin}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{product.dimensions}</span>
                    <Link
                      href={`/product/${product.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 boty-transition group/btn"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 boty-transition" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-primary/90 shadow-[0_4px_20px_rgba(158,86,50,0.25)]"
          >
            <span>View All Handcrafted Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
