"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Sparkles, 
  Layers, 
  Ruler, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Hammer, 
  Building2, 
  Send 
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

const bespokeCategories = [
  {
    title: "Monolithic Dining & Coffee Tables",
    description: "Solid marble slabs carved with fluted architectural pedestals and honed bevel edges.",
    image: "/images/products/fluted-stone-vessel.jpg",
    specs: "Up to 3.2m length • Carrara, Travertine, Nero Marquina"
  },
  {
    title: "Carved Architectural Basins & Sinks",
    description: "Scooped from single monolithic stone blocks with concealed drainage and water-repellent sealants.",
    image: "/images/products/carved-stone-bowl.jpg",
    specs: "Custom depths • Honed, leathered, or brushed textures"
  },
  {
    title: "Architectural Totems & Fireplace Mantels",
    description: "Classical and brutalist hand-chiseled architectural statements for residences and luxury hospitality.",
    image: "/images/products/travertine-totem-stand.jpg",
    specs: "Engineered internal steel supports • Custom profiles"
  }
]

const processSteps = [
  {
    step: "01",
    title: "Vision & Architectural Brief",
    desc: "Share your spatial blueprints, desired stone varieties, dimensions, and textural requirements."
  },
  {
    step: "02",
    title: "Block Sourcing & 3D Drafting",
    desc: "We inspect quarried blocks in Carrara, Balochistan, and Tivoli for ideal vein continuity and structural integrity."
  },
  {
    step: "03",
    title: "Master Lapidary Sculpting",
    desc: "Generational stonemasons execute rough chiseling, CNC wire cutting, and hand-honing to microscopic tolerance."
  },
  {
    step: "04",
    title: "Seismic Crating & Transit",
    desc: "Your finished piece is sealed with breathable stone fluoropolymers and secured in custom high-density foam crates."
  }
]

export default function BespokePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [stoneType, setStoneType] = useState("Carrara White Marble")
  const [projectType, setProjectType] = useState("Dining Table")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 border-b border-border/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architectural Stonework Commissions</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-medium mb-6 text-balance max-w-4xl mx-auto leading-tight">
            Bespoke Marble Commissions & Architectural Stoneware
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            From monumental dining tables to hand-scooped monolith basins, Sang Tarash collaborates with architects, interior curators, and private collectors to sculpt enduring masterpieces.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#commission-form"
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-[0_4px_20px_rgba(158,86,50,0.35)]"
            >
              Submit Commission Brief
            </a>
            <Link
              href="/shop"
              className="bg-card border border-border/70 text-foreground px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:border-primary/50 boty-transition"
            >
              View Finished Works
            </Link>
          </div>
        </div>
      </section>

      {/* Bespoke Capabilities */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-2">
            Artisanal Horizons
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-medium">
            Custom Architectural Capabilities
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {bespokeCategories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-card rounded-3xl overflow-hidden border border-border/50 boty-shadow flex flex-col justify-between group hover:border-primary/40 boty-transition"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover boty-transition group-hover:scale-105 duration-700"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-foreground font-medium mb-2">{cat.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-[11px] text-primary font-medium flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{cat.specs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 4-Step Process */}
      <section className="py-20 bg-card/60 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-2">
              From Quarry to Sanctuary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-medium">
              The Commission Journey
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-background border border-border/50 space-y-3">
                <span className="font-serif text-3xl font-bold text-primary/40 block">
                  {step.step}
                </span>
                <h3 className="font-serif text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Inquiry Form */}
      <section id="commission-form" className="py-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border/60 shadow-[0_10px_40px_rgba(40,35,31,0.06)]">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-2">
              Start a Dialogue
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-medium mb-3">
              Submit an Architectural Commission Brief
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Our lead stone artisan and structural engineers will review your dimensions and provide initial feasibility and lead times within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-foreground font-medium">Brief Received</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Thank you, {name}. Our stone atelier master has received your inquiry for the {projectType} in {stoneType} and will contact you directly.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Submit another inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Julian Vance"
                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="julian@vance-studio.com"
                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                    Preferred Stone Variety
                  </label>
                  <select
                    value={stoneType}
                    onChange={e => setStoneType(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Carrara White Marble">Carrara White Marble (Italy)</option>
                    <option value="Roman Travertine">Roman Travertine (Tivoli)</option>
                    <option value="Nero Marquina">Nero Marquina (Spain)</option>
                    <option value="Emerald Onyx">Emerald Green Onyx (Balochistan)</option>
                    <option value="Rainforest Brown">Rainforest Brown Marble (Rajasthan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                    Piece Typology
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Dining Table">Custom Dining / Coffee Table</option>
                    <option value="Monolith Basin">Monolith Bathroom Basin / Sink</option>
                    <option value="Fireplace Mantel">Architectural Fireplace Mantel</option>
                    <option value="Sculptural Totem">Sculptural Pedestal / Totem</option>
                    <option value="Corporate Commission">Executive Gift / Commission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                  Project Description, Dimensions & Timeline *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Provide target dimensions (e.g. 240cm x 110cm x 75cm), finish preference (honed, leathered, polished), installation city, and project handover deadline..."
                  className="w-full bg-background border border-border/60 rounded-xl p-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-[0_4px_20px_rgba(158,86,50,0.35)] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Commission Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
