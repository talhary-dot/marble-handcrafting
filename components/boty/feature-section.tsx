"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Gem, Hammer, Compass, ShieldCheck, Sparkles, Mountain, Layers, Eye } from "lucide-react"

const features = [
  {
    icon: Gem,
    title: "Genuine Natural Marble",
    description: "Solid Carrara, Travertine & Onyx stone with singular, unrepeatable veining."
  },
  {
    icon: Hammer,
    title: "Generational Stonemasons",
    description: "Hand-chiseled, contoured, and honed by master artisans using time-honored lapidary tools."
  },
  {
    icon: Compass,
    title: "Architectural Longevity",
    description: "Weighted metamorphic rock built to last generations, aging with dignified patina."
  },
  {
    icon: ShieldCheck,
    title: "Eco-Sealed & Table-Safe",
    description: "Treated with non-toxic, food-safe stone sealants to resist oils, wine, and water marks."
  }
]

export function FeatureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const bentoRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true)
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

    if (bentoRef.current) {
      observer.observe(bentoRef.current)
    }

    if (videoSectionRef.current) {
      videoObserver.observe(videoSectionRef.current)
    }

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    return () => {
      if (bentoRef.current) {
        observer.unobserve(bentoRef.current)
      }
      if (videoSectionRef.current) {
        videoObserver.unobserve(videoSectionRef.current)
      }
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background" id="craft-story">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bento Grid */}
        <div 
          ref={bentoRef}
          className="grid md:grid-cols-4 mb-20 md:grid-rows-[320px_320px] gap-6"
        >
          {/* Left Large Block - Hand-Chiseled Marble Artistry */}
          <div 
            className={`relative rounded-3xl overflow-hidden h-[500px] md:h-auto md:col-span-2 md:row-span-2 transition-all duration-700 ease-out border border-border/40 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <Image
              src="/images/products/bento-carved-bowl.jpg"
              alt="Hand-Chiseled Marble Artistry"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transform transition-transform duration-700 hover:scale-105"
              priority
            />
            
            {/* Ambient copper bronze gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-md p-6 shadow-xl rounded-2xl border border-border/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Hammer className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-foreground mb-1.5 font-serif font-medium">
                    Hand-Chiseled <span className="text-primary font-serif italic">Marble Artistry</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every piece is sculpted, dry-honed, and buffed by hand to reveal the dramatic geological history written into the stone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - Ancient Marble, Sculpted Slowly */}
          <div 
            className={`rounded-3xl p-8 flex flex-col justify-center md:col-span-2 relative overflow-hidden transition-all duration-700 ease-out border border-border/40 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Background Image - Genuine Stone Craft */}
            <Image
              src="/images/products/bento-stone-quarry.jpg"
              alt="Ancient Marble, Sculpted Slowly"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35" />


            <div className="relative z-10">
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-2 block">
                Pure Geological Craft
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">
                Ancient Marble,
              </h3>
              <h3 className="font-serif text-2xl md:text-3xl text-white/80 italic mb-4">
                Sculpted Slowly.
              </h3>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-white/90 text-sm">
                  <Mountain className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Quarried responsibly from historical European & Asian deposits</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 text-sm">
                  <Layers className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Subtle bronze, charcoal & crystalline mineral veins</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 text-sm">
                  <Eye className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>No synthetic molds, composites, or cast resin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right - Responsible Stonecraft */}
          <div 
            className={`rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden md:col-span-2 transition-all duration-700 ease-out border border-border/40 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Background Image - Hand-Finished Stonecraft */}
            <Image
              src="/images/products/bento-travertine-stand.jpg"
              alt="Zero-Waste Stone Atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center scale-[1.02]"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30 backdrop-blur-[0.5px]" />

            
            <div className="relative z-10 flex flex-col justify-center h-full text-left items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md mb-3 border border-white/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-white/80 font-medium mb-1">
                Zero-Waste Stone Atelier
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-medium text-white mb-2">
                Hand-Finished in Small Batches
              </h3>
              <p className="text-sm text-white/80 max-w-sm">
                Offcut remnants from architectural marble slabs are carefully reclaimed into tactile functional art.
              </p>
            </div>
          </div>
        </div>

        {/* Video + Brand Story Grid */}
        <div 
          ref={videoSectionRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center my-0 py-16"
        >
          {/* Stonecraft Masterpiece Picture */}
          <div 
            className={`relative aspect-[4/5] rounded-3xl overflow-hidden boty-shadow transition-all duration-700 ease-out border border-primary/25 group ${
              isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <Image
              src="/images/products/travertine-candleholder.jpg"
              alt="Sang Tarash Honed Roman Travertine and Copper Bronze Object"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
            
            {/* Subtle warm atmospheric gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute top-5 left-5 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-white/20 text-foreground text-xs font-medium shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Roman Travertine & Pure Copper</span>
              </div>
            </div>

            {/* Floating Bottom Card */}
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <div className="p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border/70 shadow-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-medium text-foreground block text-sm">The Stillness Column</span>
                  <span className="text-[11px] text-muted-foreground">Hand-chiseled architectural stone & warm bronze collar</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  Sang Tarash
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            ref={headerRef}
            className={`transition-all duration-700 ease-out ${
              isVideoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span 
              className={`text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
              style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}
            >
              The Sang Tarash Philosophy
            </span>

            <h2 
              className={`font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground mb-6 text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
              style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}
            >
              Stone That Holds <span className="italic text-primary">Stillness.</span>
            </h2>
            <p 
              className={`text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
              style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}
            >
              In a world of transient plastic and fast decor, we carve objects with permanence. Every vessel, tray, and sculpture brings the cool groundedness of natural rock and the warm metallic glow of copper bronze into your home.
            </p>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-5 boty-transition hover:-translate-y-1 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground boty-transition">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-medium text-foreground text-base mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
