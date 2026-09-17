import { v2 as cloudinary } from "cloudinary"

const cleanEnv = (val?: string) => {
  if (!val) return ""
  return val.trim().replace(/^['"]|['",]$/g, "")
}

export function getCloudinaryClient() {
  const cloudName = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME || process.env.cloud_name)
  const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY || process.env.api_key)
  const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET || process.env.api_secret)

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials missing in environment variables.")
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  })

  return cloudinary
}
