import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    if (!code || !UUID_REGEX.test(code)) {
      return NextResponse.json({ valid: false, error: 'Certificate not found' }, { status: 404 })
    }

    const certificate = await prisma.certificate.findUnique({
      where: { id: code },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
    })

    if (!certificate) {
      return NextResponse.json({ valid: false, error: 'Certificate not found' }, { status: 404 })
    }

    const student = await prisma.user.findUnique({
      where: { id: certificate.studentId },
      select: { name: true, email: true },
    })

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        verificationCode: certificate.id,
        studentName: student?.name || 'Unknown',
        studentEmail: student?.email || '',
        courseTitle: certificate.course.title,
        courseSlug: certificate.course.slug,
        issuedAt: certificate.issuedAt,
        certificateUrl: certificate.certificateUrl,
      },
    })
  } catch (error) {
    console.error('Certificate verification error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
