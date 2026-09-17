import React from "react"
import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Admin Top Navigation */}
      <AdminNav />


      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-card border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        Sang Tarash Atelier Admin Portal • Local PGlite Postgres Engine
      </footer>
    </div>
  )
}
