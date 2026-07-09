'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import WishlistButton from '@/components/lms/WishlistButton'

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'text-emerald-400 bg-emerald-500/10',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10',
  ADVANCED: 'text-rose-400 bg-rose-500/10',
}

const LESSON_ICONS: Record<string, string> = {
  VIDEO: '▶',
  TEXT: '📄',
  QUIZ: '❓',
  ASSIGNMENT: '📝',
}

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [enrolling, setEnrolling] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const { data: course, isLoading } = useQuery({
    queryKey: ['lms-course', slug],
    queryFn: () => fetch(`/api/lms/courses/by-slug/${slug}`).then(r => r.json()),
  })

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
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
      refetchReviews()
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
      const firstLesson = course.modules?.[0]?.lessons?.[0]?.id
      if (firstLesson) router.push(`/lms/learn/${course.id}/${firstLesson}`)
    } catch (e: any) {
      toast.error(e.message || 'Failed to enroll')
    } finally {
      setEnrolling(false)
    }
  }

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
  const avgRating = reviewsData?.stats?.avgRating || 0
  const totalReviews = reviewsData?.stats?.total || 0
  const ratingDistribution = reviewsData?.stats?.distribution || {}

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <div className="relative bg-zinc-900 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 py-8 lg:py-12">
            {/* Left: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <Link
                    href={`/lms?category=${course.category.slug}`}
                    className="text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-full transition-colors"
                  >
                    {course.category.name}
                  </Link>
                )}
                {course.level && (
                  <span className={`text-xs px-2.5 py-1 rounded-full ${LEVEL_COLORS[course.level] || 'text-gray-400 bg-white/5'}`}>
                    {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                  </span>
                )}
                {course.isFree && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Free</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {course.title}
              </h1>

              {course.description && (
                <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-base">★</span>
                  <span className="text-white font-medium">{avgRating.toFixed(1)}</span>
                  <span>({totalReviews})</span>
                </div>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {course.studentCount?.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration ? `${course.duration} min` : 'Self-paced'}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course._count?.modules || 0} modules &middot; {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Last updated {new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Instructor Mini */}
              {course.instructor && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
                    {course.instructor.image ? (
                      <img src={course.instructor.image} alt={course.instructor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-white">
                        {(course.instructor.name || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="text-sm text-white font-medium">{course.instructor.name || 'Unknown'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sticky Enroll Card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 rounded-2xl bg-zinc-800/80 border border-white/[0.08] overflow-hidden backdrop-blur-xl">
                {/* Thumbnail inside card (mobile) */}
                <div className="aspect-video bg-zinc-700 lg:hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {/* Price */}
                  <div className="text-center">
                    {course.price && !course.isFree ? (
                      <span className="text-4xl font-bold text-white">${Number(course.price).toFixed(2)}</span>
                    ) : (
                      <span className="text-3xl font-bold text-emerald-400">Free</span>
                    )}
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-base"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enrolling...
                      </span>
                    ) : 'Enroll Now'}
                  </button>

                  <WishlistButton courseId={course.id} className="w-full py-3 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl transition-all text-sm flex items-center justify-center gap-2" />

                  {/* Course Includes */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">This course includes:</h4>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {totalLessons} on-demand lessons
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course._count?.modules || 0} modules of content
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Full lifetime access
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.level ? `${course.level.charAt(0) + course.level.slice(1).toLowerCase()} level` : 'All levels'}
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Curriculum */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Course Curriculum</h2>
                <span className="text-sm text-gray-500">{course._count?.modules || 0} modules &middot; {totalLessons} lessons</span>
              </div>
              <div className="space-y-3">
                {course.modules?.map((mod: any, i: number) => {
                  const isExpanded = expandedModules.has(mod.id) || expandedModules.size === 0
                  return (
                    <div key={mod.id} className="border border-white/[0.06] rounded-xl overflow-hidden bg-zinc-900/40">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-gray-500 font-mono flex-shrink-0">Module {i + 1}</span>
                          <h3 className="text-white font-medium text-sm truncate">{mod.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-gray-500">{mod.lessons?.length || 0} lessons</span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {isExpanded && mod.lessons?.length > 0 && (
                        <div className="divide-y divide-white/[0.04] border-t border-white/[0.06]">
                          {mod.lessons.map((lesson: any, j: number) => (
                            <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                              <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-gray-500 font-mono flex-shrink-0">
                                {LESSON_ICONS[lesson.type] || '•'}
                              </span>
                              <span className="flex-1 text-sm text-gray-300 truncate">{lesson.title}</span>
                              {lesson.type && (
                                <span className="text-[10px] text-gray-600 uppercase tracking-wider">{lesson.type}</span>
                              )}
                              {lesson.duration && (
                                <span className="text-[10px] text-gray-600 flex-shrink-0">{lesson.duration}min</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                {(!course.modules || course.modules.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-8">No curriculum available yet.</p>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Reviews</h2>
                  {totalReviews > 0 && (
                    <p className="text-sm text-gray-500 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Rating Summary + Distribution */}
              {totalReviews > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
                  <div className="text-center flex-shrink-0">
                    <div className="text-5xl font-bold text-white">{avgRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center gap-0.5 mt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-lg ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Course Rating</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star] || 0
                      const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400 w-3 text-right">{star}</span>
                          <span className="text-yellow-400 text-xs">★</span>
                          <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full rounded-full bg-yellow-400/70 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-gray-500 text-xs w-8 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-5 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-all ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'}`}
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
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => submitReview.mutate()}
                      disabled={submitReview.isPending}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
                    >
                      {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-4">
                {reviewsData?.reviews?.length === 0 && !showReviewForm && (
                  <div className="text-center py-12 border border-dashed border-white/[0.06] rounded-xl">
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
                {reviewsData?.reviews?.map((review: any) => (
                  <div key={review.id} className="border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
                          {review.student?.image ? (
                            <img src={review.student.image} alt={review.student.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-white">
                              {(review.student?.name || '?')[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{review.student?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Instructor Card */}
            {course.instructor && (
              <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.06] p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Instructor</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
                    {course.instructor.image ? (
                      <img src={course.instructor.image} alt={course.instructor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-white">
                        {(course.instructor.name || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">{course.instructor.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">Course Creator</p>
                  </div>
                </div>
              </section>
            )}

            {/* Description (sidebar on desktop) */}
            {course.description && (
              <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.06] p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{course.description}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
