"use client"

import { useState } from "react"
import { Minus, Plus, Check, ChevronDown, Gem, Hammer, Sparkles, ShieldCheck } from "lucide-react"
import { useCart } from "@/components/boty/cart-context"

interface AddToCartProps {
  product: {
    id: string
    name: string
    stoneType: string
    details: string
    artisanStory: string
    careInstructions: string
    shipping: string
  }
  currentSize: {
    id: string
    sizeName: string
    dimensions: string
    weight: string
    price: number
    stock: number
  }
  selectedImage: string
}

const benefits = [
  { icon: Gem, label: "100% Solid Stone" },
  { icon: Hammer, label: "Hand-Honed Craft" },
  { icon: Sparkles, label: "Copper Bronze" },
  { icon: ShieldCheck, label: "Insured Crating" }
]

type AccordionSection = "specs" | "artisan" | "care" | "shipping"

export function AddToCartSection({ product, currentSize, selectedImage }: AddToCartProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<AccordionSection | null>("specs")

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${currentSize.id}`,
      name: `${product.name} — ${currentSize.sizeName}`,
      description: `${currentSize.dimensions} • ${product.stoneType}`,
      price: currentSize.price,
      image: selectedImage
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2200)
  }

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  const accordionItems: { key: AccordionSection; title: string; content: string }[] = [
    { 
      key: "specs", 
      title: "Geological Specs & Dimensions", 
      content: `${product.details} Current size: ${currentSize.sizeName} (${currentSize.dimensions}) weighing ${currentSize.weight}.` 
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
    <div className="space-y-8">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Benefits */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
  )
}
