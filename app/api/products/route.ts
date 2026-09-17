import { NextRequest, NextResponse } from "next/server"
import { getProductsFromDb, createProductInDb } from "@/lib/db/queries"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const products = await getProductsFromDb(category)
    return NextResponse.json({ products })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch products"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sizes, ...productData } = body

    if (!productData.name || !productData.slug || !productData.featuredImage) {
      return NextResponse.json({ error: "Missing required product fields (name, slug, featuredImage)" }, { status: 400 })
    }

    // Word count validation: max 2000 words
    if (productData.description) {
      const words = productData.description.trim().split(/\s+/).filter(Boolean)
      if (words.length > 2000) {
        return NextResponse.json({ error: `Description exceeds max 2000 words (current: ${words.length} words)` }, { status: 400 })
      }
    }

    const created = await createProductInDb(
      {
        ...productData,
        id: productData.id || productData.slug
      },
      sizes || []
    )

    return NextResponse.json({ product: created }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
