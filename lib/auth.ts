/**
 * Sang Tarash Admin Portal Authentication & Session Management
 * 
 * Cryptographically signed stateless session tokens using Web Crypto API (HMAC-SHA256).
 * Zero third-party dependencies. Compatible with Next.js Edge runtime and Node.js runtime.
 * 
 * STRICT ZERO SECRETS POLICY:
 * Absolutely NO fallback secrets or fallback credentials in code.
 * All credentials and signing secrets are read strictly from process.env.
 */

export const ADMIN_COOKIE_NAME = "sang_tarash_admin_session"

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured in environment variables.")
  }
  return secret
}

function getAdminCredentials(): { username: string; password: string } {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME or ADMIN_PASSWORD is not configured in environment variables.")
  }
  return { username, password }
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) {
    base64 += "="
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export interface SessionPayload {
  username: string
  iat: number
  exp: number
}

/**
 * Signs an admin session token valid for 7 days
 */
export async function signAdminSession(username: string): Promise<string> {
  const secret = getSessionSecret()
  const key = await getCryptoKey(secret)
  const enc = new TextEncoder()

  const payload: SessionPayload = {
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  }

  const encodedPayload = toBase64Url(enc.encode(JSON.stringify(payload)))
  const signatureBytes = await crypto.subtle.sign("HMAC", key, enc.encode(encodedPayload))
  const encodedSignature = toBase64Url(new Uint8Array(signatureBytes))

  return `${encodedPayload}.${encodedSignature}`
}

/**
 * Verifies an admin session token signature and expiration
 */
export async function verifyAdminSession(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== "string") return null

    const parts = token.split(".")
    if (parts.length !== 2) return null

    const [encodedPayload, encodedSignature] = parts
    const secret = getSessionSecret()
    const key = await getCryptoKey(secret)
    const enc = new TextEncoder()

    const signatureBytes = fromBase64Url(encodedSignature)
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as any,
      enc.encode(encodedPayload)
    )

    if (!isValid) return null

    const dec = new TextDecoder()
    const payloadJson = dec.decode(fromBase64Url(encodedPayload))
    const payload = JSON.parse(payloadJson) as SessionPayload

    // Check expiration
    if (!payload.exp || Math.floor(Date.now() / 1000) > payload.exp) {
      return null
    }

    return payload
  } catch (err) {
    return null
  }
}

/**
 * Verifies incoming username and password against strictly configured environment variables
 */
export async function verifyAdminCredentials(inputUser: string, inputPass: string): Promise<boolean> {
  const { username, password } = getAdminCredentials()
  if (!inputUser || !inputPass) return false

  const enc = new TextEncoder()
  const userHash = await crypto.subtle.digest("SHA-256", enc.encode(inputUser))
  const expectedUserHash = await crypto.subtle.digest("SHA-256", enc.encode(username))

  const passHash = await crypto.subtle.digest("SHA-256", enc.encode(inputPass))
  const expectedPassHash = await crypto.subtle.digest("SHA-256", enc.encode(password))

  const userMatch = timingSafeEqual(new Uint8Array(userHash), new Uint8Array(expectedUserHash))
  const passMatch = timingSafeEqual(new Uint8Array(passHash), new Uint8Array(expectedPassHash))

  return userMatch && passMatch
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0
}
