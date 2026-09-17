"use client"

import React, { useState } from "react"
import { ArrowRight, Check, Sparkles } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative subtle ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs uppercase tracking-[0.25em] font-medium mb-4 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3 h-3" />
            <span>The Atelier Registry</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-white mb-4 text-balance">
            Bring Stone Home
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-10 leading-relaxed">
            Subscribe for private studio dispatches, limited quarry block releases, and artisan profiles from our stone carving workshops.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-8 py-4 border border-white/30 text-white font-medium">
              <Check className="w-5 h-5 text-white" />
              <span>Welcome to the Marmo Collector Registry.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:bg-white/25 boty-transition text-sm"
                required
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-white/90 shadow-md flex-shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition text-primary" />
              </button>
            </form>
          )}

          <p className="text-xs text-white/70 mt-6 tracking-wide">
            Strictly curated dispatches. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  )
}
