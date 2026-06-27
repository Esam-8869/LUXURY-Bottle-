import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  // In a real implementation, you would convert the File to a stream/buffer
  // and use cloudinary.uploader.upload_stream
  // For simplicity in this demo, returning a mock if config is missing
  if (!process.env.CLOUDINARY_API_KEY) {
    console.warn('[Dev] Cloudinary not configured, returning mock URL')
    return {
      url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      publicId: 'mock_id',
    }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'))
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        }
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_API_KEY) return
  await cloudinary.uploader.destroy(publicId)
}
