import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { notificationService } from '@/lib/notification-service'
import { notificationRateLimiter } from '@/lib/notification-rate-limit'

export async function GET(request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (notificationRateLimiter.isRateLimited(decoded.userId)) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  notificationRateLimiter.increment(decoded.userId)

  const stream = new ReadableStream({
    async start(controller) {
      const userId = decoded.userId
      const encoder = new TextEncoder()

      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      const unsubscribe = notificationService.subscribe(userId, (data) => {
        send(data)
      })

      send({ type: 'CONNECTED' })

      request.signal.addEventListener('abort', () => {
        unsubscribe()
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}