"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ShieldCheck, 
  Package, 
  Truck, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  MessageCircle, 
  Building2, 
  CreditCard,
  ShoppingBag,
  Clock
} from "lucide-react"
import { useCart } from "@/components/boty/cart-context"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [deliveryMethod, setDeliveryMethod] = useState("insured_crate") // insured_crate, white_glove, studio_pickup
  const [paymentMethod, setPaymentMethod] = useState("whatsapp") // whatsapp, bank_wire, card
  const [customInscription, setCustomInscription] = useState("")
  const [notes, setNotes] = useState("")
  
  // Card simulation fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const deliveryCost = deliveryMethod === "white_glove" ? 85 : 0
  const grandTotal = subtotal + deliveryCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !country) {
      setErrorMessage("Please complete all required contact and crated shipping details.")
      return
    }

    if (items.length === 0) {
      setErrorMessage("Your acquisition tray is empty.")
      return
    }

    setIsSubmitting(true)

    try {
      const endpoint = paymentMethod === "card" ? "/api/checkout/stripe" : "/api/orders"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          state,
          postalCode,
          country,
          deliveryMethod,
          paymentMethod,
          items: items.map(item => ({
            id: item.id,
            sizeId: (item as any).sizeId || item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal,
          shippingCost: deliveryCost,
          totalAmount: grandTotal,
          customInscription,
          notes
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit acquisition.")
      }

      clearCart()

      if (paymentMethod === "card" && data.url) {
        if (data.url.startsWith("http")) {
          window.location.href = data.url
        } else {
          router.push(data.url)
        }
      } else {
        router.push(`/checkout/success?orderId=${data.order?.id || data.orderId}`)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-6 pt-36 pb-24 text-center">
          <div className="w-20 h-20 rounded-full bg-card border border-border/60 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-9 h-9 text-muted-foreground/60" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-medium mb-3">
            Your Acquisition Tray is Empty
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8">
            Explore our curated catalog of natural marble vessels, handcrafted sculptures, and burnished bronze stoneware.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-sm"
          >
            Browse Atelier Collection
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb Header */}
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary boty-transition mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Browsing</span>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/50 pb-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold block mb-1">
                  Private Acquisition Service
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-medium">
                  Atelier Checkout
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Insured Metamorphic Stone Transit</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {errorMessage}
                </div>
              )}

              {/* 1. Client Contact Details */}
              <section className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium mb-1">
                  1. Patron Contact Information
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Used for crating dispatch verification and private transit coordination.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Lorde Evelyn Sterling"
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="evelyn@atelier.com"
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 382-9901"
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Delivery Destination */}
              <section className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium mb-1">
                  2. Crated Delivery Address
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Heavy architectural stone pieces are freighted in vibration-dampened timber crates.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      placeholder="450 Stonehaven Terrace, Suite 800"
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="New York"
                        className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="NY"
                        className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        placeholder="10021"
                        className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="United States"
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>
                </div>
              </section>

              {/* 3. Delivery Method Tier */}
              <section className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium mb-1">
                  3. Select Handling & Freight Tier
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Every order includes custom high-density foam shock isolation.
                </p>

                <div className="space-y-3">
                  {/* Tier 1 */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer boty-transition ${
                      deliveryMethod === "insured_crate"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="insured_crate"
                        checked={deliveryMethod === "insured_crate"}
                        onChange={() => setDeliveryMethod("insured_crate")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-semibold text-foreground">
                            Insured Reinforced Timber Crate
                          </span>
                          <span className="text-xs font-semibold text-primary">Complimentary</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Precision CNC high-density foam containment with fracture replacement guarantee in transit. (3–7 business days)
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Tier 2 */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer boty-transition ${
                      deliveryMethod === "white_glove"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="white_glove"
                        checked={deliveryMethod === "white_glove"}
                        onChange={() => setDeliveryMethod("white_glove")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-semibold text-foreground">
                            White-Glove In-Home Placement
                          </span>
                          <span className="text-xs font-semibold text-primary">+$85</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Two-person specialized stone courier team. Uncrating, placement in requested room, and complete packaging debris removal.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Tier 3 */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer boty-transition ${
                      deliveryMethod === "studio_pickup"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="studio_pickup"
                        checked={deliveryMethod === "studio_pickup"}
                        onChange={() => setDeliveryMethod("studio_pickup")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-semibold text-foreground">
                            Atelier Workshop Collection
                          </span>
                          <span className="text-xs font-semibold text-primary">Complimentary</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Inspect and receive your piece directly from our stone studio with master artisan care briefing.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {/* 4. Bespoke Inscription & Special Instructions */}
              <section className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium">
                    4. Bespoke Inscription & Patron Notes
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Optional complimentary gift card or custom dedication message included with your stone piece.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Gift Note / Dedication Inscription (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customInscription}
                      onChange={e => setCustomInscription(e.target.value)}
                      placeholder="e.g. To Julian — Carved for your new architectural sanctuary."
                      className="w-full bg-background border border-border/60 rounded-xl p-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Delivery & Unloading Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Gate code #4490, delivery entrance via side terrace"
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
                    />
                  </div>
                </div>
              </section>

              {/* 5. Acquisition Method */}
              <section className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium mb-1">
                  5. Acquisition & Payment Method
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Select your preferred settlement or concierge acquisition avenue.
                </p>

                <div className="space-y-3">
                  {/* WhatsApp Concierge */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer boty-transition ${
                      paymentMethod === "whatsapp"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={paymentMethod === "whatsapp"}
                        onChange={() => setPaymentMethod("whatsapp")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-primary" />
                          <span className="font-serif text-sm font-semibold text-foreground">
                            WhatsApp Direct Concierge Acquisition
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Your order reference and stone choices are logged immediately, with a direct WhatsApp conversation opened for personalized payment, live stone photo proofing, and dispatch updates.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Bank Wire */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer boty-transition ${
                      paymentMethod === "bank_wire"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_wire"
                        checked={paymentMethod === "bank_wire"}
                        onChange={() => setPaymentMethod("bank_wire")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="font-serif text-sm font-semibold text-foreground">
                            Direct Bank Wire / Pro-Forma Invoice
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Ideal for interior designers and corporate commissions. An official pro-forma invoice with IBAN/SWIFT coordinates will be issued with your order number.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Card Checkout */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer boty-transition ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className="font-serif text-sm font-semibold text-foreground">
                            Credit / Debit Card Acquisition
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Encrypted settlement simulation. Instant order confirmation and digital certificate generation.
                        </p>

                        {paymentMethod === "card" && (
                          <div className="mt-4 pt-4 border-t border-border/40 grid sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-3">
                              <input
                                type="text"
                                placeholder="Card Number (4000 1234 5678 9010)"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                placeholder="MM / YY"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(e.target.value)}
                                className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="CVC"
                                value={cardCvc}
                                onChange={e => setCardCvc(e.target.value)}
                                className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary (5 cols, sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <h2 className="font-serif text-xl text-foreground font-medium">Acquisition Summary</h2>
                  <span className="text-xs text-muted-foreground font-medium">
                    {items.length} {items.length === 1 ? "Piece" : "Pieces"}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3.5 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xs font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                        <span className="text-[11px] text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-xs font-bold text-primary">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="pt-4 border-t border-border/50 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-serif text-foreground font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Crated Freight & Transit Insurance</span>
                    <span className="text-foreground font-medium">
                      {deliveryCost === 0 ? "Complimentary" : `$${deliveryCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-foreground pt-3 border-t border-border/50">
                    <span>Total Acquisition</span>
                    <span className="font-serif text-base text-primary font-bold">${grandTotal}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 boty-transition shadow-[0_4px_20px_rgba(158,86,50,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Recording Acquisition...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm Acquisition • ${grandTotal}</span>
                    </>
                  )}
                </button>

                {/* Proof Points */}
                <div className="pt-4 border-t border-border/40 space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Every piece carved from 100% natural, solid stone.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Reinforced anti-shock crating with full transit insurance.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Includes Certificate of Authenticity signed by the atelier.</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
