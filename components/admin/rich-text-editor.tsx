"use client"

import React, { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import UnderlineExtension from "@tiptap/extension-underline"
import PlaceholderExtension from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  ImagePlus,
  Globe,
  Undo,
  Redo,
  Code,
  Eye,
  Edit3,
  Code2,
  Loader2,
  AlertCircle
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string, wordCount: number) => void
  maxWords?: number
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  maxWords = 2000,
  placeholder = "Craft a lavish, poetic story of the stone object, its geological origins, artisan chiseling, tactile finish, and architectural presence..."
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "source" | "preview">("visual")
  const [rawHtml, setRawHtml] = useState(content || "")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [urlAltInput, setUrlAltInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Calculate words helper
  const countWords = (text: string): number => {
    return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        },
        codeBlock: {
          HTMLAttributes: {
            class: "rounded-xl bg-card border border-border/60 p-4 font-mono text-xs"
          }
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-t border-border/60 my-6"
          }
        }
      }),
      UnderlineExtension,
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rich-editor-img rounded-2xl border border-primary/20 shadow-md my-4 max-w-full"
        }
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium hover:opacity-80"
        }
      }),
      PlaceholderExtension.configure({
        placeholder
      })
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      const words = countWords(text)
      setRawHtml(html)
      onChange(html, words)
    }
  })

  // Synchronize when external content changes if editor is empty or updated
  useEffect(() => {
    if (editor && content !== editor.getHTML() && viewMode !== "source") {
      editor.commands.setContent(content || "", { emitUpdate: false })
      setRawHtml(content || "")
    }
  }, [content, editor, viewMode])

  // Word count stats
  const currentText = editor ? editor.getText() : rawHtml.replace(/<[^>]+>/g, " ")
  const wordCount = countWords(currentText)
  const isOverLimit = wordCount > maxWords
  const isCloseToLimit = wordCount >= maxWords * 0.9

  // Direct Image File Upload to Cloudinary
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image to Cloudinary")
      }

      if (data.url && editor) {
        editor
          .chain()
          .focus()
          .setImage({
            src: data.url,
            alt: data.originalFilename || "Sang Tarash Artisanal Stoneware"
          })
          .run()
        
        const updatedHtml = editor.getHTML()
        setRawHtml(updatedHtml)
        onChange(updatedHtml, countWords(editor.getText()))
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image")
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Insert Image from direct URL
  const handleInsertUrlImage = () => {
    if (!urlInput.trim()) return

    if (editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: urlInput.trim(),
          alt: urlAltInput.trim() || "Sang Tarash Stoneware"
        })
        .run()

      const updatedHtml = editor.getHTML()
      setRawHtml(updatedHtml)
      onChange(updatedHtml, countWords(editor.getText()))
    }

    setUrlInput("")
    setUrlAltInput("")
    setShowUrlDialog(false)
  }

  // Insert Link
  const handleSetLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter link URL (e.g. https://sangtarash.com/stone-guide):", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  // Handle Source Code Mode Changes
  const handleSourceChange = (newHtml: string) => {
    setRawHtml(newHtml)
    const text = newHtml.replace(/<[^>]+>/g, " ")
    const words = countWords(text)
    onChange(newHtml, words)
    if (editor) {
      editor.commands.setContent(newHtml, { emitUpdate: false })
    }
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm flex flex-col focus-within:border-primary/60 transition-colors">
      {/* Editor Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-muted/40 border-b border-border/50">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            title="Heading 2"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-xs font-serif font-bold transition-colors ${
              editor?.isActive("heading", { level: 2 })
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-xs font-serif font-bold transition-colors ${
              editor?.isActive("heading", { level: 3 })
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 4"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`p-1.5 rounded-lg text-xs font-serif font-bold transition-colors ${
              editor?.isActive("heading", { level: 4 })
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Heading4 className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-border/60 mx-1" />

          {/* Inline Marks */}
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("bold")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("italic")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("underline")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("strike")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-border/60 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            title="Bullet List"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("bulletList")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("orderedList")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Artisan Blockquote"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("blockquote")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Horizontal Divider"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-background/80 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-border/60 mx-1" />

          {/* Links */}
          <button
            type="button"
            title="Add Link"
            onClick={handleSetLink}
            className={`p-1.5 rounded-lg transition-colors ${
              editor?.isActive("link")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/80"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {editor?.isActive("link") && (
            <button
              type="button"
              title="Remove Link"
              onClick={() => editor?.chain().focus().unsetLink().run()}
              className="p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-background/80 transition-colors"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}

          <span className="w-px h-5 bg-border/60 mx-1" />

          {/* Cloudinary Image Uploader Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileUpload}
          />
          <button
            type="button"
            disabled={isUploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-all shadow-xs border border-primary/20"
            title="Upload Stone Imagery to Cloudinary & insert into narrative"
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </>
            )}
          </button>

          {/* Insert via URL option */}
          <button
            type="button"
            onClick={() => setShowUrlDialog(true)}
            className="p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-background/80 transition-colors"
            title="Insert Image by URL"
          >
            <Globe className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-border/60 mx-1" />

          {/* History */}
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!editor?.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
            className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!editor?.can().redo()}
            onClick={() => editor?.chain().focus().redo().run()}
            className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Right side: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-xl border border-border/50">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === "visual"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("source")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === "source"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === "preview"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center justify-between px-4 py-2 bg-destructive/10 border-b border-destructive/20 text-destructive text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Insert Image URL Modal Dialog */}
      {showUrlDialog && (
        <div className="p-3 bg-muted/20 border-b border-border/50 flex flex-wrap items-center gap-3 animate-blur-in">
          <input
            type="url"
            placeholder="Image URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 min-w-[200px] bg-background border border-border/60 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Alt text / caption (optional)"
            value={urlAltInput}
            onChange={(e) => setUrlAltInput(e.target.value)}
            className="w-48 bg-background border border-border/60 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleInsertUrlImage}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Insert Image
          </button>
          <button
            type="button"
            onClick={() => setShowUrlDialog(false)}
            className="px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Editing Canvas */}
      <div className="min-h-[280px] relative bg-background">
        {viewMode === "visual" && (
          <div className="p-4 sm:p-6">
            <EditorContent editor={editor} className="outline-none" />
          </div>
        )}

        {viewMode === "source" && (
          <textarea
            rows={12}
            value={rawHtml}
            onChange={(e) => handleSourceChange(e.target.value)}
            placeholder="<p>Enter raw HTML...</p>"
            className="w-full h-full min-h-[280px] p-4 sm:p-6 font-mono text-xs bg-background text-foreground/90 border-0 focus:outline-none resize-y"
          />
        )}

        {viewMode === "preview" && (
          <div className="p-4 sm:p-6 bg-card/40">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-4 pb-2 border-b border-border/40">
              Live Storefront Narrative Preview
            </div>
            <div
              className="product-rich-description text-foreground/90 leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: rawHtml || "<p class='text-muted-foreground italic'>No narrative written yet.</p>" }}
            />
          </div>
        )}
      </div>

      {/* Bottom Bar: Word Count & Status */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-t border-border/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Editor Mode:</span>
          <span className="font-medium text-foreground uppercase text-[10px] tracking-wider">
            {viewMode === "visual" ? "Visual WYSIWYG" : viewMode === "source" ? "Raw HTML Source" : "Storefront Preview"}
          </span>
          {isUploadingImage && (
            <span className="inline-flex items-center gap-1 text-primary font-medium text-[11px] animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Uploading stone image to Cloudinary...
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`font-semibold px-2.5 py-0.5 rounded-full text-xs transition-colors ${
              isOverLimit
                ? "bg-destructive text-destructive-foreground"
                : isCloseToLimit
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                : "bg-primary/10 text-primary"
            }`}
          >
            Words: {wordCount.toLocaleString()} / {maxWords.toLocaleString()}
          </span>
          {isOverLimit && (
            <span className="text-destructive font-medium text-[11px]">
              Exceeds {maxWords} word limit
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
