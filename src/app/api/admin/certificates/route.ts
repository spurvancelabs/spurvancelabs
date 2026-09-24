import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'
import {
  CERT_MAX_SIZE,
  CERT_MIME_TYPES,
  advanceCertificateCounter,
  destroyCertificateFile,
  getSuggestedCertificateId,
  uploadCertificateFile,
} from '@/lib/certificates/cloudinary'

const certFieldsSchema = z.object({
  certificateId: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, 'Certificate ID is required')
    .max(30)
    .regex(/^SPR-CERT-\d+$/, 'Certificate ID must look like SPR-CERT-0001'),
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().toLowerCase().email('A valid email is required').max(320),
  internshipField: z.string().trim().min(1, 'Internship field is required').max(200),
  performance: z.string().trim().min(1, 'Performance is required').max(200),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date is required'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date is required'),
})

export async function GET(req: NextRequest) {
  try {
    await requireRole(ROLES.ADMIN)

    const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { certificateId: { contains: q, mode: 'insensitive' as const } },
            { internshipField: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : undefined

    const certificates = await prisma.internshipCertificate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const nextId = await getSuggestedCertificateId()

    return NextResponse.json({ certificates, nextId })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole(ROLES.ADMIN)

    const formData = await req.formData()

    const raw = {
      certificateId: formData.get('certificateId'),
      name: formData.get('name'),
      email: formData.get('email'),
      internshipField: formData.get('internshipField'),
      performance: formData.get('performance'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    }

    const parsed = certFieldsSchema.safeParse(raw)
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message || 'Validation failed'
      return NextResponse.json({ error: first }, { status: 400 })
    }

    const certificateId = parsed.data.certificateId

    const existing = await prisma.internshipCertificate.findUnique({
      where: { certificateId },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A certificate with this ID already exists' },
        { status: 409 }
      )
    }

    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'A certificate file (image or PDF) is required' }, { status: 400 })
    }
    if (!CERT_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use JPG, PNG, WebP, or PDF.' },
        { status: 400 }
      )
    }
    if (file.size > CERT_MAX_SIZE) {
      return NextResponse.json({ error: 'File is too large. Maximum size is 15MB.' }, { status: 400 })
    }

    const startDate = new Date(parsed.data.startDate)
    const endDate = new Date(parsed.data.endDate)
    if (startDate > endDate) {
      return NextResponse.json({ error: 'Start date cannot be after end date' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let upload: { url: string; publicId: string }
    try {
      upload = await uploadCertificateFile(buffer, file.type)
    } catch (uploadError: any) {
      console.error('Cloudinary upload failed:', uploadError)
      return NextResponse.json({ error: 'Certificate file could not be uploaded' }, { status: 502 })
    }

    const fileType = file.type === 'application/pdf' ? 'pdf' : 'image'

    let certificate
    try {
      certificate = await prisma.internshipCertificate.create({
        data: {
          certificateId,
          name: parsed.data.name,
          email: parsed.data.email,
          internshipField: parsed.data.internshipField,
          performance: parsed.data.performance,
          startDate,
          endDate,
          fileUrl: upload.url,
          publicId: upload.publicId,
          fileType,
          issuedBy: admin.id,
        },
      })
    } catch (createError) {
      // avoid orphaning the just-uploaded Cloudinary asset on a DB failure (e.g. duplicate race)
      await destroyCertificateFile(upload.publicId)
      throw createError
    }

    const suffixMatch = certificateId.match(/^SPR-CERT-(\d+)$/)
    if (suffixMatch) {
      await advanceCertificateCounter(parseInt(suffixMatch[1], 10))
    }

    return NextResponse.json({ certificate }, { status: 201 })
  } catch (error: any) {
    console.error('Create certificate error:', error)
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A certificate with this ID already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}