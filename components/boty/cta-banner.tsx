"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Gem, Hammer, Sparkles, ArrowRight } from "lucide-react"

export function CTABanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={bannerRef}
          className={`rounded-3xl p-10 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[460px] border border-border/40 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Background Image - Optimized Marble Handicrafts */}
          <Image
            src="/images/products/cta-marble-handicrafts.jpg"
            alt="Sang Tarash Handcrafted Marble Artistry"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
            priority
          />

          
          {/* Warm Copper Bronze tinted dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-left max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-primary mb-3 block">
              Timeless Living
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-2 leading-tight">
              Shaped by Stone.
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white/70 mb-8 italic">
              Finished with Copper Bronze.
            </h3>
            
            <div className="flex flex-col items-start gap-4 mb-10">
              <div className="flex items-center gap-3 text-white/90">
                <Gem className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm sm:text-base">Natural Italian Carrara, travertine, and onyx blocks</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Hammer className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm sm:text-base">Individually sculpted by generational lapidary artisans</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm sm:text-base">Aged copper bronze accents that deepen with rich patina</span>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-primary/90 shadow-[0_4px_25px_rgba(158,86,50,0.4)]"
            >
              <span>Explore The Atelier Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
