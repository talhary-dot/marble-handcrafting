"use client"

import Link from "next/link"
import { Instagram, Globe, Sparkles } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Collections", href: "/shop" },
    { name: "Sculptures & Totems", href: "/shop?category=sculptures" },
    { name: "Tableware & Dining", href: "/shop?category=tableware" },
    { name: "Living & Trays", href: "/shop?category=home" },
    { name: "Vessels & Accents", href: "/shop?category=decor" }
  ],
  about: [
    { name: "The Atelier Story", href: "/#craft-story" },
    { name: "Stone Quarries & Heritage", href: "/#craft-story" },
    { name: "Lapidary Artisans", href: "/#craft-story" },
    { name: "Stone Care Guide", href: "/shop" }
  ],
  support: [
    { name: "Custom Commissions", href: "/#craft-story" },
    { name: "Crated Shipping & Transit", href: "/shop" },
    { name: "Authenticity & Geological Origin", href: "/#craft-story" },
    { name: "Client Care", href: "/shop" }
  ]
}

export function Footer() {
  return (
    <footer className="bg-card pt-20 pb-10 relative overflow-hidden border-t border-border/50">
      {/* Giant Background Watermark Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[130px] sm:text-[180px] md:text-[260px] font-bold text-foreground/[0.03] whitespace-nowrap leading-none tracking-widest">
          SANG TARASH
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <h2 className="font-serif text-3xl text-foreground font-semibold">Sang Tarash</h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium block">
                Marble Handicrafts
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Handcrafted marble objects, timeless stone sculptures, and burnished copper bronze stoneware by Sang Tarash.
            </p>
            <div className="flex gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-Sculpted Stone</span>
              </span>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif font-medium text-foreground mb-4 text-base tracking-wide">Collections</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-serif font-medium text-foreground mb-4 text-base tracking-wide">Stone Atelier</h3>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-serif font-medium text-foreground mb-4 text-base tracking-wide">Concierge</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Sang Tarash Atelier. All stone handicrafts carved by hand.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-primary boty-transition">
                Stone Ethics & Sourcing
              </Link>
              <Link href="/" className="hover:text-primary boty-transition">
                Care & Warranty
              </Link>
              <Link href="/" className="hover:text-primary boty-transition">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
