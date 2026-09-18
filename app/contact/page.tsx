"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Sparkles, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronDown, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

const faqs = [
  {
    q: "How are heavy marble pieces packaged to prevent fractures?",
    a: "Every Sang Tarash piece is suspended within precision CNC-milled high-density polyethylene foam blocks, encased inside reinforced timber crates. We guarantee 100% transit insurance; in the rare event of transit damage, we sculpt an immediate replacement or issue a full refund."
  },
  {
    q: "Can I commission custom dimensions for my residence or studio?",
    a: "Yes. Our master lapidary workshop frequently carves bespoke dimensions for dining tables, vessel sinks, fireplace hearths, and sculptural pedestals. Visit our Bespoke Commissions page or contact our concierge with your spatial drawings."
  },
  {
    q: "Can architects and interior designers request stone material samples?",
    a: "Certainly. We provide curated Stone Specimen Boxes featuring 10cm x 10cm honed and leathered samples of Carrara White, Roman Travertine, Nero Marquina, and Onyx. Contact our concierge to request a specimen parcel for your studio."
  },
  {
    q: "Are the copper bronze components solid or plated?",
    a: "All Sang Tarash metal collars, pedestals, and candleholder insets are forged from solid pure copper and architectural bronze, hand-burnished and coated with a protective beeswax layer to prevent unwanted oxidation."
  },
  {
    q: "What is the typical production timeline for bespoke works?",
    a: "Ready editions ship within 2 to 4 business days. Custom architectural commissions generally require 3 to 6 weeks depending on stone block quarry extraction and hand-chiseling complexity."
  }
]

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("General Inquiry")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 border-b border-border/50 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Client Services</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground font-medium mb-6">
            Atelier Concierge & Studio Visits
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether inquiring about ready stone works, coordinating white-glove crate transit, or arranging an artisan consultation, our concierge team is at your service.
          </p>
        </div>
      </section>

      {/* Contact Cards & Direct Message Form */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Coordinates (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl text-foreground font-medium">
                Atelier Coordinates
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">WhatsApp Direct Concierge</span>
                    <p className="text-muted-foreground mt-0.5 mb-2">Immediate assistance & live photo proofing</p>
                    <a
                      href="https://wa.me/?text=Greetings%20Sang%20Tarash%20Atelier."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
                    >
                      <span>Connect via WhatsApp</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Email Desk</span>
                    <p className="text-muted-foreground mt-0.5">concierge@sangtarash.artisan</p>
                    <p className="text-muted-foreground">commissions@sangtarash.artisan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Atelier Hours</span>
                    <p className="text-muted-foreground mt-0.5">Monday – Friday: 08:00 – 18:00 CET</p>
                    <p className="text-muted-foreground">Saturday: By Private Appointment</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Studio Locations</span>
                    <p className="text-muted-foreground mt-0.5">Primary Atelier: Via Carriona, Carrara, Italy</p>
                    <p className="text-muted-foreground">Lapidary Workshop: Stone Artisans Guild, Rajasthan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                All client correspondences and custom architectural specifications are handled with utmost discretion and confidentiality.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-3xl p-8 sm:p-10 border border-border/50 shadow-sm">
              <h2 className="font-serif text-2xl text-foreground font-medium mb-2">
                Send a Direct Message
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Our client concierge team will respond within 12 hours.
              </p>

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground font-medium">Message Dispatched</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Thank you, {name}. Your dispatch regarding &ldquo;{subject}&rdquo; has been forwarded to our lead stone concierge.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-primary font-semibold hover:underline pt-2 block mx-auto"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Amara Sen"
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
                        placeholder="amara@atelier.com"
                        className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Inquiry Topic
                    </label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="General Inquiry">General Atelier Inquiry</option>
                      <option value="Acquisition Assistance">Acquisition & Order Tracking</option>
                      <option value="Stone Samples Request">Stone Specimen Box Request</option>
                      <option value="Crated Shipping">International Crated Freight Question</option>
                      <option value="Conservation Advice">Stone Restoration & Conservation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Share your question, order reference, or requested stone details..."
                      className="w-full bg-background border border-border/60 rounded-xl p-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-[0_4px_20px_rgba(158,86,50,0.35)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Concierge</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="py-20 bg-card/60 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-2">
              Clarity & Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-medium">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-border/50 border-y border-border/50">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-serif text-base sm:text-lg text-foreground font-medium group-hover:text-primary boty-transition">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground boty-transition flex-shrink-0 ml-4 ${
                      openFaq === idx ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden boty-transition ${
                    openFaq === idx ? "max-h-96 pt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
