import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { requireAuth } from '@/lib/lms/utils'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { LMS_UPLOAD_RULES, extensionForMimeType } from '@/lib/lms/media'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const formData = await req.formData()
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Legacy endpoint: keep small image/avatar uploads working while all LMS video
    // uploads use the direct-to-Storage signed upload flow.
    const purpose = formData.get('purpose') === 'avatar' ? 'avatar' : 'thumbnail'
    const rule = LMS_UPLOAD_RULES[purpose]

    if (!rule.mimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type.' }, { status: 400 })
    }
    if (file.size > rule.maxBytes) {
      return NextResponse.json({ error: 'Image is too large. The maximum size is 5MB.' }, { status: 400 })
    }

    const extension = extensionForMimeType(file.type)
    const path = purpose === 'avatar'
      ? `users/${user.id}/avatars/${randomUUID()}.${extension}`
      : `users/${user.id}/course-thumbnails/${randomUUID()}.${extension}`

    const supabase = getSupabaseAdminClient()
    const { error } = await supabase.storage.from(rule.bucket).upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error('Legacy media upload failed', error)
      return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
    }

    const { data } = supabase.storage.from(rule.bucket).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl, path, bucket: rule.bucket })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error('Upload error', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
