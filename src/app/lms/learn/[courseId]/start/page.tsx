'use client'

import { use, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function StartCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const router = useRouter()

  const { data: course } = useQuery({
    queryKey: ['lms-course-redirect', courseId],
    queryFn: () => fetch(`/api/lms/courses/${courseId}`).then(r => r.json()),
  })

  useEffect(() => {
    if (course?.modules?.[0]?.lessons?.[0]?.id) {
      router.replace(`/lms/learn/${courseId}/${course.modules[0].lessons[0].id}`)
    }
  }, [course, courseId, router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
