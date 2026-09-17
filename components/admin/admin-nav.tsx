"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sparkles, Package, PlusCircle, Globe, LogOut, Loader2, ArrowLeft } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Title */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wide text-foreground block leading-tight">
                  Sang Tarash
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold block">
                  Atelier Admin
                </span>
              </div>
            </Link>

            {/* Navigation Tabs (Only visible when logged in / not on login page) */}
            {!isLoginPage && (
              <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-border/50">
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium boty-transition ${
                    pathname === "/admin"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-background/80"
                  }`}
                >
                  <Package className="w-4 h-4 text-primary" />
                  <span>Catalogue</span>
                </Link>

                <Link
                  href="/admin/products/new"
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium boty-transition ${
                    pathname === "/admin/products/new"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-background/80"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-primary" />
                  <span>New Product</span>
                </Link>
              </nav>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-background border border-border/60 text-foreground/80 hover:text-primary hover:border-primary/40 boty-transition shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Live Store</span>
            </Link>

            {!isLoginPage ? (
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground boty-transition border border-destructive/20 cursor-pointer disabled:opacity-50"
                title="Sign out of Admin Session"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground boty-transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
