import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { requireAuth, requireInstructor } from '@/lib/lms/utils'

const BUCKET = 'lms-media'
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type = body?.type as 'thumbnail' | 'video' | 'avatar' | undefined
    const contentType = String(body?.contentType || '')
    const size = Number(body?.size)

    if (!type || !['thumbnail', 'video', 'avatar'].includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }
    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Invalid file size' }, { status: 400 })
    }

    if (type === 'thumbnail' || type === 'avatar') await requireAuth()
    if (type === 'thumbnail' || type === 'video') await requireInstructor()

    const allowed = type === 'video' ? VIDEO_TYPES : IMAGE_TYPES
    const maxSize = type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (!allowed.has(contentType)) {
      return NextResponse.json({ error: type === 'video' ? 'Invalid video type' : 'Invalid image type' }, { status: 400 })
    }
    if (size > maxSize) {
      return NextResponse.json({ error: type === 'video' ? 'Video is too large. Maximum size is 100MB.' : 'Image is too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data: bucket } = await supabase.storage.getBucket(BUCKET)
    if (!bucket) {
      const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
      if (error && !/already exists/i.test(error.message)) throw error
    } else if (!bucket.public) {
      const { error } = await supabase.storage.updateBucket(BUCKET, { public: true })
      if (error) throw error
    }

    const user = await requireAuth()
    const folder = type === 'video' ? 'videos' : type === 'avatar' ? 'avatars' : 'thumbnails'
    const path = `${folder}/${user.id}/${crypto.randomUUID()}.${EXTENSIONS[contentType]}`
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: false })
    if (error || !data?.token) throw error || new Error('Failed to create upload URL')

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ bucket: BUCKET, path, token: data.token, publicUrl: publicData.publicUrl })
  } catch (error: any) {
    if (error?.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error?.message === 'Forbidden') return NextResponse.json({ error: 'You do not have permission to upload this file' }, { status: 403 })
    console.error('LMS upload preparation failed:', error)
    return NextResponse.json({ error: 'Unable to prepare upload' }, { status: 500 })
  }
}
