import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { requireAuth, requireInstructor } from '@/lib/lms/utils'

const IMAGE_BUCKET = 'lms-images'
const MEDIA_BUCKET = 'lms-media'
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

function getConfig(type: 'thumbnail' | 'video' | 'avatar') {
  const isImage = type !== 'video'
  return {
    bucket: isImage ? IMAGE_BUCKET : MEDIA_BUCKET,
    folder: type === 'video' ? 'videos' : type === 'avatar' ? 'avatars' : 'thumbnails',
    allowed: isImage ? IMAGE_TYPES : VIDEO_TYPES,
    maxSize: isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type = body?.type as 'thumbnail' | 'video' | 'avatar' | undefined
    const path = String(body?.path || '')
    const contentType = String(body?.contentType || '').toLowerCase()
    const expectedSize = Number(body?.size)

    if (!type || !['thumbnail', 'video', 'avatar'].includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }
    if (!path || !Number.isSafeInteger(expectedSize) || expectedSize <= 0) {
      return NextResponse.json({ error: 'Invalid upload verification request' }, { status: 400 })
    }

    const user = type === 'video' || type === 'thumbnail'
      ? await requireInstructor()
      : await requireAuth()
    const config = getConfig(type)

    const expectedPrefix = `${config.folder}/${user.id}/`
    if (!path.startsWith(expectedPrefix) || path.includes('..') || path.includes('//')) {
      return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 })
    }
    if (!config.allowed.has(contentType) || expectedSize > config.maxSize) {
      return NextResponse.json({ error: 'Upload does not match the allowed file constraints' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const storage = supabase.storage.from(config.bucket)
    let info: any = null
    let lastError: any = null

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await storage.info(path)
      if (!result.error && result.data) {
        info = result.data
        break
      }
      lastError = result.error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)))
    }

    if (!info) {
      console.error('LMS upload verification failed:', lastError)
      return NextResponse.json({ error: 'Upload completed but could not be verified. Please try again.' }, { status: 502 })
    }

    const actualSize = Number(info.size ?? info.metadata?.size)
    const actualContentType = String(info.contentType ?? info.metadata?.mimetype ?? '').toLowerCase()
    if (!Number.isFinite(actualSize) || actualSize !== expectedSize || (actualContentType && actualContentType !== contentType)) {
      await storage.remove([path]).catch(() => undefined)
      return NextResponse.json({ error: 'Uploaded file failed verification. Please try again.' }, { status: 422 })
    }

    return NextResponse.json({ verified: true, path })
  } catch (error: any) {
    if (error?.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error?.message === 'Forbidden') return NextResponse.json({ error: 'You do not have permission to upload this file' }, { status: 403 })
    console.error('LMS upload verification failed:', error)
    return NextResponse.json({ error: 'Unable to verify upload' }, { status: 500 })
  }
}
