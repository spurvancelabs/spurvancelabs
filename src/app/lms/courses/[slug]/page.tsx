'use client'

import { use, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import WishlistButton from '@/components/lms/WishlistButton'

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [enrolling, setEnrolling] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const { data: course, isLoading } = useQuery({
    queryKey: ['lms-course', slug],
    queryFn: () => fetch(`/api/lms/courses/by-slug/${slug}`).then(r => r.json()),
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['lms-reviews', course?.id],
    queryFn: () => fetch(`/api/lms/reviews?courseId=${course.id}`).then(r => r.json()),
    enabled: !!course?.id,
  })

  const submitReview = useMutation({
    mutationFn: () => fetch('/api/lms/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: course.id, rating: reviewRating, comment: reviewComment }),
    }).then(r => { if (!r.ok) throw new Error('Failed'); return r.json() }),
    onSuccess: () => {
      toast.success('Review submitted!')
      setShowReviewForm(false)
      setReviewComment('')
      queryClient.invalidateQueries({ queryKey: ['lms-reviews'] })
    },
    onError: (e: any) => toast.error(e.message),
  })

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      const res = await fetch('/api/lms/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      toast.success('Enrolled successfully!')
      router.push(`/lms/learn/${course.id}/${course.modules?.[0]?.lessons?.[0]?.id || ''}`)
    } catch (e: any) {
      toast.error(e.message || 'Failed to enroll')
    } finally {
      setEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg">Course not found</p>
        <Link href="/lms" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">Back to courses</Link>
      </div>
    )
  }

  const totalLessons = course.modules?.reduce((a: number, m: any) => a + (m.lessons?.length || 0), 0) || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden mb-8">
        <div className="aspect-[21/9] bg-zinc-800 relative">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 to-transparent p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              {course.category && (
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">{course.category.name}</span>
              )}
              <span className="text-xs text-gray-400 bg-black/40 px-2.5 py-1 rounded-full">{course.level || 'All Levels'}</span>
              {course.isFree && <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Free</span>}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{course.title}</h1>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              {course._count?.modules || 0} modules &middot; {totalLessons} lessons
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration ? `${course.duration} min` : 'Self-paced'}
            </span>
          </div>

          {course.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{course.description}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
            <WishlistButton courseId={course.id} className="p-2.5 text-lg" />
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-6">Course Curriculum</h2>
        <div className="space-y-4">
          {course.modules?.map((mod: any, i: number) => (
            <div key={mod.id} className="border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="bg-zinc-800/50 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-mono">Module {i + 1}</span>
                  <h3 className="text-white font-medium text-sm">{mod.title}</h3>
                </div>
                <span className="text-xs text-gray-500">{mod.lessons?.length || 0} lessons</span>
              </div>
              {mod.lessons?.length > 0 && (
                <div className="divide-y divide-white/[0.04]">
                  {mod.lessons.map((lesson: any, j: number) => (
                    <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="text-xs text-gray-600 font-mono w-6">{j + 1}.</span>
                      <span className="flex-1 text-sm text-gray-300">{lesson.title}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{lesson.type}</span>
                      {lesson.duration && <span className="text-[10px] text-gray-600">{lesson.duration}min</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Reviews
            {reviewsData?.stats && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({reviewsData.stats.avgRating.toFixed(1)} avg · {reviewsData.stats.total} reviews)
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-6 p-4 rounded-xl bg-zinc-800/40 border border-white/[0.06]">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`text-xl transition-all ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs text-gray-500 ml-2">{reviewRating}/5</span>
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about this course..."
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 min-h-[100px]"
            />
            <button
              onClick={() => submitReview.mutate()}
              disabled={submitReview.isPending}
              className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
            >
              {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        <div className="space-y-4">
          {reviewsData?.reviews?.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No reviews yet. Be the first!</p>
          )}
          {reviewsData?.reviews?.map((review: any) => (
            <div key={review.id} className="border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white font-medium">
                    {review.student.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white font-medium">{review.student.name}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
              )}
              <p className="text-[10px] text-gray-600 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
