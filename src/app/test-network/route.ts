// app/api/test-network/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const results: any = {}

  // Test 1: DNS Resolution
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!)
    const hostname = url.hostname
    console.log('Testing DNS for:', hostname)
    results.dns = { hostname, success: true }
  } catch (error) {
    results.dns = { error: String(error) }
  }

  // Test 2: Ping the Supabase URL
  try {
    const start = Date.now()
    await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL!, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    const duration = Date.now() - start
    results.ping = { success: true, duration: `${duration}ms` }
  } catch (error) {
    results.ping = { success: false, error: String(error) }
  }

  return NextResponse.json(results)
}