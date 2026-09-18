"use client"

import Link from "next/link"
import { 
  Sparkles, 
  ShieldCheck, 
  Droplet, 
  AlertTriangle, 
  Check, 
  X, 
  HelpCircle,
  Clock,
  Printer
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

const dosAndDonts = [
  {
    type: "do",
    title: "Always Use pH-Neutral Soaps",
    desc: "Clean daily with lukewarm water and a drop of gentle, vegetable-based pH-neutral dish soap or specialized stone wash."
  },
  {
    type: "do",
    title: "Blot Spills Immediately",
    desc: "If oils, wine, or coffee contact the stone, blot immediately with a soft cloth rather than wiping across the surface."
  },
  {
    type: "do",
    title: "Re-Seal Seasonally",
    desc: "Apply a food-safe penetrating fluoropolymer impregnating stone sealer every 12 to 18 months for high-contact vessels."
  },
  {
    type: "dont",
    title: "Never Use Acidic Cleaners",
    desc: "Avoid vinegar, lemon juice, ammonia, bleach, or bathroom tile descalers, as acid chemically dissolves calcite marble."
  },
  {
    type: "dont",
    title: "Avoid Abrasive Scourers",
    desc: "Do not use steel wool, rough scouring sponges, or scouring powder which will dull the honed or polished finish."
  },
  {
    type: "dont",
    title: "Don't Leave Standing Water",
    desc: "Allow vessels and trays to dry thoroughly; prolonged standing hard water may leave mineral deposits over time."
  }
]

const stoneGuides = [
  {
    stone: "Carrara White & Statuario Marble",
    origin: "Tuscany, Italy",
    characteristics: "Metamorphic limestone composed of recrystallized calcite crystals with cool grey and bronze veining.",
    careNotes: "Calcite is sensitive to acids. Ensure fruit acids or salad dressings on marble platters are blotted promptly. Honed finishes develop a graceful natural patina over time."
  },
  {
    stone: "Roman Travertine",
    origin: "Tivoli & Balochistan",
    characteristics: "Sedimentary limestone formed by mineral springs, celebrated for its warm earthy banding and natural voids.",
    careNotes: "Natural cellular cavities are part of Travertine's tactile beauty. Wipe dust with dry microfiber and clean voids using a soft camel-hair brush."
  },
  {
    stone: "Nero Marquina",
    origin: "Markina, Spain",
    characteristics: "Dense, fine-grained black marble veined with brilliant white calcite fractures and natural bitumen accents.",
    careNotes: "High-contrast dark stone highlights hard water watermarks more easily. Always dry with a lint-free microfiber towel after rinsing."
  },
  {
    stone: "Emerald Green Onyx",
    origin: "Balochistan",
    characteristics: "Cryptocrystalline quartz chalcedony with translucent jade bands and honey-gold iron oxide ribbons.",
    careNotes: "Onyx is slightly more brittle than standard marble. Handle with both hands, avoid rapid thermal shocks, and keep away from direct high heat."
  }
]

export default function StoneCarePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 border-b border-border/50 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Preservation & Longevity</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground font-medium mb-6">
            Stone Care & Preservation Guide
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            Natural metamorphic stone breathes and ages with nobility. With simple ritual maintenance, your Sang Tarash pieces will endure for generations.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-card border border-border/70 text-foreground px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:border-primary/50 boty-transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Care Reference</span>
          </button>
        </div>
      </section>

      {/* Rituals & Principles (Do's & Don'ts) */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-2">
            Essential Tenets
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-medium">
            Daily Care & Handling Principles
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dosAndDonts.map((rule, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${
                rule.type === "do"
                  ? "bg-card border-border/60"
                  : "bg-destructive/5 border-destructive/20"
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      rule.type === "do"
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {rule.type === "do" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">{rule.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stone-Specific Guidance */}
      <section className="py-20 bg-card/60 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-2">
              Geological Diversity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-medium">
              Care by Geological Variety
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {stoneGuides.map((guide, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-background border border-border/50 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground">{guide.stone}</h3>
                    <span className="text-xs text-primary font-medium tracking-wider uppercase">
                      Origin: {guide.origin}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {guide.characteristics}
                </p>
                <div className="p-4 rounded-2xl bg-card border border-border/40 text-xs text-foreground/85 leading-relaxed">
                  <span className="font-semibold text-primary block mb-1">Preservation Protocol:</span>
                  {guide.careNotes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Stain Treatment: Poultice Guide */}
      <section className="py-20 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border/60 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Droplet className="w-6 h-6 text-primary" />
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">
              Emergency Oil Stain Treatment: The Baking Soda Poultice
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If cooking oil or wine penetrates unsealed natural marble, a classic drawing poultice will absorb the stain out of the porous stone capillaries without damaging the finish:
          </p>

          <ol className="space-y-4 text-xs sm:text-sm text-foreground/90 list-decimal list-inside leading-relaxed">
            <li>
              <strong>Mix the paste:</strong> Combine baking soda with a small amount of distilled water until it reaches the consistency of thick peanut butter.
            </li>
            <li>
              <strong>Apply:</strong> Spread a 1/4-inch thick layer of the paste directly over the stained area, extending 1/2 inch beyond the edges.
            </li>
            <li>
              <strong>Cover & Seal:</strong> Cover with plastic cling wrap and tape down the edges with masking tape. Make 2–3 small pinpricks in the plastic to allow slow moisture venting.
            </li>
            <li>
              <strong>Wait 24–48 Hours:</strong> As the paste completely dries into powder, it pulls the oil residue upward into the baking soda.
            </li>
            <li>
              <strong>Rinse:</strong> Remove the wrap, gently scrape off the dried powder with a soft silicone spatula, rinse with warm water, and dry with microfiber.
            </li>
          </ol>

          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Have a complex conservation question? Our stone restoration atelier is available.
            </span>
            <Link
              href="/contact"
              className="text-xs text-primary font-semibold hover:underline flex-shrink-0"
            >
              Contact Atelier Concierge →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
