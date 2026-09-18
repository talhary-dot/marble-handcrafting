import Link from "next/link"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { Compass, ArrowRight, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chamber 404 • Uncharted Quarry</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-semibold text-foreground tracking-tight">
            Stone Not Found
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            The architectural stone piece or chamber you are looking for has been relocated or returned to the quarry.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-[0_4px_20px_rgba(158,86,50,0.35)]"
            >
              <span>Explore Atelier Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-card border border-border/70 text-foreground px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:border-primary/50 boty-transition"
            >
              <span>Return to Sanctum</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
