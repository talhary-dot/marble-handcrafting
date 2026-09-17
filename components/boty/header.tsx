"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setIsOpen, itemCount } = useCart()
  const links = [
    { label: "Collection", href: "/shop" },
    { label: "Our Stonecraft", href: "/#craft-story" },
    { label: "Sculptures", href: "/shop?category=sculptures" },
    { label: "Tableware", href: "/shop?category=tableware" }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 rounded-2xl py-0 backdrop-blur-md bg-background/85 border border-white/60 shadow-[0_10px_40px_rgba(40,35,31,0.08)]">
        <div className="flex items-center justify-between h-[70px]">
          {/* Brand Logo on Start & Desktop Links */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu Toggle */}
            <button 
              type="button" 
              className="lg:hidden p-2 text-foreground/80 hover:text-foreground" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo on Start */}
            <Link href="/" className="flex flex-col text-left group">
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-foreground font-semibold leading-tight">
                Sang Tarash
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-primary font-medium opacity-90 group-hover:text-primary/80 boty-transition">
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
          <div className="flex items-center gap-3">
            <Link 
              href="/shop" 
              className="p-2 text-foreground/75 hover:text-primary boty-transition" 
              aria-label="Browse collection"
            >
              <Search className="w-4 h-4" />
            </Link>

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
    </header>
  )
}
