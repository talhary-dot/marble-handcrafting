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
      paymentMethod = "whatsapp",
      items = [],
      subtotal = 0,
      shippingCost = 0,
      totalAmount = 0,
      customInscription = "",
      notes = ""
    } = body

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !country) {
      return NextResponse.json(
        { error: "Please fill in all required customer and delivery fields." },
        { status: 400 }
      )
    }

    const itemsList = Array.isArray(items) ? items : []
    if (itemsList.length === 0) {
      return NextResponse.json(
        { error: "Your acquisition tray is empty." },
        { status: 400 }
      )
    }

    // Check inventory availability and deduct stock for limited-edition stone variants
    for (const it of itemsList) {
      const sizeVariantId = it.sizeId || it.id
      if (sizeVariantId) {
        const found = await db.select().from(productSizes).where(eq(productSizes.id, sizeVariantId)).limit(1)
        if (found.length > 0) {
          const currentStock = found[0].stock
          const qty = Math.max(1, Number(it.quantity) || 1)
          if (currentStock < qty) {
            return NextResponse.json(
              { error: `Insufficient inventory for edition "${it.name}". Only ${currentStock} remaining in atelier vault.` },
              { status: 409 }
            )
          }
          // Decrement stock
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
      customerPhone: String(customerPhone).trim(),
      shippingAddress: String(shippingAddress).trim(),
      city: String(city).trim(),
      state: String(state || "").trim(),
      postalCode: String(postalCode || "").trim(),
      country: String(country).trim(),
      deliveryMethod: String(deliveryMethod),
      paymentMethod: String(paymentMethod),
      items: JSON.stringify(itemsList),
      subtotal: Math.round(Number(subtotal) || 0),
      shippingCost: Math.round(Number(shippingCost) || 0),
      totalAmount: Math.round(Number(totalAmount) || 0),
      status: "pending",
      customInscription: customInscription ? String(customInscription).trim() : null,
      notes: notes ? String(notes).trim() : null
    }

    await db.insert(orders).values(newOrder)

    // Transmit background studio notification
    notifyStudioOfAcquisition({
      ...newOrder,
      items: itemsList
    }).catch((err) => console.warn("[Studio Notification] Dispatch error:", err))

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to submit acquisition inquiry" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureDbInitialized()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = result[0]
    let parsedItems = []
    try {
      parsedItems = JSON.parse(order.items)
    } catch {
      parsedItems = []
    }

    return NextResponse.json({
      order: {
        ...order,
        items: parsedItems
      }
    })
  } catch (error: any) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve order" },
      { status: 500 }
    )
  }
}
