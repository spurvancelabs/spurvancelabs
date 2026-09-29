export const CERT_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
export const CERT_MAX_SIZE = 15 * 1024 * 1024
export const CERT_ID_PATTERN = /^SPR-CERT-\d+$/i

export function formatCertificateId(n: number): string {
  return `SPR-CERT-${String(n).padStart(4, '0')}`
}

export function buildDownloadUrl(url: string): string {
  const match = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw)\/upload)(\/.*)$/)
  if (!match) return url
  return `${match[1]}/fl_attachment${match[2]}`
}