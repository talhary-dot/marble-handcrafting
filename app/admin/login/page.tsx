"use client"

import React, { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  Sparkles, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  ArrowLeft
} from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/admin"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check credentials.")
      }

      // Successful login -> Redirect to requested page
      router.push(from)
      router.refresh()
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-4 border border-primary/30">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">
          Sang Tarash
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mt-1">
          سنگ تراش • Atelier Admin Portal
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Authorized stonemason & catalog management console
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-3xl p-7 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative top copper glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-blur-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Atelier Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full bg-background border border-border/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Security Key / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-background border border-border/70 rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary boty-transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground boty-transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-5 rounded-xl font-medium text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 boty-transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Atelier Access...</span>
              </>
            ) : (
              <>
                <span>Enter Sang Tarash Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Stateless Cryptographic Session Protection</span>
        </div>
      </div>

      {/* Return to Store */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground boty-transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Storefront</span>
        </Link>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div className="text-center text-muted-foreground text-sm">Loading security console...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
