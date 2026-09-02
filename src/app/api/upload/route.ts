import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { requireAuth, requireInstructor } from '@/lib/lms/utils'

const IMAGE_BUCKET = 'lms-images'
const MEDIA_BUCKET = 'lms-media'
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

function getUploadConfig(type: 'thumbnail' | 'video' | 'avatar') {
  const isImage = type !== 'video'
  return {
    bucket: isImage ? IMAGE_BUCKET : MEDIA_BUCKET,
    folder: type === 'video' ? 'videos' : type === 'avatar' ? 'avatars' : 'thumbnails',
    allowed: isImage ? IMAGE_TYPES : VIDEO_TYPES,
    maxSize: isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE,
    fileSizeLimit: isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE,
  }
}

async function ensureBucket(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  type: 'thumbnail' | 'video' | 'avatar',
) {
  const config = getUploadConfig(type)
  const { data: bucket, error: getError } = await supabase.storage.getBucket(config.bucket)

  if (getError && !/not found|does not exist/i.test(getError.message)) {
    throw getError
  }

  if (!bucket) {
    const { error } = await supabase.storage.createBucket(config.bucket, {
      public: true,
      fileSizeLimit: config.fileSizeLimit,
      allowedMimeTypes: [...config.allowed],
    })
    if (error && !/already exists/i.test(error.message)) throw error
    return config.bucket
  }

  const needsPublic = !bucket.public
  // The dedicated image bucket is controlled by this application, so its
  // 5MB limit can safely be repaired if an older configuration is present.
  // Do not rewrite limits on the legacy media bucket: its existing project-
  // level/global limit may legitimately be lower than the application's 100MB
  // maximum and changing it could break existing media workflows.
  const currentLimit = bucket.file_size_limit == null ? null : Number(bucket.file_size_limit)
  const needsLimit = type !== 'video' && Number.isFinite(currentLimit) && currentLimit < config.fileSizeLimit
  const currentMimeTypes = Array.isArray(bucket.allowed_mime_types) ? bucket.allowed_mime_types.map(String) : null
  const needsMimeTypes = type !== 'video' && currentMimeTypes !== null && (
    currentMimeTypes.length !== config.allowed.size ||
    [...config.allowed].some((mimeType) => !currentMimeTypes.includes(mimeType))
  )

  if (needsPublic || needsLimit || needsMimeTypes) {
    const { error } = await supabase.storage.updateBucket(config.bucket, {
      public: true,
      ...(needsLimit ? { fileSizeLimit: config.fileSizeLimit } : {}),
      ...(needsMimeTypes ? { allowedMimeTypes: [...config.allowed] } : {}),
    })
    if (error) throw error
  }

  return config.bucket
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type = body?.type as 'thumbnail' | 'video' | 'avatar' | undefined
    const contentType = String(body?.contentType || '').toLowerCase()
    const size = Number(body?.size)

    if (!type || !['thumbnail', 'video', 'avatar'].includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }
    if (!Number.isSafeInteger(size) || size <= 0) {
      return NextResponse.json({ error: 'Invalid file size' }, { status: 400 })
    }

    const user = type === 'video' || type === 'thumbnail'
      ? await requireInstructor()
      : await requireAuth()

    const config = getUploadConfig(type)
    if (!config.allowed.has(contentType)) {
      return NextResponse.json({ error: type === 'video' ? 'Invalid video type. Use MP4, WebM, MOV, or AVI.' : 'Invalid image type. Use JPG, PNG, WebP, or GIF.' }, { status: 400 })
    }
    if (size > config.maxSize) {
      return NextResponse.json({ error: type === 'video' ? 'Video is too large. Maximum size is 100MB.' : 'Image is too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const bucket = await ensureBucket(supabase, type)
    const path = `${config.folder}/${user.id}/${crypto.randomUUID()}.${EXTENSIONS[contentType]}`

    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path, { upsert: false })
    if (error || !data?.token || !data?.signedUrl) {
      console.error('LMS signed upload URL creation failed:', error)
      throw error || new Error('Failed to create upload URL')
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path)
    return NextResponse.json({
      bucket,
      path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: publicData.publicUrl,
    })
  } catch (error: any) {
    if (error?.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error?.message === 'Forbidden') return NextResponse.json({ error: 'You do not have permission to upload this file' }, { status: 403 })
    console.error('LMS upload preparation failed:', error)
    return NextResponse.json({ error: error?.message || 'Unable to prepare upload' }, { status: 500 })
  }
}
