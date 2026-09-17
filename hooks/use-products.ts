"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface ProductSize {
  id?: string
  sizeName: string
  dimensions: string
  weight: string
  price: number
  originalPrice?: number | null
  stock: number
  sku?: string
  images: string[]
  isDefault?: boolean
}

export interface ProductData {
  id: string
  slug: string
  name: string
  tagline?: string
  description: string
  category: string
  badge?: string | null
  stoneType: string
  origin: string
  finish: string
  details?: string
  careInstructions?: string
  artisanStory?: string
  shipping?: string
  featuredImage: string
  gallery?: string[]
  seoTitle?: string
  seoDescription?: string
  sizes: ProductSize[]
  createdAt?: string
  updatedAt?: string
}

// Fetch all products
export function useProducts(category?: string) {
  return useQuery<ProductData[]>({
    queryKey: ["products", category || "all"],
    queryFn: async () => {
      const url = category && category !== "all" 
        ? `/api/products?category=${encodeURIComponent(category)}` 
        : "/api/products"
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      return data.products || []
    }
  })
}

// Fetch single product by slug or id
export function useProduct(slugOrId: string) {
  return useQuery<ProductData>({
    queryKey: ["product", slugOrId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${encodeURIComponent(slugOrId)}`)
      if (!res.ok) throw new Error("Failed to fetch product")
      const data = await res.json()
      return data.product
    },
    enabled: !!slugOrId
  })
}

// Create new product
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newProduct: Partial<ProductData>) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create product")
      return data.product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}

// Update existing product
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductData> }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || "Failed to update product")
      return resData.product
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] })
    }
  })
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete product")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}

// Seed database
export function useSeedDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/seed", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to seed database")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}
