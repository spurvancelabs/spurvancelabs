import { supabase } from '@/lib/supabase/client'

export type LmsUploadType = 'thumbnail' | 'video' | 'avatar'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'] as const
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

export function validateLmsUpload(file: File, type: LmsUploadType): string | null {
  const allowed = type === 'video' ? VIDEO_TYPES : IMAGE_TYPES
  const maxSize = type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
  if (!allowed.includes(file.type as never)) {
    return type === 'video'
      ? 'Invalid video type. Use MP4, WebM, MOV, or AVI.'
      : 'Invalid image type. Use JPG, PNG, WebP, or GIF.'
  }
  if (file.size > maxSize) {
    return type === 'video' ? 'Video is too large. Maximum size is 100MB.' : 'Image is too large. Maximum size is 5MB.'
  }
  return null
}

export async function uploadLmsMedia(file: File, type: LmsUploadType): Promise<string> {
  const validationError = validateLmsUpload(file, type)
  if (validationError) throw new Error(validationError)

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, size: file.size, type }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Unable to prepare upload')

  const { path, token, publicUrl, bucket, signedUrl } = payload
  if (!path || !token || !publicUrl || !bucket || !signedUrl) {
    throw new Error('Upload service returned an incomplete upload target')
  }

  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, {
    contentType: file.type,
    cacheControl: '31536000',
  })
  if (error) {
    console.error('LMS media upload failed:', error)
    throw new Error(error.message || 'Upload failed')
  }

  const verifyResponse = await fetch('/api/upload/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, contentType: file.type, size: file.size, type }),
  })
  const verifyPayload = await verifyResponse.json().catch(() => ({}))
  if (!verifyResponse.ok || !verifyPayload.verified) {
    throw new Error(verifyPayload.error || 'Upload could not be verified')
  }

  return publicUrl
}
