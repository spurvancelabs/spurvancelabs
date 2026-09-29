import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary'
import prisma from '@/lib/prisma'
import { formatCertificateId } from './url'

export {
  CERT_MIME_TYPES,
  CERT_MAX_SIZE,
  CERT_ID_PATTERN,
  formatCertificateId,
  buildDownloadUrl,
} from './url'

export type CertificateFileType = 'image' | 'pdf'

export function getCertificateFolder(): string {
  return process.env.CLOUDINARY_Certificate_FOLDER || 'spurvanceLabs_certs'
}

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary configuration')
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
  return cloudinary
}

export function uploadCertificateFile(
  buffer: Buffer,
  mimeType: string
): Promise<{ url: string; publicId: string }> {
  const cld = configureCloudinary()
  const folder = getCertificateFolder()
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        timeout: 60_000,
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error('Certificate upload failed'))
        }
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.write(buffer)
    stream.end()
  })
}

export async function destroyCertificateFile(publicId: string): Promise<void> {
  try {
    const cld = configureCloudinary()
    await cld.uploader.destroy(publicId)
  } catch {
    // best-effort cleanup — never block the delete request on Cloudinary being unavailable
  }
}

export async function getSuggestedCertificateId(): Promise<string> {
  const rows = await prisma.$queryRaw<{ value: number }[]>`
    SELECT value FROM certificate_counters WHERE id = 1
  `
  const value = rows[0]?.value ?? 0
  return formatCertificateId(value + 1)
}

export async function advanceCertificateCounter(numSuffix: number): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO certificate_counters (id, value)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING
  `
  await prisma.$executeRaw`
    UPDATE certificate_counters SET value = GREATEST(value, ${numSuffix}) WHERE id = 1
  `
}