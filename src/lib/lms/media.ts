export const LMS_MEDIA_BUCKETS = {
  thumbnail: 'lms-course-thumbnails',
  video: 'lms-lesson-videos',
  avatar: 'lms-avatars',
} as const

export type LmsUploadPurpose = keyof typeof LMS_MEDIA_BUCKETS

export const LMS_UPLOAD_RULES: Record<LmsUploadPurpose, {
  bucket: string
  maxBytes: number
  mimeTypes: readonly string[]
}> = {
  thumbnail: {
    bucket: LMS_MEDIA_BUCKETS.thumbnail,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  video: {
    bucket: LMS_MEDIA_BUCKETS.video,
    maxBytes: 500 * 1024 * 1024,
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  avatar: {
    bucket: LMS_MEDIA_BUCKETS.avatar,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
}

export function extensionForMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg': return 'jpg'
    case 'image/png': return 'png'
    case 'image/webp': return 'webp'
    case 'image/gif': return 'gif'
    case 'video/mp4': return 'mp4'
    case 'video/webm': return 'webm'
    case 'video/quicktime': return 'mov'
    default: return 'bin'
  }
}

