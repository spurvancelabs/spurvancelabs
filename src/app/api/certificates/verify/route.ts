import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { buildDownloadUrl, CERT_ID_PATTERN } from '@/lib/certificates/cloudinary'

export async function GET(req: NextRequest) {
  try {
    const rawId = req.nextUrl.searchParams.get('id')?.trim() || ''

    if (!CERT_ID_PATTERN.test(rawId)) {
      return NextResponse.json({ valid: false, error: 'The certificate ID format looks incorrect.' }, { status: 404 })
    }

    const certificate = await prisma.internshipCertificate.findFirst({
      where: { certificateId: rawId.toUpperCase() },
    })

    if (!certificate) {
      return NextResponse.json({ valid: false, error: 'No certificate found with this ID.' }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        name: certificate.name,
        email: certificate.email,
        internshipField: certificate.internshipField,
        performance: certificate.performance,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
        fileType: certificate.fileType,
        fileUrl: certificate.fileUrl,
        downloadUrl: buildDownloadUrl(certificate.fileUrl),
        issuedAt: certificate.createdAt,
      },
    })
  } catch (error) {
    console.error('Certificate verification error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed. Please try again.' }, { status: 500 })
  }
}