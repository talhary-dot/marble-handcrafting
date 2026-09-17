import { NextRequest, NextResponse } from "next/server"
import { getProductBySlugOrIdFromDb, updateProductInDb, deleteProductFromDb } from "@/lib/db/queries"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = await getProductBySlugOrIdFromDb(id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ product })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to get product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { sizes, ...productData } = body

    // Word count validation: max 2000 words
    if (productData.description) {
      const words = productData.description.trim().split(/\s+/).filter(Boolean)
      if (words.length > 2000) {
        return NextResponse.json({ error: `Description exceeds max 2000 words (current: ${words.length} words)` }, { status: 400 })
      }
    }

    const updated = await updateProductInDb(id, productData, sizes)
    return NextResponse.json({ product: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    await deleteProductFromDb(id)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
