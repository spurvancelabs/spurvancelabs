import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import prisma from '@/lib/prisma'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/lms/utils'
import { extensionForMimeType, LMS_UPLOAD_RULES, type LmsUploadPurpose } from '@/lib/lms/media'
import { isAdminRole } from '@/lib/lms/roles'
import { z } from 'zod'

const requestSchema = z.object({
  purpose: z.enum(['thumbnail', 'video', 'avatar']),
  resourceId: z.string().uuid().optional().nullable(),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(100),
  size: z.number().int().positive(),
})

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = requestSchema.parse(await req.json())
    const rule = LMS_UPLOAD_RULES[body.purpose as LmsUploadPurpose]

    if (!rule.mimeTypes.includes(body.contentType)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 })
    }

    if (body.size > rule.maxBytes) {
      const maxMb = Math.round(rule.maxBytes / (1024 * 1024))
      return NextResponse.json({ error: `File is too large. The maximum size is ${maxMb}MB.` }, { status: 400 })
    }

    const user = await requireAuth()
    if (body.purpose === 'thumbnail' || body.purpose === 'video') {
      if (!user.isInstructor) return NextResponse.json({ error: 'You do not have permission to upload LMS media.' }, { status: 403 })

      if (body.purpose === 'video' && body.resourceId) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: body.resourceId },
          select: { module: { select: { course: { select: { instructorId: true } } } } },
        })
        if (!lesson) return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 })
        if (!isAdminRole(user.role) && lesson.module.course.instructorId !== user.id) {
          return NextResponse.json({ error: 'You do not have permission to upload for this lesson.' }, { status: 403 })
        }
      }

      if (body.purpose === 'thumbnail' && body.resourceId) {
        const course = await prisma.course.findUnique({ where: { id: body.resourceId }, select: { instructorId: true } })
        if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
        if (!isAdminRole(user.role) && course.instructorId !== user.id) {
          return NextResponse.json({ error: 'You do not have permission to upload for this course.' }, { status: 403 })
        }
      }
    }

    const extension = extensionForMimeType(body.contentType)
    const id = randomUUID()
    let path: string
    if (body.purpose === 'avatar') {
      path = `users/${safeSegment(user.id)}/avatars/${id}.${extension}`
    } else if (body.purpose === 'thumbnail') {
      path = body.resourceId
        ? `courses/${safeSegment(body.resourceId)}/thumbnail/${id}.${extension}`
        : `users/${safeSegment(user.id)}/course-thumbnails/${id}.${extension}`
    } else {
      path = body.resourceId
        ? `lessons/${safeSegment(body.resourceId)}/videos/${id}.${extension}`
        : `users/${safeSegment(user.id)}/lesson-videos/${id}.${extension}`
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase.storage.from(rule.bucket).createSignedUploadUrl(path)
    if (error || !data?.token) {
      console.error('Failed to create LMS signed upload URL', error)
      return NextResponse.json({ error: 'Unable to prepare the upload. Please try again.' }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from(rule.bucket).getPublicUrl(path)

    return NextResponse.json({
      bucket: rule.bucket,
      path,
      token: data.token,
      url: publicUrlData.publicUrl,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    console.error('LMS upload signing error', error)
    return NextResponse.json({ error: 'Unable to prepare the upload. Please try again.' }, { status: 500 })
  }
}
