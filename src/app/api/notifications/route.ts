import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { notificationService } from '@/lib/notification-service'
import { notificationRateLimiter } from '@/lib/notification-rate-limit'

const createNotificationSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR']).optional(),
  userId: z.string().optional()
})

type CreateNotificationBody = z.infer<typeof createNotificationSchema>

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const notifications = await notificationService.getByUser(decoded.userId, { limit, unreadOnly })
    const unreadCount = await notificationService.getUnreadCount(decoded.userId)

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = decoded.userId

    if (notificationRateLimiter.isRateLimited(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = (await request.json()) as CreateNotificationBody
    const { title, message, priority, type } = createNotificationSchema.parse(body)

    notificationRateLimiter.increment(userId)

    const notification = await notificationService.create(userId, {
      title,
      message,
      priority,
      type
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: z.flattenError(error).fieldErrors }, { status: 400 })
    }
    console.error('Create notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { readAll?: boolean; ids?: string[] }

    if (body.readAll) {
      await notificationService.markAllAsRead(decoded.userId)
      return NextResponse.json({ success: true })
    }

    if (body.ids && Array.isArray(body.ids)) {
      await notificationService.markAsRead(decoded.userId, body.ids)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  } catch (error) {
    console.error('Update notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { id?: string }

    if (body.id) {
      await notificationService.delete(decoded.userId, body.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
