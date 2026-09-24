import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'
import { destroyCertificateFile } from '@/lib/certificates/cloudinary'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(ROLES.ADMIN)

    const { id } = await params

    const certificate = await prisma.internshipCertificate.findUnique({ where: { id } })
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    await destroyCertificateFile(certificate.publicId)

    await prisma.internshipCertificate.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Delete certificate error:', error)
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 })
  }
}