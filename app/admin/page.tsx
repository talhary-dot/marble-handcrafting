"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Database, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Layers
} from "lucide-react"
import { useProducts, useDeleteProduct, useSeedDatabase } from "@/hooks/use-products"

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // TanStack React Query Hooks
  const { data: products = [], isLoading, isError, error } = useProducts()
  const deleteMutation = useDeleteProduct()
  const seedMutation = useSeedDatabase()

  const handleSeed = async () => {
    if (!confirm("This will seed the Sang Tarash marble database with the full artisan catalog. Continue?")) {
      return
    }
    try {
      setFeedback(null)
      await seedMutation.mutateAsync()
      setFeedback({ type: "success", text: "Database successfully seeded with 12 handcrafted stone pieces!" })
    } catch (err: unknown) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "Seeding failed" })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }
    try {
      await deleteMutation.mutateAsync(id)
      setFeedback({ type: "success", text: `Deleted "${name}" from the catalogue.` })
    } catch (err: unknown) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "Deletion failed" })
    }
  }

  const filtered = products.filter(p => {
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter
    const matchesQuery = searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.stoneType && p.stoneType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Sang Tarash Inventory</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground">
            Stone Pieces & Catalogue
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-lg">
            Manage your dynamic product catalog, custom size variants, multiple prices, and Cloudinary galleries with React Query.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seedMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-border/70 bg-background hover:border-primary/40 hover:text-primary boty-transition disabled:opacity-50"
          >
            {seedMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>Seed Initial Catalog</span>
              </>
            )}
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md boty-transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece</span>
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, stone, slug..."
            className="w-full bg-card border border-border/60 rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary boty-transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "home", "tableware", "sculptures", "decor"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap boty-transition ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-foreground/70 hover:text-foreground border border-border/50"
              }`}
            >
              {cat === "all" ? "All Pieces" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table / Cards */}
      {isLoading ? (
        <div className="text-center py-24 bg-card rounded-3xl border border-border/50">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Loading inventory via React Query...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-destructive/30 text-destructive space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <p className="text-sm font-semibold">{error instanceof Error ? error.message : "Failed to load products"}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border/50 space-y-4">
          <p className="text-base font-serif text-foreground">No pieces found matching your criteria</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {products.length === 0
              ? "Your database has no products yet. Click 'Seed Initial Catalog' above to populate 12 marble handicrafts!"
              : "Try adjusting your search query or category filter."}
          </p>
          {products.length === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-md"
            >
              Seed Initial Catalog Now
            </button>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-background/50 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="py-4 px-6">Piece</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Stone Variety</th>
                  <th className="py-4 px-6">Size Options & Pricing</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {filtered.map((product) => {
                  const prices = (product.sizes || []).map(s => s.price)
                  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
                  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
                  const priceLabel = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} – $${maxPrice}`

                  return (
                    <tr key={product.id} className="hover:bg-background/40 boty-transition">
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/60">
                            <Image
                              src={product.featuredImage || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-medium text-sm text-foreground">
                                {product.name}
                              </span>
                              {product.badge && (
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground block font-mono mt-0.5">
                              /product/{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="capitalize text-muted-foreground font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* Stone Type */}
                      <td className="py-4 px-6">
                        <span className="text-foreground font-medium">
                          {product.stoneType}
                        </span>
                      </td>

                      {/* Sizes & Price Range */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-serif text-sm font-semibold text-primary block">
                            {priceLabel}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Layers className="w-3 h-3" />
                            <span>{(product.sizes || []).length} size options</span>
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-background boty-transition"
                            title="View Live Product Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-background boty-transition"
                            title="Edit Piece"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-background boty-transition disabled:opacity-50"
                            title="Delete Piece"
                          >
                            {deleteMutation.isPending && deleteMutation.variables === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
