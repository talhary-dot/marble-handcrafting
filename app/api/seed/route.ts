import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/db/seed"

export async function POST() {
  try {
    const res = await seedDatabase()
    return NextResponse.json({ message: "Database seeded successfully", ...res })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to seed database"
    console.error("Seed error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
