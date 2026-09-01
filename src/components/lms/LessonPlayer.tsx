'use client'

export function LessonPlayer({
  videoUrl,
  poster,
  className = '',
}: {
  videoUrl: string
  poster?: string | null
  className?: string
}) {
  if (!videoUrl) return null

  return (
    <div className={`aspect-video w-full overflow-hidden rounded-xl bg-black ${className}`}>
      <video
        src={videoUrl}
        controls
        preload="metadata"
        poster={poster || undefined}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
