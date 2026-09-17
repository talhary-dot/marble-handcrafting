"use client"

import { useEffect, useRef, useState } from "react"
import { Gem, Hammer, Sparkles, ShieldCheck } from "lucide-react"

const badges = [
  { 
    icon: Gem, 
    title: "100% Natural Stone", 
    description: "Solid Italian Carrara, Roman Travertine & rare Makrana marble." 
  },
  { 
    icon: Hammer, 
    title: "Hand-Honed Craft", 
    description: "Individually chiseled and polished by master lapidaries." 
  },
  { 
    icon: Sparkles, 
    title: "Copper Bronze Accents", 
    description: "Warm metallic inserts and accents crafted for timeless heirloom appeal." 
  },
  { 
    icon: ShieldCheck, 
    title: "Reinforced Crating", 
    description: "Eco-cushioned archival packaging ensuring safe international transit." 
  }
]

export function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 bg-background border-y border-border/40">
      <div 
        ref={sectionRef} 
        className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {badges.map((badge, index) => (
          <div 
            key={badge.title} 
            className={`p-6 text-center rounded-2xl bg-card/60 border border-border/40 transition-all duration-700 hover:border-primary/30 hover:bg-card ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`} 
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <badge.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-foreground font-medium mb-1.5 text-xl">{badge.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
