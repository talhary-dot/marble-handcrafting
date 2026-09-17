import { NextRequest, NextResponse } from "next/server"
import { getCloudinaryClient } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const cloudinary = getCloudinaryClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "marble-handicrafts",
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cloudinary upload error"
    console.error("Upload error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
