import { NextRequest, NextResponse } from "next/server"
import { db, ensureDbInitialized } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { verifyAdminSession, ADMIN_COOKIE_NAME } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
    const session = token ? await verifyAdminSession(token) : null
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureDbInitialized()
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get("status")

    const query = db.select().from(orders).orderBy(desc(orders.createdAt))
    const results = await query

    const filtered = statusFilter && statusFilter !== "all" 
      ? results.filter((o: any) => o.status === statusFilter)
      : results

    const ordersWithParsedItems = filtered.map((order: any) => {
      let items = []
      try {
        items = JSON.parse(order.items)
      } catch {
        items = []
      }
      return {
        ...order,
        items
      }
    })

    return NextResponse.json({ orders: ordersWithParsedItems })
  } catch (error: any) {
    console.error("Error fetching admin orders:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
    const session = token ? await verifyAdminSession(token) : null
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureDbInitialized()
    const body = await req.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const updates: Record<string, any> = {
      updatedAt: new Date()
    }
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes

    await db.update(orders).set(updates).where(eq(orders.id, id))

    return NextResponse.json({ success: true, message: "Order status updated" })
  } catch (error: any) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update order" },
      { status: 500 }
    )
  }
}
