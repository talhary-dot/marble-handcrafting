import { NextRequest, NextResponse } from "next/server"
import { verifyAdminSession, ADMIN_COOKIE_NAME } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  const session = await verifyAdminSession(token)
  if (!session) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username
  })
}
