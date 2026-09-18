import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  category: text("category").notNull().default("home"),
  badge: text("badge"),
  stoneType: text("stone_type").notNull(),
  origin: text("origin").notNull(),
  finish: text("finish").notNull(),
  details: text("details"),
  careInstructions: text("care_instructions"),
  artisanStory: text("artisan_story"),
  shipping: text("shipping"),
  featuredImage: text("featured_image").notNull(),
  gallery: text("gallery").default("[]"), // JSON string array of URLs
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const productSizes = pgTable("product_sizes", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sizeName: text("size_name").notNull(),
  dimensions: text("dimensions").notNull(),
  weight: text("weight").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  stock: integer("stock").default(10).notNull(),
  sku: text("sku"),
  images: text("images").default("[]"), // JSON string array of URLs for this specific size
  isDefault: boolean("is_default").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull()
})

export const productsRelations = relations(products, ({ many }) => ({
  sizes: many(productSizes)
}))

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products, {
    fields: [productSizes.productId],
    references: [products.id]
  })
}))

export type DbProduct = typeof products.$inferSelect
export type NewDbProduct = typeof products.$inferInsert
export type DbProductSize = typeof productSizes.$inferSelect
export type NewDbProductSize = typeof productSizes.$inferInsert

export type ProductWithSizes = DbProduct & {
  sizes: DbProductSize[]
}

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  deliveryMethod: text("delivery_method").notNull().default("insured_crate"),
  paymentMethod: text("payment_method").notNull().default("whatsapp"),
  items: text("items").notNull(), // JSON string array of cart items
  subtotal: integer("subtotal").notNull(),
  shippingCost: integer("shipping_cost").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  customInscription: text("custom_inscription"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export type DbOrder = typeof orders.$inferSelect
export type NewDbOrder = typeof orders.$inferInsert
