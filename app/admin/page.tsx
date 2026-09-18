"use client"

import { useState, useEffect } from "react"
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
  Layers,
  ShoppingBag,
  Package,
  Clock,
  Truck,
  MessageCircle,
  Filter
} from "lucide-react"
import { useProducts, useDeleteProduct, useSeedDatabase } from "@/hooks/use-products"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // TanStack React Query Hooks for Products
  const { data: products = [], isLoading, isError, error } = useProducts()
  const deleteMutation = useDeleteProduct()
  const seedMutation = useSeedDatabase()

  // Orders State
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [orderSearchQuery, setOrderSearchQuery] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // Fetch orders when orders tab is activated
  const fetchOrders = () => {
    setOrdersLoading(true)
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.orders) {
          setOrders(data.orders)
        }
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false))
  }

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
    }
  }, [activeTab])

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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus })
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        setFeedback({ type: "success", text: `Updated status for ${orderId} to ${newStatus.replace("_", " ")}.` })
      } else {
        throw new Error("Failed to update status")
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to update order status." })
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter
    const matchesQuery = searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.stoneType && p.stoneType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter
    const matchesQuery = orderSearchQuery.trim() === "" ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(orderSearchQuery.toLowerCase())
    return matchesStatus && matchesQuery
  })

  // Order Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length
  const activeProductionCount = orders.filter(o => o.status === "in_production" || o.status === "crated").length

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.25em] font-medium mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Atelier Management Suite</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground">
            Sang Tarash Master Portal
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-lg">
            Manage your dynamic product catalog, custom size variants, Cloudinary galleries, and incoming customer private acquisitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === "products" ? (
            <>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 boty-transition shadow-[0_4px_16px_rgba(158,86,50,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Carve New Piece</span>
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-border/70 bg-background hover:border-primary/40 hover:text-primary boty-transition"
            >
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Refresh Orders</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider boty-transition ${
            activeTab === "products"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider boty-transition ${
            activeTab === "orders"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Acquisitions & Orders ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border ${
            feedback.type === "success"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* ==================== TAB 1: PRODUCT CATALOG ==================== */}
      {activeTab === "products" && (
        <>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pieces by title, stone, or slug..."
                className="w-full bg-card border border-border/60 rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary boty-transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {["all", "home", "tableware", "sculptures", "decor"].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize boty-transition ${
                    categoryFilter === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="font-serif text-lg text-foreground">Loading stone pieces...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-8 rounded-3xl bg-destructive/10 border border-destructive/30 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <h3 className="font-serif text-lg font-medium text-destructive">Failed to load catalogue</h3>
              <p className="text-xs text-muted-foreground">{error?.message || "Unknown error"}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredProducts.length === 0 && (
            <div className="py-20 text-center bg-card rounded-3xl border border-border/50 space-y-4">
              <Database className="w-10 h-10 text-muted-foreground/60 mx-auto" />
              <div>
                <h3 className="font-serif text-xl text-foreground font-medium">No stone pieces found</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search query or filter" : "Seed the database or add your first handcrafted piece"}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 boty-transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Carve First Piece</span>
                </Link>
              </div>
            </div>
          )}

          {/* Products Table */}
          {!isLoading && !isError && filteredProducts.length > 0 && (
            <div className="bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase tracking-wider text-[11px]">
                      <th className="py-4 px-6 font-semibold">Piece</th>
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold">Stone Variety</th>
                      <th className="py-4 px-6 font-semibold">Sizes & Price Range</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredProducts.map(product => {
                      const prices = (product.sizes || []).map((s: any) => s.price)
                      const minPrice = prices.length ? Math.min(...prices) : 0
                      const maxPrice = prices.length ? Math.max(...prices) : 0
                      const priceLabel = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} – $${maxPrice}`

                      return (
                        <tr key={product.id} className="hover:bg-muted/20 boty-transition group">
                          {/* Image & Title */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/60">
                                <Image
                                  src={product.featuredImage || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <span className="font-serif text-sm font-medium text-foreground group-hover:text-primary boty-transition block">
                                  {product.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  /{product.slug}
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
        </>
      )}

      {/* ==================== TAB 2: ACQUISITIONS & ORDERS ==================== */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Order Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Total Acquisitions</span>
              <p className="font-serif text-2xl font-semibold text-foreground mt-1">{orders.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Gross Atelier Volume</span>
              <p className="font-serif text-2xl font-bold text-primary mt-1">${totalRevenue}</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Pending Review</span>
              <p className="font-serif text-2xl font-semibold text-amber-500 mt-1">{pendingOrdersCount}</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">In Crating / Carving</span>
              <p className="font-serif text-2xl font-semibold text-foreground mt-1">{activeProductionCount}</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order ID, patron name, or phone..."
                className="w-full bg-card border border-border/60 rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary boty-transition"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 text-xs">
              {[
                { id: "all", label: "All Orders" },
                { id: "pending", label: "Pending" },
                { id: "in_production", label: "In Production" },
                { id: "crated", label: "Crated" },
                { id: "dispatched", label: "Dispatched" },
                { id: "completed", label: "Completed" }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap boty-transition ${
                    orderStatusFilter === st.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {ordersLoading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="font-serif text-lg text-foreground">Loading acquisitions...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center bg-card rounded-3xl border border-border/50 space-y-3">
              <Package className="w-10 h-10 text-muted-foreground/60 mx-auto" />
              <h3 className="font-serif text-xl text-foreground font-medium">No acquisitions found</h3>
              <p className="text-xs text-muted-foreground">
                {orderSearchQuery || orderStatusFilter !== "all" 
                  ? "Try resetting your search or status filter." 
                  : "New orders submitted through the checkout page will appear here instantly."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const whatsappText = encodeURIComponent(
                  `Greetings ${order.customerName}. This is Sang Tarash Atelier regarding your stone acquisition order #${order.id}.`
                )
                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-3xl p-6 border border-border/60 shadow-sm space-y-4 hover:border-primary/30 boty-transition"
                  >
                    {/* Header Strip */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-semibold text-primary">
                            #{order.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-semibold text-foreground mt-0.5">
                          {order.customerName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Live Status Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Status:
                          </label>
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-background border border-border/70 rounded-lg px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                          >
                            <option value="pending">Pending Review</option>
                            <option value="in_production">In Production / Carving</option>
                            <option value="crated">Crated & Sealed</option>
                            <option value="dispatched">Dispatched Freight</option>
                            <option value="completed">Delivered & Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* WhatsApp Contact */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${whatsappText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 border border-[#25D366]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold boty-transition"
                          title="Message Client on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Patron Contact & Shipping Details */}
                    <div className="grid sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                          Patron Contacts
                        </span>
                        <p className="text-foreground mt-1">{order.customerEmail}</p>
                        <p className="text-foreground">{order.customerPhone}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                          Crated Freight Destination
                        </span>
                        <p className="text-foreground mt-1">{order.shippingAddress}</p>
                        <p className="text-foreground">{order.city}, {order.state} {order.postalCode}, {order.country}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                          Logistics & Settlement
                        </span>
                        <p className="text-foreground mt-1 capitalize">
                          Tier: {order.deliveryMethod?.replace("_", " ")}
                        </p>
                        <p className="text-foreground capitalize">
                          Method: {order.paymentMethod?.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    {/* Inscription if present */}
                    {order.customInscription && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                        <span className="text-[10px] uppercase tracking-wider text-primary font-bold block mb-0.5">
                          Dedication Inscription
                        </span>
                        <p className="font-serif italic text-foreground/90">&ldquo;{order.customInscription}&rdquo;</p>
                      </div>
                    )}

                    {/* Items Sub-table */}
                    <div className="pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                          Stone Pieces ({order.items?.length || 0})
                        </span>
                        <span className="font-serif text-sm font-bold text-foreground">
                          Total: <span className="text-primary">${order.totalAmount}</span>
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-background border border-border/40 text-xs">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground truncate">{item.name}</p>
                              <span className="text-[10px] text-muted-foreground">Qty: {item.quantity} • ${item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
