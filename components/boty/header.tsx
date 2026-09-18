"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, Search, Heart, Sparkles, ArrowRight } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"
import { useWishlist } from "./wishlist-context"

export function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { setIsOpen, itemCount } = useCart()
  const { wishlistCount } = useWishlist()

  const links = [
    { label: "Collection", href: "/shop" },
    { label: "Bespoke", href: "/bespoke" },
    { label: "Stone Care", href: "/care" },
    { label: "Concierge", href: "/contact" }
  ]

  // Pre-load products for instant quick search
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setAllProducts(data.products)
        }
      })
      .catch(() => {})
  }, [])

  // Live filter as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const q = searchQuery.toLowerCase().trim()
    const matches = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.stoneType && p.stoneType.toLowerCase().includes(q)) ||
      (p.origin && p.origin.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    ).slice(0, 5)
    setSearchResults(matches)
  }, [searchQuery, allProducts])

  // Focus input on search modal open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60)
    } else {
      setSearchQuery("")
    }
  }, [isSearchOpen])

  // Keyboard shortcut (Cmd/Ctrl + K) to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      } else if (e.key === "Escape") {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl py-0 backdrop-blur-md bg-background/85 border border-white/60 shadow-[0_10px_40px_rgba(40,35,31,0.08)]">
        <div className="flex items-center justify-between h-[64px] sm:h-[70px]">
          {/* Brand Logo on Start & Desktop Links */}
          <div className="flex items-center gap-3 sm:gap-8">
            {/* Mobile Menu Toggle */}
            <button 
              type="button" 
              className="lg:hidden p-1.5 sm:p-2 text-foreground/80 hover:text-foreground" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo on Start */}
            <Link href="/" className="flex flex-col text-left group">
              <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wider text-foreground font-semibold leading-tight">
                Sang Tarash
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary font-medium opacity-90 group-hover:text-primary/80 boty-transition">
                Marble Handicrafts
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-7 pl-6 border-l border-border/50">
              {links.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="text-xs uppercase tracking-[0.18em] font-medium text-foreground/75 hover:text-primary boty-transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>


          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button 
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-foreground/75 hover:text-primary boty-transition flex items-center gap-1.5" 
              aria-label="Search collection"
              title="Search collection (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline-block text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50 font-mono">
                ⌘K
              </span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-foreground/75 hover:text-primary boty-transition"
              aria-label="Saved pieces wishlist"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute 0 -top-0.5 -right-0.5 w-4 h-4 bg-primary/90 text-primary-foreground text-[10px] font-semibold flex items-center justify-center rounded-full shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button 
              type="button" 
              onClick={() => setIsOpen(true)} 
              className="relative p-2 text-foreground/75 hover:text-primary boty-transition" 
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute 0 -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <CartDrawer />

        {/* Mobile Dropdown Menu */}
        <div 
          className={`lg:hidden overflow-hidden boty-transition ${
            isMenuOpen ? "max-h-72 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            {links.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-wider uppercase font-medium text-foreground/80 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Global Quick Search Dialog Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-card border border-border/70 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.18)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center mb-4 pb-4 border-b border-border/50">
              <Search className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by marble type, vessel, tray, or origin (e.g. Carrara, Travertine)..."
                className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted boty-transition"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter Suggestions */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
              <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Explore:</span>
              {["Carrara", "Travertine", "Tableware", "Sculptures"].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 boty-transition text-[11px]"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Search Results */}
            <div className="max-h-80 overflow-y-auto space-y-2">
              {searchQuery.trim() && searchResults.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No stone pieces found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold block mb-2">
                    Matching Atelier Works
                  </span>
                  {searchResults.map(prod => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.slug || prod.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-muted/70 boty-transition group"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                        <Image
                          src={prod.featuredImage || "/placeholder.svg"}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm text-foreground font-medium group-hover:text-primary boty-transition truncate">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {prod.stoneType} • {prod.origin}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 boty-transition" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Type to explore natural Italian, Spanish, and Rajasthani stone collections.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-muted border border-border/60 font-mono text-[10px]">ESC</kbd> to exit</span>
              <Link 
                href={`/shop${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`}
                onClick={() => setIsSearchOpen(false)}
                className="text-primary hover:underline font-medium"
              >
                View all in catalogue →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
