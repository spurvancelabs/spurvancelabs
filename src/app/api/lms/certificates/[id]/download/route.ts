import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const cert = await prisma.certificate.findUnique({
      where: { id },
      include: {
        course: { select: { title: true } },
        student: { select: { email: true } },
      },
    })
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (cert.studentId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const doc = await PDFDocument.create()
    const page = doc.addPage([842, 595])
    const { width, height } = page.getSize()
    const font = await doc.embedFont(StandardFonts.HelveticaBold)
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica)

    page.drawRectangle({
      x: 40, y: 40, width: width - 80, height: height - 80,
      borderColor: rgb(0.2, 0.4, 0.8), borderWidth: 3,
      color: rgb(0.99, 0.99, 0.99),
    })

    page.drawText('Certificate of Completion', {
      x: width / 2 - 150, y: height - 140, size: 28,
      font, color: rgb(0.2, 0.2, 0.2),
    })

    page.drawText('This certifies that', {
      x: width / 2 - 65, y: height - 200, size: 14,
      font: fontRegular, color: rgb(0.4, 0.4, 0.4),
    })

    page.drawText(cert.student.email || 'Student', {
      x: width / 2 - 120, y: height - 250, size: 24,
      font, color: rgb(0.1, 0.1, 0.2),
    })

    page.drawText('has successfully completed', {
      x: width / 2 - 100, y: height - 300, size: 14,
      font: fontRegular, color: rgb(0.4, 0.4, 0.4),
    })

    page.drawText(cert.course.title, {
      x: width / 2 - 140, y: height - 350, size: 22,
      font, color: rgb(0.2, 0.4, 0.8),
    })

    const dateStr = cert.createdAt instanceof Date ? cert.createdAt.toLocaleDateString() : new Date(cert.createdAt).toLocaleDateString()
    page.drawText(`Date: ${dateStr}`, {
      x: width / 2 - 60, y: height - 440, size: 12,
      font: fontRegular, color: rgb(0.5, 0.5, 0.5),
    })

    const pdfBytes = await doc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${cert.id}.pdf"`,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}
