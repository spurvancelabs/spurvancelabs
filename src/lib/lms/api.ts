import type { CourseData, ModuleData, LessonData, EnrollmentData, ProgressData, QuizData, QuestionData, QuizAttemptData, CertificateData, CategoryData, PaginatedResponse, ReviewResponse } from './types'

async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Categories ────────────────────────────────────────
export const categoryApi = {
  list: (params?: string) => fetcher<CategoryData[]>(`/api/lms/categories${params ? `?${params}` : ''}`),
  get: (id: string) => fetcher<CategoryData>(`/api/lms/categories/${id}`),
  create: (body: Partial<CategoryData>) => fetcher<CategoryData>('/api/lms/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CategoryData>) => fetcher<CategoryData>(`/api/lms/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/categories/${id}`, { method: 'DELETE' }),
}

// ─── Courses ────────────────────────────────────────────
export const courseApi = {
  list: (params?: string) => fetcher<PaginatedResponse<CourseData>>(`/api/lms/courses${params ? `?${params}` : ''}`),
  get: (id: string) => fetcher<CourseData>(`/api/lms/courses/${id}`),
  getBySlug: (slug: string) => fetcher<CourseData>(`/api/lms/courses/by-slug/${slug}`),
  create: (body: Partial<CourseData>) => fetcher<CourseData>('/api/lms/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CourseData>) => fetcher<CourseData>(`/api/lms/courses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/courses/${id}`, { method: 'DELETE' }),
}

// ─── Modules ────────────────────────────────────────────
export const moduleApi = {
  list: (courseId: string) => fetcher<ModuleData[]>(`/api/lms/modules?courseId=${courseId}`),
  get: (id: string) => fetcher<ModuleData>(`/api/lms/modules/${id}`),
  create: (body: Partial<ModuleData>) => fetcher<ModuleData>('/api/lms/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<ModuleData>) => fetcher<ModuleData>(`/api/lms/modules/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/modules/${id}`, { method: 'DELETE' }),
}

// ─── Lessons ────────────────────────────────────────────
export const lessonApi = {
  list: (moduleId: string) => fetcher<LessonData[]>(`/api/lms/lessons?moduleId=${moduleId}`),
  get: (id: string) => fetcher<LessonData>(`/api/lms/lessons/${id}`),
  create: (body: Partial<LessonData>) => fetcher<LessonData>('/api/lms/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<LessonData>) => fetcher<LessonData>(`/api/lms/lessons/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/lessons/${id}`, { method: 'DELETE' }),
}

// ─── Enrollments ────────────────────────────────────────
export const enrollmentApi = {
  list: (params?: string) => fetcher<EnrollmentData[]>(`/api/lms/enrollments${params ? `?${params}` : ''}`),
  get: (id: string) => fetcher<EnrollmentData>(`/api/lms/enrollments/${id}`),
  create: (body: { courseId: string }) => fetcher<EnrollmentData>('/api/lms/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<EnrollmentData>) => fetcher<EnrollmentData>(`/api/lms/enrollments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/enrollments/${id}`, { method: 'DELETE' }),
}

// ─── Progress ───────────────────────────────────────────
export const progressApi = {
  list: (courseId: string) => fetcher<ProgressData[]>(`/api/lms/progress?courseId=${courseId}`),
  complete: (lessonId: string) => fetcher<ProgressData>('/api/lms/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId }) }),
  updateScore: (lessonId: string, score: number) => fetcher<ProgressData>('/api/lms/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId, score }) }),
}

// ─── Quizzes ────────────────────────────────────────────
export const quizApi = {
  getByLesson: (lessonId: string) => fetcher<QuizData>(`/api/lms/quizzes?lessonId=${lessonId}`),
  get: (id: string) => fetcher<QuizData>(`/api/lms/quizzes/${id}`),
  create: (body: Partial<QuizData>) => fetcher<QuizData>('/api/lms/quizzes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<QuizData>) => fetcher<QuizData>(`/api/lms/quizzes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/quizzes/${id}`, { method: 'DELETE' }),
}

// ─── Questions ──────────────────────────────────────────
export const questionApi = {
  list: (quizId: string) => fetcher<QuestionData[]>(`/api/lms/questions?quizId=${quizId}`),
  create: (body: Partial<QuestionData>) => fetcher<QuestionData>('/api/lms/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: Partial<QuestionData>) => fetcher<QuestionData>(`/api/lms/questions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/questions/${id}`, { method: 'DELETE' }),
}

// ─── Quiz Attempts ──────────────────────────────────────
export const attemptApi = {
  start: (quizId: string) => fetcher<QuizAttemptData>('/api/lms/quiz-attempts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizId }) }),
  submit: (attemptId: string, answers: unknown[]) => fetcher<QuizAttemptData>(`/api/lms/quiz-attempts/${attemptId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) }),
  list: (quizId: string) => fetcher<QuizAttemptData[]>(`/api/lms/quiz-attempts?quizId=${quizId}`),
}

// ─── Wishlist ───────────────────────────────────────────
export const wishlistApi = {
  list: () => fetcher<any[]>('/api/lms/wishlist'),
  toggle: (courseId: string) => fetcher<{ wishlisted: boolean }>('/api/lms/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId }) }),
  remove: (id: string) => fetcher<void>(`/api/lms/wishlist/${id}`, { method: 'DELETE' }),
}

// ─── Reviews ────────────────────────────────────────────
export const reviewApi = {
  list: (courseId: string) => fetcher<ReviewResponse>(`/api/lms/reviews?courseId=${courseId}`),
  create: (body: { courseId: string; rating: number; comment?: string }) => fetcher<any>('/api/lms/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id: string, body: { rating?: number; comment?: string }) => fetcher<any>(`/api/lms/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  delete: (id: string) => fetcher<void>(`/api/lms/reviews/${id}`, { method: 'DELETE' }),
}

// ─── Certificates ───────────────────────────────────────
export const certificateApi = {
  list: () => fetcher<CertificateData[]>('/api/lms/certificates'),
  issue: (courseId: string) => fetcher<CertificateData>('/api/lms/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId }) }),
}
