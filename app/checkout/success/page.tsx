"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  MessageCircle, 
  ArrowRight, 
  Package, 
  Sparkles,
  Calendar,
  Clock
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      setError("No order identifier provided.")
      return
    }

    fetch(`/api/orders?id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.order) {
          setOrder(data.order)
        } else {
          setError(data.error || "Could not locate order details.")
        }
      })
      .catch(() => {
        setError("Network error retrieving acquisition certificate.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center">
        <Clock className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p className="font-serif text-xl text-foreground">Retrieving Acquisition Certificate...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-40 pb-24 text-center max-w-lg mx-auto px-6">
        <p className="text-destructive mb-4">{error || "Acquisition details not found."}</p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold"
        >
          Return to Collection
        </Link>
      </div>
    )
  }

  const whatsappMessage = encodeURIComponent(
    `Greetings Sang Tarash Atelier. I have placed an acquisition order (Reference: ${order.id}) for ${order.items?.length || 1} piece(s) under the name ${order.customerName}. I would like to coordinate transit and carving updates.`
  )

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Certificate Card */}
        <div className="bg-card rounded-3xl border border-border/60 shadow-[0_10px_40px_rgba(40,35,31,0.06)] overflow-hidden">
          {/* Certificate Header Banner */}
          <div className="bg-primary/10 border-b border-primary/20 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 text-primary mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-bold block mb-1">
              Certificate of Acquisition
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-semibold mb-2">
              Acquisition Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your handcrafted stoneware order has been formally recorded in the Sang Tarash atelier archives.
            </p>
          </div>

          {/* Certificate Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-background border border-border/50 text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Order Reference</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-primary">{order.id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Acquisition Date</span>
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary/15 text-primary">
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Total Investment</span>
                <span className="font-serif text-xs sm:text-sm font-bold text-foreground">${order.totalAmount}</span>
              </div>
            </div>

            {/* Patron & Shipping Coordinates */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block mb-2">
                  Patron Coordinates
                </span>
                <p className="text-sm font-serif font-medium text-foreground">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
                <p className="text-muted-foreground">{order.customerPhone}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block mb-2">
                  Crated Freight Destination
                </span>
                <p className="text-foreground">{order.shippingAddress}</p>
                <p className="text-foreground">{order.city}, {order.state} {order.postalCode}</p>
                <p className="text-foreground font-medium">{order.country}</p>
                <p className="text-muted-foreground capitalize pt-1">Tier: {order.deliveryMethod?.replace("_", " ")}</p>
              </div>
            </div>

            {/* Inscription if present */}
            {order.customInscription && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block mb-1">
                  Custom Inscription / Dedication
                </span>
                <p className="font-serif italic text-xs sm:text-sm text-foreground/90">
                  &ldquo;{order.customInscription}&rdquo;
                </p>
              </div>
            )}

            {/* Items List */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block mb-4">
                Selected Stone Pieces
              </span>
              <div className="divide-y divide-border/40 border border-border/40 rounded-2xl overflow-hidden bg-background">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-serif text-sm font-semibold text-primary">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#20bd5a] boty-transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Concierge Support</span>
              </a>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-card border border-border/60 text-foreground px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-muted boty-transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>

                <Link
                  href="/shop"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-sm"
                >
                  <span>Atelier Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="pt-40 text-center text-muted-foreground">Loading certificate...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  )
}
