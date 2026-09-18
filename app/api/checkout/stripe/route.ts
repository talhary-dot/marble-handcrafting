import { NextRequest, NextResponse } from "next/server"
import { db, ensureDbInitialized } from "@/lib/db"
import { orders, productSizes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notifyStudioOfAcquisition } from "@/lib/notifications"

export async function POST(req: NextRequest) {
  try {
    await ensureDbInitialized()
    const body = await req.json()

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      state,
      postalCode,
      country,
      deliveryMethod = "insured_crate",
      items = [],
      subtotal = 0,
      shippingCost = 0,
      totalAmount = 0,
      customInscription = "",
      notes = ""
    } = body

    if (!customerName || !customerEmail || !shippingAddress || !city || !country) {
      return NextResponse.json(
        { error: "Missing required customer or delivery coordinates." },
        { status: 400 }
      )
    }

    const itemsList = Array.isArray(items) ? items : []
    if (itemsList.length === 0) {
      return NextResponse.json(
        { error: "Acquisition tray is empty." },
        { status: 400 }
      )
    }

    // Verify stock availability
    for (const it of itemsList) {
      const sizeVariantId = it.sizeId || it.id
      if (sizeVariantId) {
        const found = await db.select().from(productSizes).where(eq(productSizes.id, sizeVariantId)).limit(1)
        if (found.length > 0) {
          const currentStock = found[0].stock
          const qty = Math.max(1, Number(it.quantity) || 1)
          if (currentStock < qty) {
            return NextResponse.json(
              { error: `Insufficient inventory for "${it.name}". Only ${currentStock} remaining in atelier stock.` },
              { status: 409 }
            )
          }
          await db
            .update(productSizes)
            .set({ stock: Math.max(0, currentStock - qty) })
            .where(eq(productSizes.id, sizeVariantId))
        }
      }
    }

    const orderId = `ST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const newOrder = {
      id: orderId,
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      customerPhone: String(customerPhone || "").trim(),
      shippingAddress: String(shippingAddress).trim(),
      city: String(city).trim(),
      state: String(state || "").trim(),
      postalCode: String(postalCode || "").trim(),
      country: String(country).trim(),
      deliveryMethod: String(deliveryMethod),
      paymentMethod: "card",
      items: JSON.stringify(itemsList),
      subtotal: Math.round(Number(subtotal) || 0),
      shippingCost: Math.round(Number(shippingCost) || 0),
      totalAmount: Math.round(Number(totalAmount) || 0),
      status: "pending",
      customInscription: customInscription ? String(customInscription).trim() : null,
      notes: notes ? String(notes).trim() : null
    }

    await db.insert(orders).values(newOrder)

    // Notify studio
    notifyStudioOfAcquisition({
      ...newOrder,
      items: itemsList
    }).catch((err) => console.warn("[Studio Notification] Dispatch error:", err))

    const stripeKey = process.env.STRIPE_SECRET_KEY
    const origin = req.headers.get("origin") || "http://localhost:3000"

    // If live Stripe Secret Key is configured in environment, create real Stripe Checkout session
    if (stripeKey) {
      try {
        const formData = new URLSearchParams()
        formData.append("mode", "payment")
        formData.append("success_url", `${origin}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`)
        formData.append("cancel_url", `${origin}/checkout?canceled=true`)
        formData.append("customer_email", newOrder.customerEmail)
        formData.append("client_reference_id", orderId)

        // Add line items
        itemsList.forEach((it: any, index: number) => {
          formData.append(`line_items[${index}][price_data][currency]`, "usd")
          formData.append(`line_items[${index}][price_data][unit_amount]`, String(Math.round((Number(it.price) || 0) * 100)))
          formData.append(`line_items[${index}][price_data][product_data][name]`, it.name || "Stone Piece")
          if (it.description) {
            formData.append(`line_items[${index}][price_data][product_data][description]`, it.description)
          }
          formData.append(`line_items[${index}][quantity]`, String(Math.max(1, Number(it.quantity) || 1)))
        })

        // Add shipping if > 0
        if (newOrder.shippingCost > 0) {
          const idx = itemsList.length
          formData.append(`line_items[${idx}][price_data][currency]`, "usd")
          formData.append(`line_items[${idx}][price_data][unit_amount]`, String(Math.round(newOrder.shippingCost * 100)))
          formData.append(`line_items[${idx}][price_data][product_data][name]`, `Handling: ${deliveryMethod}`)
          formData.append(`line_items[${idx}][quantity]`, "1")
        }

        const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        })

        const stripeSession = await stripeRes.json()

        if (stripeSession.url) {
          return NextResponse.json({ url: stripeSession.url, orderId })
        }
      } catch (stripeErr) {
        console.warn("[Stripe API] Failed to initiate remote Stripe session:", stripeErr)
      }
    }

    // Fallback: If Stripe API key is not set, provide seamless simulated card settlement routing
    return NextResponse.json({
      simulated: true,
      url: `/checkout/success?orderId=${orderId}`,
      orderId
    })
  } catch (error: any) {
    console.error("Card settlement initialization error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to initiate card settlement" },
      { status: 500 }
    )
  }
}
