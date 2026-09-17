import { notFound } from "next/navigation"
import { getProductBySlugOrIdFromDb } from "@/lib/db/queries"
import { ProductForm } from "@/components/admin/product-form"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { id } = await params
  const product = await getProductBySlugOrIdFromDb(id)

  if (!product) {
    notFound()
  }

  // Format initialData for ProductForm
  const formattedData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    tagline: product.tagline || "",
    description: product.description,
    category: product.category,
    badge: product.badge || "",
    stoneType: product.stoneType,
    origin: product.origin,
    finish: product.finish,
    details: product.details || "",
    careInstructions: product.careInstructions || "",
    artisanStory: product.artisanStory || "",
    shipping: product.shipping || "",
    featuredImage: product.featuredImage,
    gallery: product.gallery ? JSON.parse(product.gallery) : [],
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    sizes: (product.sizes || []).map(s => ({
      id: s.id,
      sizeName: s.sizeName,
      dimensions: s.dimensions,
      weight: s.weight,
      price: s.price,
      originalPrice: s.originalPrice,
      stock: s.stock,
      sku: s.sku || "",
      images: s.images ? JSON.parse(s.images) : [],
      isDefault: s.isDefault
    }))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm initialData={formattedData} isEdit={true} />
    </div>
  )
}
