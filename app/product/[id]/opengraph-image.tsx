import { ImageResponse } from "next/og"
import { getProductBySlugOrIdFromDb } from "@/lib/db/queries"
import { getProductById as getStaticProductById } from "@/lib/products"

export const alt = "Sang Tarash Heirloom Stoneware"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product: any = null
  try {
    product = await getProductBySlugOrIdFromDb(id)
  } catch (e) {
    product = getStaticProductById(id)
  }
  if (!product) {
    product = getStaticProductById(id)
  }

  const title = product?.name || "Sang Tarash Sculptural Stoneware"
  const stoneType = product?.stoneType || "Natural Metamorphic Marble"
  const origin = product?.origin || "Atelier Quarry"
  const price = product?.sizes?.[0]?.price ? `From $${product.sizes[0].price}` : "Solid Quarry Monolith"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#0D0D0D",
          color: "#FAF8F5",
          border: "2px solid #C5A059"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "#C5A059",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0D0D0D",
                fontWeight: "bold",
                fontSize: "20px"
              }}
            >
              ST
            </div>
            <div style={{ fontSize: "24px", letterSpacing: "0.2em", color: "#C5A059", fontWeight: "bold" }}>
              SANG TARASH
            </div>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(197, 160, 89, 0.18)",
              color: "#C5A059",
              fontSize: "14px",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}
          >
            {origin}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "16px", color: "#C5A059", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {stoneType}
          </div>
          <div style={{ fontSize: "56px", fontWeight: "bold", lineHeight: 1.1, maxWidth: "950px" }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "32px", color: "#D4AF37", fontWeight: "bold" }}>
            {price}
          </div>
          <div style={{ fontSize: "14px", color: "#8E8880", letterSpacing: "0.1em" }}>
            100% Solid Quarry Monolith • Hand-Chiseled • Global Archival Crate Shipping
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}
