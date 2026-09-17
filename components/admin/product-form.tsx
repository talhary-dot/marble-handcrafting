"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products"
import { 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Layers, 
  DollarSign, 
  FileText, 
  Globe, 
  ArrowLeft,
  Image as ImageIcon
} from "lucide-react"
import { RichTextEditor } from "./rich-text-editor"


interface SizeVariant {
  id?: string
  sizeName: string
  dimensions: string
  weight: string
  price: number
  originalPrice?: number | null
  stock: number
  sku?: string
  images: string[]
  isDefault: boolean
}

interface ProductFormData {
  id?: string
  name: string
  slug: string
  tagline: string
  description: string
  category: string
  badge: string
  stoneType: string
  origin: string
  finish: string
  details: string
  careInstructions: string
  artisanStory: string
  shipping: string
  featuredImage: string
  gallery: string[]
  seoTitle: string
  seoDescription: string
  sizes: SizeVariant[]
}

interface ProductFormProps {
  initialData?: ProductFormData
  isEdit?: boolean
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      category: "home",
      badge: "",
      stoneType: "",
      origin: "",
      finish: "Hand-honed satin",
      details: "",
      careInstructions: "",
      artisanStory: "",
      shipping: "",
      featuredImage: "",
      gallery: [],
      seoTitle: "",
      seoDescription: "",
      sizes: [
        {
          sizeName: "Standard",
          dimensions: '12" L x 8" W x 1" H',
          weight: "4.5 lbs",
          price: 85,
          originalPrice: null,
          stock: 10,
          sku: "",
          images: [],
          isDefault: true
        }
      ]
    }
  )

  const [isSlugCustom, setIsSlugCustom] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [uploadingSizeIndex, setUploadingSizeIndex] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Calculate description words (strip HTML tags)
  const descriptionWords = formData.description
    ? formData.description.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length
    : 0
  const isOverWordLimit = descriptionWords > 2000


  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isSlugCustom ? prev.slug : slugify(name),
      seoTitle: prev.seoTitle || `${name} | Sang Tarash Marble Handicrafts`
    }))
  }

  // Upload to Cloudinary helper
  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData()
    data.append("file", file)
    const res = await fetch("/api/upload", {
      method: "POST",
      body: data
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || "Upload failed")
    }
    return json.url
  }

  // Featured image upload handler
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingFeatured(true)
      setErrorMessage(null)
      const url = await uploadFileToCloudinary(file)
      setFormData(prev => ({ ...prev, featuredImage: url }))
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Image upload to Cloudinary failed")
    } finally {
      setUploadingFeatured(false)
    }
  }

  // Size image upload handler
  const handleSizeImageUpload = async (sizeIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingSizeIndex(sizeIndex)
      setErrorMessage(null)
      const url = await uploadFileToCloudinary(file)
      setFormData(prev => {
        const updatedSizes = [...prev.sizes]
        updatedSizes[sizeIndex].images = [...updatedSizes[sizeIndex].images, url]
        return { ...prev, sizes: updatedSizes }
      })
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Size image upload failed")
    } finally {
      setUploadingSizeIndex(null)
    }
  }

  // Add new size variant
  const addSizeVariant = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          sizeName: `Variant ${prev.sizes.length + 1}`,
          dimensions: "",
          weight: "",
          price: 50,
          originalPrice: null,
          stock: 10,
          sku: "",
          images: [],
          isDefault: prev.sizes.length === 0
        }
      ]
    }))
  }

  // Remove size variant
  const removeSizeVariant = (index: number) => {
    if (formData.sizes.length <= 1) {
      alert("At least one size variant is required.")
      return
    }
    setFormData(prev => {
      const updated = prev.sizes.filter((_, i) => i !== index)
      if (prev.sizes[index].isDefault && updated.length > 0) {
        updated[0].isDefault = true
      }
      return { ...prev, sizes: updated }
    })
  }

  // Update specific size variant field
  const updateSizeField = (index: number, field: keyof SizeVariant, value: unknown) => {
    setFormData(prev => {
      const updated = [...prev.sizes]
      if (field === "isDefault" && value === true) {
        updated.forEach((s, i) => {
          s.isDefault = i === index
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(updated[index] as any)[field] = value
      }
      return { ...prev, sizes: updated }
    })
  }

  // Remove an image from a specific size
  const removeSizeImage = (sizeIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.sizes]
      updated[sizeIndex].images = updated[sizeIndex].images.filter((_, i) => i !== imageIndex)
      return { ...prev, sizes: updated }
    })
  }

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (isOverWordLimit) {
      setErrorMessage(`Description exceeds the maximum limit of 2000 words. (Currently ${descriptionWords} words)`)
      return
    }

    if (!formData.name || !formData.slug || !formData.featuredImage) {
      setErrorMessage("Please fill in the Product Name, Slug, and provide a Featured Image.")
      return
    }

    if (formData.sizes.length === 0) {
      setErrorMessage("Please configure at least one size variant with pricing.")
      return
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: formData.id || formData.slug,
          data: formData
        })
      } else {
        await createMutation.mutateAsync(formData)
      }

      setSuccessMessage(`Product "${formData.name}" successfully ${isEdit ? "updated" : "created"}!`)
      setTimeout(() => {
        router.push("/admin")
      }, 1000)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save product")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-1.5 boty-transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-serif text-3xl font-medium text-foreground">
            {isEdit ? `Edit Work: ${formData.name}` : "Sculpt a New Stone Piece"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure stone specifications, size-specific pricing, and Cloudinary galleries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-full text-xs font-medium border border-border/60 text-foreground hover:bg-card boty-transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isOverWordLimit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md boty-transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEdit ? "Save Changes" : "Publish to Atelier"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Action Required</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-xs">{successMessage}</p>
        </div>
      )}

      {/* Grid: 2 Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Core Info, Description, Sizes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: General Information */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-border/40">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="font-serif text-lg font-medium text-foreground">General Details</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Piece Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Vein Marble Tray"
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              {/* Clean SEO-friendly Slug */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    URL Slug *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSlugCustom(!isSlugCustom)}
                    className="text-[11px] text-primary hover:underline"
                  >
                    {isSlugCustom ? "Auto-generate from Title" : "Customize Slug"}
                  </button>
                </div>
                <div className="flex items-center rounded-xl border border-border/60 bg-background overflow-hidden px-3">
                  <span className="text-xs text-muted-foreground select-none">/product/</span>
                  <input
                    type="text"
                    required
                    readOnly={!isSlugCustom}
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                    className="w-full bg-transparent py-2.5 px-1 text-sm text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                >
                  <option value="home">Home & Living</option>
                  <option value="tableware">Tableware & Vessels</option>
                  <option value="sculptures">Sculptures & Totems</option>
                  <option value="decor">Stone Accents & Decor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Collection Badge
                </label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                >
                  <option value="">None</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="New">New Arrival</option>
                  <option value="Sale">Special Offer / Sale</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Sub-heading / Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Honed Carrara marble with natural bronze-grey veining"
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              {/* Description with Full-Fledged Rich Text Editor (Max 2000 Words) */}
              <div className="sm:col-span-2">
                <div className="mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Product Narrative & Description (Max 2,000 Words) *
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Full-featured editor supporting rich typography, headings, artisan blockquotes, and direct Cloudinary stone image insertion.
                  </p>
                </div>
                <RichTextEditor
                  content={formData.description}
                  onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                  maxWords={2000}
                  placeholder="Craft a lavish, poetic story of the stone object, its geological origins, artisan chiseling, tactile finish, and architectural presence..."
                />
                {isOverWordLimit && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">
                    Please trim {descriptionWords - 2000} words to comply with the 2,000-word limit.
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Multiple Sizes, Prices, and Size-Specific Images */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="font-serif text-lg font-medium text-foreground">
                  Sizes, Variant Pricing & Size-Specific Images
                </h2>
              </div>
              <button
                type="button"
                onClick={addSizeVariant}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 boty-transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Size Option</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground -mt-2">
              Each size can have its own independent price, dimensions, weight, stock, and dedicated image gallery.
            </p>

            {/* Size Variants List */}
            <div className="space-y-6">
              {formData.sizes.map((size, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border transition-all ${
                    size.isDefault
                      ? "bg-background/90 border-primary/40 shadow-sm"
                      : "bg-background/50 border-border/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm text-foreground">
                        {size.sizeName || `Size Option ${index + 1}`}
                      </span>
                      {size.isDefault && (
                        <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          Default Size
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={size.isDefault}
                          onChange={(e) => updateSizeField(index, "isDefault", e.target.checked)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span>Make Default</span>
                      </label>

                      {formData.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSizeVariant(index)}
                          className="p-1 text-muted-foreground hover:text-destructive boty-transition"
                          title="Remove size option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Size Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Size Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={size.sizeName}
                        onChange={(e) => updateSizeField(index, "sizeName", e.target.value)}
                        placeholder="e.g. Standard (14x9)"
                        className="w-full bg-card border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Dimensions *
                      </label>
                      <input
                        type="text"
                        required
                        value={size.dimensions}
                        onChange={(e) => updateSizeField(index, "dimensions", e.target.value)}
                        placeholder='14" L x 9" W'
                        className="w-full bg-card border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Weight *
                      </label>
                      <input
                        type="text"
                        required
                        value={size.weight}
                        onChange={(e) => updateSizeField(index, "weight", e.target.value)}
                        placeholder="4.8 lbs"
                        className="w-full bg-card border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Stock Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={size.stock}
                        onChange={(e) => updateSizeField(index, "stock", parseInt(e.target.value) || 0)}
                        className="w-full bg-card border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-foreground mb-1">
                        Price (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        <input
                          type="number"
                          required
                          min="1"
                          value={size.price}
                          onChange={(e) => updateSizeField(index, "price", parseInt(e.target.value) || 0)}
                          className="w-full bg-card border border-border/60 rounded-lg pl-7 pr-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Original Price ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        <input
                          type="number"
                          min="0"
                          value={size.originalPrice ?? ""}
                          onChange={(e) => updateSizeField(index, "originalPrice", e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="Optional"
                          className="w-full bg-card border border-border/60 rounded-lg pl-7 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={size.sku || ""}
                        onChange={(e) => updateSizeField(index, "sku", e.target.value)}
                        placeholder="e.g. ST-VMT-01"
                        className="w-full bg-card border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Size-Specific Image Gallery */}
                  <div className="pt-3 border-t border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                        <span>Images for this Size ({size.images.length})</span>
                      </span>

                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 boty-transition">
                        {uploadingSizeIndex === index ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3" />
                            <span>Upload Image to Cloudinary</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingSizeIndex === index}
                          onChange={(e) => handleSizeImageUpload(index, e)}
                        />
                      </label>
                    </div>

                    {/* Image thumbnails for this size */}
                    {size.images.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5 mt-2">
                        {size.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border bg-card">
                            <Image
                              src={imgUrl}
                              alt={`Size ${size.sizeName} image ${imgIdx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSizeImage(index, imgIdx)}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 boty-transition"
                              title="Delete image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">
                        No custom images attached yet. Will inherit the piece&apos;s featured image if left empty.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Stone Specifications */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-border/40">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-serif text-lg font-medium text-foreground">Stone Craft & Heritage Specs</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Stone Variety *
                </label>
                <input
                  type="text"
                  required
                  value={formData.stoneType}
                  onChange={(e) => setFormData(prev => ({ ...prev, stoneType: e.target.value }))}
                  placeholder="e.g. Italian Carrara White Marble"
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Quarry Provenance / Origin *
                </label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder="e.g. Tuscany, Italy"
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Surface Treatment & Finish *
                </label>
                <input
                  type="text"
                  required
                  value={formData.finish}
                  onChange={(e) => setFormData(prev => ({ ...prev, finish: e.target.value }))}
                  placeholder="e.g. Hand-honed satin, non-reflective matte"
                  className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Architectural Details
                </label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Hand-carved from solid marble blocks. Chamfered edges..."
                  className="w-full bg-background border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Care & Preservation Guidelines
                </label>
                <textarea
                  rows={2}
                  value={formData.careInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
                  placeholder="Wipe with soft cloth and pH-neutral cleanser. Avoid acids..."
                  className="w-full bg-background border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Artisan Provenance
                </label>
                <textarea
                  rows={2}
                  value={formData.artisanStory}
                  onChange={(e) => setFormData(prev => ({ ...prev, artisanStory: e.target.value }))}
                  placeholder="Crafted by Sang Tarash stonemasons in historic stone centers..."
                  className="w-full bg-background border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-primary boty-transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Featured Image & SEO Suite */}
        <div className="space-y-8">
          {/* Primary Featured Image (Cloudinary) */}
          <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h2 className="font-serif text-base font-medium text-foreground">Featured Stone Photo *</h2>
            </div>

            {formData.featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured Stone Piece"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                    {formData.featuredImage}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featuredImage: "" }))}
                    className="text-xs text-destructive hover:underline font-medium"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-border/70 hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer boty-transition bg-background/50 hover:bg-background">
                  {uploadingFeatured ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Loader2 className="w-7 h-7 animate-spin text-primary" />
                      <span className="text-xs text-primary font-medium">Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Click to Upload Stone Photo</span>
                      <span className="text-[11px] text-muted-foreground">PNG, JPG, WebP up to 10MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingFeatured}
                    onChange={handleFeaturedImageUpload}
                  />
                </label>

                {/* Direct URL input fallback */}
                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground block mb-1">Or paste photo URL:</span>
                  <input
                    type="text"
                    placeholder="/images/products/vein-marble-tray.jpg"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SEO & JSON-LD Suite */}
          <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="font-serif text-base font-medium text-foreground">SEO & Search Snippet</h2>
            </div>

            <p className="text-xs text-muted-foreground">
              Google JSON-LD structured schema is automatically generated for every product.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="Title for Google search results"
                  className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Rich snippet summary for search engines"
                  className="w-full bg-background border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Google SERP Preview Box */}
              <div className="p-3.5 rounded-xl bg-background border border-border/40 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">
                  Google Preview
                </span>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                  {formData.seoTitle || `${formData.name || "Product Title"} | Sang Tarash`}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-500 truncate">
                  https://sangtarash.com/product/{formData.slug || "url-slug"}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {formData.seoDescription || formData.description || "Discover handcrafted natural marble pieces by Sang Tarash..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
