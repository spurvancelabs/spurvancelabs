import { createBrowserClient } from '@/lib/supabase/client'

export type LmsUploadPurpose = 'thumbnail' | 'video' | 'avatar'

export async function uploadLmsMedia(file: File, purpose: LmsUploadPurpose, resourceId?: string) {
  const response = await fetch('/api/lms/uploads/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      purpose,
      resourceId,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.error || 'Unable to prepare the upload')
  }

  const supabase = createBrowserClient()
  const { error } = await supabase.storage
    .from(result.bucket)
    .uploadToSignedUrl(result.path, result.token, file)

  if (error) {
    throw new Error('The file could not be uploaded. Please try again.')
  }

  return { url: result.url as string, path: result.path as string, bucket: result.bucket as string }
}
