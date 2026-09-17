import { db, ensureDbInitialized } from "./index"
import { products, productSizes, type ProductWithSizes, type DbProduct, type DbProductSize } from "./schema"
import { eq, desc, or } from "drizzle-orm"

export async function getProductsFromDb(category?: string): Promise<ProductWithSizes[]> {
  await ensureDbInitialized()

  const allProducts = await db.query.products.findMany({
    where: category && category !== "all" ? eq(products.category, category) : undefined,
    orderBy: [desc(products.createdAt)],
    with: {
      sizes: {
        orderBy: [productSizes.sortOrder]
      }
    }
  })

  return allProducts as ProductWithSizes[]
}

export async function getProductBySlugOrIdFromDb(slugOrId: string): Promise<ProductWithSizes | null> {
  await ensureDbInitialized()

  const found = await db.query.products.findFirst({
    where: or(eq(products.slug, slugOrId), eq(products.id, slugOrId)),
    with: {
      sizes: {
        orderBy: [productSizes.sortOrder]
      }
    }
  })

  return (found as ProductWithSizes) || null
}

export async function createProductInDb(
  productData: Omit<typeof products.$inferInsert, "createdAt" | "updatedAt">,
  sizesData: Array<Omit<typeof productSizes.$inferInsert, "productId">>
) {
  await ensureDbInitialized()

  await db.insert(products).values({
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  for (let i = 0; i < sizesData.length; i++) {
    const s = sizesData[i]
    await db.insert(productSizes).values({
      ...s,
      productId: productData.id,
      sortOrder: s.sortOrder ?? i
    })
  }

  return getProductBySlugOrIdFromDb(productData.id)
}

export async function updateProductInDb(
  id: string,
  productData: Partial<typeof products.$inferInsert>,
  sizesData?: Array<Omit<typeof productSizes.$inferInsert, "productId">>
) {
  await ensureDbInitialized()

  await db.update(products).set({
    ...productData,
    updatedAt: new Date()
  }).where(eq(products.id, id))

  if (sizesData && sizesData.length > 0) {
    await db.delete(productSizes).where(eq(productSizes.productId, id))
    for (let i = 0; i < sizesData.length; i++) {
      const s = sizesData[i]
      await db.insert(productSizes).values({
        ...s,
        productId: id,
        sortOrder: s.sortOrder ?? i
      })
    }
  }

  return getProductBySlugOrIdFromDb(id)
}

export async function deleteProductFromDb(id: string) {
  await ensureDbInitialized()
  await db.delete(products).where(eq(products.id, id))
  return { success: true }
}
