import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const cert = await prisma.certificate.findUnique({
      where: { id },
      include: {
        course: { select: { title: true } },
      },
    })
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (cert.studentId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const certStudent = await prisma.user.findUnique({
      where: { id: cert.studentId },
      select: { name: true, email: true },
    })

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

    const studentName = certStudent?.name || certStudent?.email || 'Student'
    page.drawText(studentName, {
      x: width / 2 - studentName.length * 6, y: height - 250, size: 24,
      font, color: rgb(0.1, 0.1, 0.2),
    })

    page.drawText('has successfully completed', {
      x: width / 2 - 100, y: height - 300, size: 14,
      font: fontRegular, color: rgb(0.4, 0.4, 0.4),
    })

    const courseTitle = cert.course.title
    page.drawText(courseTitle, {
      x: width / 2 - courseTitle.length * 5.5, y: height - 350, size: 22,
      font, color: rgb(0.2, 0.4, 0.8),
    })

    const dateStr = cert.createdAt instanceof Date ? cert.createdAt.toLocaleDateString() : new Date(cert.createdAt).toLocaleDateString()
    page.drawText(`Date: ${dateStr}`, {
      x: width / 2 - 60, y: height - 440, size: 12,
      font: fontRegular, color: rgb(0.5, 0.5, 0.5),
    })

    const verifyUrl = `${req.nextUrl.origin}/verify/${cert.id}`
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1 })
    const qrPngBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64')
    const qrImage = await doc.embedPng(qrPngBytes)
    page.drawImage(qrImage, {
      x: width - 160, y: 70, width: 90, height: 90,
    })

    page.drawText('Verify online:', {
      x: width - 175, y: 165, size: 7,
      font: fontRegular, color: rgb(0.5, 0.5, 0.5),
    })
    page.drawText(verifyUrl, {
      x: width - 175, y: 155, size: 6,
      font: fontRegular, color: rgb(0.4, 0.4, 0.8),
    })

    page.drawText(`Code: ${cert.id}`, {
      x: 55, y: 75, size: 8,
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
