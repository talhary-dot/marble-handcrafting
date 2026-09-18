"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ArrowLeft 
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useWishlist } from "@/components/boty/wishlist-context"
import { useCart } from "@/components/boty/cart-context"

export default function WishlistPage() {
  const router = useRouter()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem, setIsOpen } = useCart()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description || item.stoneType || "Handcrafted stone",
      price: item.price,
      image: item.image
    })
  }

  const handleAcquireAll = () => {
    items.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        description: item.description || item.stoneType || "Handcrafted stone",
        price: item.price,
        image: item.image
      })
    })
    router.push("/checkout")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary boty-transition mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Collection</span>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border/50 pb-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-1">
                  Curated Selections
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-medium">
                  Patron Wishlist
                </h1>
              </div>

              {items.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="text-xs text-muted-foreground hover:text-destructive boty-transition"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={handleAcquireAll}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Acquire All Pieces</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border/50 max-w-2xl mx-auto px-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary/70" />
              </div>
              <h2 className="font-serif text-2xl text-foreground font-medium mb-2">
                Your Saved Pieces Tray is Empty
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                Curate your personal collection of architectural marble vessels, fluted stone pedestals, and artisanal sculptures.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-sm"
              >
                Browse Stone Works
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-card rounded-3xl overflow-hidden border border-border/40 boty-shadow boty-transition group flex flex-col justify-between"
                >
                  <Link href={`/product/${item.id}`} className="relative aspect-[4/3] bg-muted overflow-hidden block">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover boty-transition group-hover:scale-105 duration-700"
                    />
                    {item.origin && (
                      <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md text-[11px] font-medium bg-background/85 backdrop-blur-sm text-foreground/80 border border-white/20">
                        {item.origin}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeFromWishlist(item.id)
                      }}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive boty-transition"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <Link href={`/product/${item.id}`} className="hover:text-primary boty-transition">
                          <h3 className="font-serif text-lg text-foreground font-medium">{item.name}</h3>
                        </Link>
                        <span className="font-serif text-base font-semibold text-primary">${item.price}</span>
                      </div>
                      {item.stoneType && (
                        <p className="text-xs text-primary font-medium tracking-wider uppercase mb-2">
                          {item.stoneType}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Tray</span>
                      </button>

                      <Link
                        href={`/product/${item.id}`}
                        className="inline-flex items-center justify-center p-2.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground boty-transition"
                        aria-label="View piece"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
