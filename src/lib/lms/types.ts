export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT'
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'

export interface CourseData {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  categoryId: string | null
  level: string | null
  duration: number | null
  instructorId: string
  price: number | null
  isFree: boolean | null
  status: CourseStatus
  isComplete: boolean | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  instructor?: { id: string; name: string | null; email: string | null }
  category?: { id: string; name: string; slug: string }
  modules?: ModuleData[]
  enrollments?: EnrollmentData[]
  _count?: { modules: number; lessons: number; enrollments: number }
}

export interface ModuleData {
  id: string
  courseId: string
  title: string
  sortOrder: number
  createdAt: string
  updatedAt: string
  lessons?: LessonData[]
  _count?: { lessons: number }
}

export interface LessonData {
  id: string
  moduleId: string
  title: string
  description: string | null
  type: LessonType
  content: unknown
  videoUrl: string | null
  attachments: unknown[]
  duration: number | null
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  quizzes?: QuizData[]
  progress?: ProgressData[]
}

export interface EnrollmentData {
  id: string
  courseId: string
  studentId: string
  status: EnrollmentStatus
  progress: number
  enrolledAt: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
  course?: CourseData
  student?: { id: string; name: string | null; email: string | null }
}

export interface ProgressData {
  id: string
  studentId: string
  lessonId: string
  completed: boolean
  score: number | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface QuizData {
  id: string
  lessonId: string
  title: string
  description: string | null
  passingScore: number
  timeLimit: number | null
  maxAttempts: number
  shuffleQuestions: boolean
  showResults: boolean
  createdAt: string
  updatedAt: string
  questions?: QuestionData[]
  attempts?: QuizAttemptData[]
  _count?: { questions: number; attempts: number }
}

export interface QuestionData {
  id: string
  quizId: string
  type: QuestionType
  question: string
  options: unknown[]
  correctAnswer: unknown
  points: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface QuizAttemptData {
  id: string
  quizId: string
  studentId: string
  score: number | null
  passed: boolean | null
  answers: unknown[]
  startedAt: string
  completedAt: string | null
  createdAt: string
}

export interface CertificateData {
  id: string
  courseId: string
  studentId: string
  certificateUrl: string | null
  issuedAt: string
  createdAt: string
}

export interface CategoryData {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  _count?: { courses: number }
}

export interface ReviewData {
  id: string
  courseId: string
  rating: number
  comment: string | null
  createdAt: string
  student: { id: string; name: string }
}

export interface ReviewStats {
  avgRating: number
  total: number
}

export interface WishlistItem {
  id: string
  courseId: string
  createdAt: string
  course: CourseData
}

export interface ReviewResponse {
  reviews: ReviewData[]
  stats: ReviewStats | null
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
