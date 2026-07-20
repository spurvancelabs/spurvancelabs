import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient, TicketStatus, TicketPriority, TicketType, SprintStatus, ProjectRole } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const USERS = [
  { email: 'admin@spurvance.com', password: 'Admin@123', name: 'Rahul Sharma' },
  { email: 'sarah@spurvance.com', password: 'Sarah@123', name: 'Sarah Khan' },
  { email: 'dev@spurvance.com', password: 'Dev@12345', name: 'Amit Patel' },
  { email: 'client@spurvance.com', password: 'Client@123', name: 'Priya Mehta' },
  { email: 'viewer@spurvance.com', password: 'Viewer@123', name: 'Vikram Singh' },
]

async function seed() {
  console.log('Seeding users via Supabase Auth...')

  const userIds: string[] = []

  for (const u of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name, type: 'USER' },
    })
    if (error && error.message.includes('already registered')) {
      console.log(`  ${u.email} already exists, fetching ID...`)
      const { data: existing } = await supabase.auth.admin.listUsers()
      const found = existing?.users?.find(usr => usr.email === u.email)
      if (found) userIds.push(found.id)
      continue
    }
    if (error) {
      console.error(`  Failed to create ${u.email}:`, error.message)
      continue
    }
    console.log(`  Created ${u.email} -> ${data.user.id}`)
    userIds.push(data.user.id)
  }

  console.log(`\n${userIds.length} users ready.`)

  const [ownerId, managerId, devId, clientId, viewerId] = userIds

  console.log('\nSeeding projects...')

  const project1 = await prisma.project.create({
    data: {
      name: 'Spurvance LMS Platform',
      key: 'LMS',
      description: 'Learning Management System with courses, certifications, and student tracking.',
      color: '#6366f1',
      status: 'ACTIVE',
      ownerId,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-09-30'),
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Client Portal Redesign',
      key: 'CPR',
      description: 'Redesign the client-facing portal with modern UI/UX and improved workflows.',
      color: '#22c55e',
      status: 'ACTIVE',
      ownerId,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-08-31'),
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Mobile App v2',
      key: 'MOB',
      description: 'Native mobile app rebuild with React Native and offline support.',
      color: '#f59e0b',
      status: 'ACTIVE',
      ownerId,
    },
  })

  console.log(`  Created ${project1.name}, ${project2.name}, ${project3.name}`)

  console.log('\nSeeding members...')

  const allMembers = [
    { projectId: project1.id, userId: ownerId, role: 'PROJECT_OWNER' as ProjectRole },
    { projectId: project1.id, userId: managerId, role: 'PROJECT_MANAGER' as ProjectRole },
    { projectId: project1.id, userId: devId, role: 'DEVELOPER' as ProjectRole },
    { projectId: project1.id, userId: clientId, role: 'CLIENT' as ProjectRole },
    { projectId: project1.id, userId: viewerId, role: 'VIEWER' as ProjectRole },
    { projectId: project2.id, userId: ownerId, role: 'PROJECT_OWNER' as ProjectRole },
    { projectId: project2.id, userId: devId, role: 'DEVELOPER' as ProjectRole },
    { projectId: project2.id, userId: managerId, role: 'PROJECT_MANAGER' as ProjectRole },
    { projectId: project3.id, userId: ownerId, role: 'PROJECT_OWNER' as ProjectRole },
    { projectId: project3.id, userId: devId, role: 'DEVELOPER' as ProjectRole },
  ]

  await prisma.projectMember.createMany({ data: allMembers })
  console.log(`  Created ${allMembers.length} member assignments`)

  console.log('\nSeeding labels...')
  const labels = [
    { projectId: project1.id, name: 'Frontend', color: '#3b82f6' },
    { projectId: project1.id, name: 'Backend', color: '#8b5cf6' },
    { projectId: project1.id, name: 'Database', color: '#ef4444' },
    { projectId: project1.id, name: 'DevOps', color: '#f59e0b' },
    { projectId: project1.id, name: 'UI/UX', color: '#ec4899' },
    { projectId: project2.id, name: 'Design', color: '#ec4899' },
    { projectId: project2.id, name: 'API', color: '#8b5cf6' },
    { projectId: project3.id, name: 'iOS', color: '#06b6d4' },
    { projectId: project3.id, name: 'Android', color: '#22c55e' },
  ]
  await prisma.label.createMany({ data: labels })

  console.log('\nSeeding sprints for Project 1...')

  const sprint1 = await prisma.sprint.create({
    data: {
      projectId: project1.id,
      name: 'Sprint 1 - Foundation',
      goal: 'Set up core auth, course CRUD, and dashboard layout',
      status: 'COMPLETED',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-14'),
    },
  })

  const sprint2 = await prisma.sprint.create({
    data: {
      projectId: project1.id,
      name: 'Sprint 2 - Course Builder',
      goal: 'Build the course editor, module/lesson system, and file uploads',
      status: 'ACTIVE',
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-06-28'),
    },
  })

  const sprint3 = await prisma.sprint.create({
    data: {
      projectId: project1.id,
      name: 'Sprint 3 - Student Experience',
      goal: 'Enrollment flow, progress tracking, certificates, and notifications',
      status: 'PLANNING',
    },
  })

  const sprint4 = await prisma.sprint.create({
    data: {
      projectId: project2.id,
      name: 'Sprint 1 - Discovery',
      goal: 'Wireframes, component library setup, and design tokens',
      status: 'ACTIVE',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-14'),
    },
  })

  console.log(`  Created 4 sprints`)

  console.log('\nSeeding tickets...')

  const ticketData = [
    // Sprint 1 (completed) - 6 tickets
    { projectId: project1.id, key: 'LMS-1', title: 'Set up Supabase auth with JWT tokens', description: 'Configure Supabase auth provider, implement login/signup/reset-password flows with JWT access and refresh tokens.', status: 'DONE' as TicketStatus, priority: 'HIGHEST' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint1.id, storyPoints: 8, order: 1, estimatedHours: 12, labels: ['Backend'] },
    { projectId: project1.id, key: 'LMS-2', title: 'Design login/signup page mockups', description: 'Create Figma designs for authentication pages including social login, forgot password, and email verification.', status: 'DONE' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'STORY' as TicketType, assigneeId: managerId, reporterId: ownerId, sprintId: sprint1.id, storyPoints: 3, order: 2, estimatedHours: 6, labels: ['UI/UX'] },
    { projectId: project1.id, key: 'LMS-3', title: 'Create Prisma schema for courses and modules', description: 'Define database models for courses, modules, lessons, enrollments, progress, quizzes, and certificates.', status: 'DONE' as TicketStatus, priority: 'HIGHEST' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint1.id, storyPoints: 5, order: 3, estimatedHours: 8, labels: ['Database', 'Backend'] },
    { projectId: project1.id, key: 'LMS-4', title: 'Dashboard layout with sidebar navigation', description: 'Build the main dashboard shell with responsive sidebar, header, and content area using Tailwind CSS.', status: 'DONE' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: managerId, sprintId: sprint1.id, storyPoints: 5, order: 4, estimatedHours: 8, labels: ['Frontend'] },
    { projectId: project1.id, key: 'LMS-5', title: 'Fix: Social login callback URL mismatch', description: 'Google OAuth redirect URI does not match the configured callback URL in production. Users get a 400 error after Google login.', status: 'DONE' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'BUG' as TicketType, assigneeId: devId, reporterId: clientId, sprintId: sprint1.id, storyPoints: 2, order: 5, estimatedHours: 2, labels: ['Backend'] },
    { projectId: project1.id, key: 'LMS-6', title: 'Set up CI/CD pipeline with Vercel', description: 'Configure automatic deployments, preview branches, and environment variable management.', status: 'DONE' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint1.id, storyPoints: 3, order: 6, estimatedHours: 4, labels: ['DevOps'] },

    // Sprint 2 (active) - 8 tickets
    { projectId: project1.id, key: 'LMS-7', title: 'Build course editor with drag-and-drop modules', description: 'Create a rich course editor that supports reordering modules and lessons via drag-and-drop, inline editing, and media uploads.', status: 'IN_PROGRESS' as TicketStatus, priority: 'HIGHEST' as TicketPriority, type: 'STORY' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint2.id, storyPoints: 13, order: 7, estimatedHours: 24, labels: ['Frontend', 'Backend'] },
    { projectId: project1.id, key: 'LMS-8', title: 'File upload service with Supabase Storage', description: 'Implement file upload for course thumbnails, lesson videos, and documents. Support chunked uploads for large files.', status: 'IN_PROGRESS' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: managerId, sprintId: sprint2.id, storyPoints: 8, order: 8, estimatedHours: 16, labels: ['Backend'] },
    { projectId: project1.id, key: 'LMS-9', title: 'Quiz builder with question types', description: 'Build quiz creation UI supporting multiple choice, true/false, short answer, and code execution question types.', status: 'TODO' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'STORY' as TicketType, assigneeId: devId, reporterId: managerId, sprintId: sprint2.id, storyPoints: 8, order: 9, estimatedHours: 20, labels: ['Frontend', 'Backend'] },
    { projectId: project1.id, key: 'LMS-10', title: 'Rich text editor for lesson content', description: 'Integrate a rich text editor (Tiptap/Plate) for writing lesson content with code blocks, images, and tables.', status: 'TODO' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'STORY' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint2.id, storyPoints: 5, order: 10, estimatedHours: 12, labels: ['Frontend'] },
    { projectId: project1.id, key: 'LMS-11', title: 'Fix: Image upload fails for files > 5MB', description: 'Large image uploads silently fail. Need to implement chunked upload or compression for files over 5MB.', status: 'TODO' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'BUG' as TicketType, assigneeId: devId, reporterId: clientId, sprintId: sprint2.id, storyPoints: 3, order: 11, estimatedHours: 4, labels: ['Frontend', 'Backend'] },
    { projectId: project1.id, key: 'LMS-12', title: 'Course pricing and Stripe integration', description: 'Add support for paid courses with Stripe Checkout, webhook handling for payment confirmation, and refund flow.', status: 'BACKLOG' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'STORY' as TicketType, reporterId: ownerId, sprintId: sprint2.id, storyPoints: 13, order: 12, estimatedHours: 30, labels: ['Backend'] },
    { projectId: project1.id, key: 'LMS-13', title: 'Implement course preview and SEO metadata', description: 'Public course preview page with Open Graph tags, structured data, and dynamic meta descriptions.', status: 'BACKLOG' as TicketStatus, priority: 'LOW' as TicketPriority, type: 'TASK' as TicketType, reporterId: managerId, sprintId: sprint2.id, storyPoints: 3, order: 13, estimatedHours: 6, labels: ['Frontend'] },
    { projectId: project1.id, key: 'LMS-14', title: 'API rate limiting and request validation', description: 'Implement rate limiting on all API endpoints, add request schema validation with Zod, and proper error responses.', status: 'TODO' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint2.id, storyPoints: 5, order: 14, estimatedHours: 8, labels: ['Backend'] },

    // Sprint 3 (planning) - 5 tickets
    { projectId: project1.id, key: 'LMS-15', title: 'Student enrollment and checkout flow', description: 'End-to-end enrollment with cart, coupon codes, checkout, and enrollment confirmation email.', status: 'BACKLOG' as TicketStatus, priority: 'HIGHEST' as TicketPriority, type: 'STORY' as TicketType, reporterId: ownerId, sprintId: sprint3.id, storyPoints: 13, order: 15, estimatedHours: 24, labels: ['Frontend', 'Backend'] },
    { projectId: project1.id, key: 'LMS-16', title: 'Progress tracking and analytics dashboard', description: 'Track student progress per lesson/module, display charts on student and instructor dashboards.', status: 'BACKLOG' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'STORY' as TicketType, reporterId: managerId, sprintId: sprint3.id, storyPoints: 8, order: 16, estimatedHours: 16, labels: ['Frontend', 'Backend'] },
    { projectId: project1.id, key: 'LMS-17', title: 'Certificate generation and download', description: 'Auto-generate PDF certificates on course completion with student name, course title, and completion date.', status: 'BACKLOG' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'STORY' as TicketType, reporterId: managerId, sprintId: sprint3.id, storyPoints: 5, order: 17, estimatedHours: 10, labels: ['Backend'] },
    { projectId: project1.id, key: 'LMS-18', title: 'Push notification system', description: 'Implement web push notifications for enrollment confirmations, new lessons, assignment deadlines, and announcements.', status: 'BACKLOG' as TicketStatus, priority: 'LOW' as TicketPriority, type: 'STORY' as TicketType, reporterId: ownerId, sprintId: sprint3.id, storyPoints: 5, order: 18, estimatedHours: 12, labels: ['Backend'] },
    { projectId: project1.id, key: 'LMS-19', title: 'Performance audit and optimization', description: 'Lighthouse audit, code splitting, image optimization, and database query performance tuning.', status: 'BACKLOG' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'TASK' as TicketType, reporterId: ownerId, sprintId: sprint3.id, storyPoints: 5, order: 19, estimatedHours: 12, labels: ['Frontend', 'DevOps'] },

    // Backlog (no sprint) - 3 tickets
    { projectId: project1.id, key: 'LMS-20', title: 'Mobile responsive design pass', description: 'Audit all pages for mobile responsiveness, fix layout issues, and optimize touch interactions.', status: 'BACKLOG' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'TASK' as TicketType, reporterId: managerId, order: 20, estimatedHours: 16, labels: ['Frontend', 'UI/UX'] },
    { projectId: project1.id, key: 'LMS-21', title: 'Accessibility audit (WCAG 2.1 AA)', description: 'Full accessibility audit, fix color contrast, keyboard navigation, screen reader support, and ARIA labels.', status: 'BACKLOG' as TicketStatus, priority: 'LOW' as TicketPriority, type: 'TASK' as TicketType, reporterId: ownerId, order: 21, estimatedHours: 20, labels: ['Frontend'] },
    { projectId: project1.id, key: 'LMS-22', title: 'Multi-language support (i18n)', description: 'Add internationalization support for English, Hindi, and Urdu with RTL layout support.', status: 'BACKLOG' as TicketStatus, priority: 'LOW' as TicketPriority, type: 'STORY' as TicketType, reporterId: clientId, order: 22, estimatedHours: 40, labels: ['Frontend'] },

    // Project 2 tickets
    { projectId: project2.id, key: 'CPR-1', title: 'Create design system component library', description: 'Build reusable React components: buttons, inputs, modals, cards, tables following the new brand guidelines.', status: 'IN_PROGRESS' as TicketStatus, priority: 'HIGHEST' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: ownerId, sprintId: sprint4.id, storyPoints: 8, order: 1, estimatedHours: 16, labels: ['Design', 'Frontend'] },
    { projectId: project2.id, key: 'CPR-2', title: 'Client dashboard wireframes', description: 'Design wireframes for the new client dashboard with project overview, invoices, and support tickets.', status: 'IN_PROGRESS' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'STORY' as TicketType, assigneeId: managerId, reporterId: ownerId, sprintId: sprint4.id, storyPoints: 5, order: 2, estimatedHours: 10, labels: ['Design'] },
    { projectId: project2.id, key: 'CPR-3', title: 'Set up Storybook for component docs', description: 'Configure Storybook with auto-documentation, visual testing, and deployment to Vercel.', status: 'TODO' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: managerId, sprintId: sprint4.id, storyPoints: 3, order: 3, estimatedHours: 6, labels: ['Frontend', 'DevOps'] },
    { projectId: project2.id, key: 'CPR-4', title: 'Migrate existing pages to new layout', description: 'Refactor existing portal pages to use the new design system components and layout structure.', status: 'BACKLOG' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'TASK' as TicketType, reporterId: ownerId, sprintId: sprint4.id, storyPoints: 8, order: 4, estimatedHours: 20, labels: ['Frontend'] },
    { projectId: project2.id, key: 'CPR-5', title: 'Dark mode support', description: 'Implement dark/light theme toggle with CSS variables and Tailwind dark mode classes.', status: 'BACKLOG' as TicketStatus, priority: 'LOW' as TicketPriority, type: 'STORY' as TicketType, reporterId: managerId, order: 5, estimatedHours: 8, labels: ['Frontend', 'Design'] },

    // Project 3 tickets
    { projectId: project3.id, key: 'MOB-1', title: 'Set up React Native project with Expo', description: 'Initialize React Native project with Expo, configure navigation, theming, and API client.', status: 'IN_PROGRESS' as TicketStatus, priority: 'HIGHEST' as TicketPriority, type: 'TASK' as TicketType, assigneeId: devId, reporterId: ownerId, storyPoints: 5, order: 1, estimatedHours: 8, labels: ['iOS', 'Android'] },
    { projectId: project3.id, key: 'MOB-2', title: 'Implement offline data sync', description: 'Build offline-first architecture with local SQLite storage and background sync when online.', status: 'TODO' as TicketStatus, priority: 'HIGH' as TicketPriority, type: 'STORY' as TicketType, assigneeId: devId, reporterId: ownerId, storyPoints: 13, order: 2, estimatedHours: 30, labels: ['iOS', 'Android'] },
    { projectId: project3.id, key: 'MOB-3', title: 'Push notification integration', description: 'Integrate Firebase Cloud Messaging for push notifications on both iOS and Android.', status: 'BACKLOG' as TicketStatus, priority: 'MEDIUM' as TicketPriority, type: 'TASK' as TicketType, reporterId: ownerId, order: 3, estimatedHours: 12, labels: ['iOS', 'Android'] },
  ]

  const tickets = []
  for (const t of ticketData) {
    const ticket = await prisma.ticket.create({
      data: {
        projectId: t.projectId,
        key: t.key,
        title: t.title,
        description: t.description || null,
        status: t.status,
        priority: t.priority,
        type: t.type,
        assigneeId: t.assigneeId || null,
        reporterId: t.reporterId,
        sprintId: t.sprintId || null,
        storyPoints: t.storyPoints || null,
        order: t.order,
        estimatedHours: t.estimatedHours || null,
        labels: t.labels || [],
      },
    })
    tickets.push(ticket)
  }
  console.log(`  Created ${tickets.length} tickets`)

  console.log('\nSeeding comments...')

  const commentData = [
    { ticketId: tickets[0].id, userId: ownerId, content: 'Great work on the auth setup! Make sure we handle token refresh seamlessly.' },
    { ticketId: tickets[0].id, userId: devId, content: 'Token refresh is already implemented with the 7-day refresh token. Access tokens auto-renew on each API call.' },
    { ticketId: tickets[4].id, userId: managerId, content: 'This was blocking production login for 3 users. Nice quick fix!' },
    { ticketId: tickets[6].id, userId: ownerId, content: 'This is the highest priority item for Sprint 2. We need the course editor ready by end of next week.' },
    { ticketId: tickets[6].id, userId: devId, content: 'I\'ve started with the drag-and-drop module reordering. Using @dnd-kit for the sortable list. ETA is Thursday.' },
    { ticketId: tickets[6].id, userId: managerId, content: 'Can we also support video embed from YouTube and Vimeo in the lesson content?' },
    { ticketId: tickets[7].id, userId: devId, content: 'Supabase Storage is set up. Supporting images, PDFs, and video up to 2GB with chunked uploads.' },
    { ticketId: tickets[10].id, userId: clientId, content: 'This is a critical bug. My instructors cannot upload course thumbnails larger than a phone photo.' },
    { ticketId: tickets[10].id, userId: devId, content: 'Confirmed the issue. The Next.js API route has a default body size limit. Adding chunked upload support now.' },
    { ticketId: tickets[22].id, userId: devId, content: 'Storybook is configured with a11y addon and viewport testing. Ready for review.' },
    { ticketId: tickets[24].id, userId: devId, content: 'Expo project is initialized with Expo Router, React Query for API calls, and Zustand for state management.' },
  ]

  await prisma.comment.createMany({ data: commentData })
  console.log(`  Created ${commentData.length} comments`)

  console.log('\nSeeding time logs...')

  const timeLogData = [
    { ticketId: tickets[0].id, userId: devId, hours: 4, description: 'Set up Supabase client and JWT helpers' },
    { ticketId: tickets[0].id, userId: devId, hours: 6, description: 'Implemented login, signup, forgot-password flows' },
    { ticketId: tickets[0].id, userId: devId, hours: 2, description: 'Cookie management and token refresh' },
    { ticketId: tickets[2].id, userId: devId, hours: 8, description: 'Designed and implemented full Prisma schema' },
    { ticketId: tickets[3].id, userId: devId, hours: 8, description: 'Built responsive dashboard layout with sidebar' },
    { ticketId: tickets[6].id, userId: devId, hours: 8, description: 'Started course editor with module drag-and-drop' },
    { ticketId: tickets[7].id, userId: devId, hours: 6, description: 'Supabase Storage integration and upload UI' },
    { ticketId: tickets[22].id, userId: devId, hours: 6, description: 'Storybook setup with addons' },
    { ticketId: tickets[24].id, userId: devId, hours: 8, description: 'Expo project initialization and navigation setup' },
  ]

  await prisma.timeLog.createMany({ data: timeLogData })
  console.log(`  Created ${timeLogData.length} time logs`)

  console.log('\nSeeding activities...')

  const activityData = [
    { ticketId: tickets[0].id, userId: ownerId, action: 'CREATED', newValue: 'Created ticket LMS-1' },
    { ticketId: tickets[0].id, userId: ownerId, action: 'ASSIGNED', field: 'assigneeId', newValue: devId },
    { ticketId: tickets[0].id, userId: devId, action: 'STATUS_CHANGED', field: 'status', oldValue: 'BACKLOG', newValue: 'IN_PROGRESS' },
    { ticketId: tickets[0].id, userId: devId, action: 'STATUS_CHANGED', field: 'status', oldValue: 'IN_PROGRESS', newValue: 'DONE' },
    { ticketId: tickets[6].id, userId: ownerId, action: 'CREATED', newValue: 'Created ticket LMS-7' },
    { ticketId: tickets[6].id, userId: ownerId, action: 'ASSIGNED', field: 'assigneeId', newValue: devId },
    { ticketId: tickets[6].id, userId: devId, action: 'STATUS_CHANGED', field: 'status', oldValue: 'TODO', newValue: 'IN_PROGRESS' },
  ]

  await prisma.activity.createMany({ data: activityData })
  console.log(`  Created ${activityData.length} activities`)

  console.log('\nSeeding attachments...')

  const attachmentData = [
    { ticketId: tickets[1].id, userId: managerId, fileName: 'login-mockup-v2.fig', fileUrl: 'https://figma.com/file/mock', fileSize: 245000, mimeType: 'application/octet-stream' },
    { ticketId: tickets[2].id, userId: devId, fileName: 'schema-diagram.png', fileUrl: 'https://storage.example.com/schema.png', fileSize: 89000, mimeType: 'image/png' },
    { ticketId: tickets[6].id, userId: devId, fileName: 'editor-wireframe.pdf', fileUrl: 'https://storage.example.com/wireframe.pdf', fileSize: 340000, mimeType: 'application/pdf' },
  ]

  await prisma.attachment.createMany({ data: attachmentData })
  console.log(`  Created ${attachmentData.length} attachments`)

  console.log('\n--- Seed Complete ---')
  console.log('\nTest accounts (login at /login):')
  console.log('  Admin:    admin@spurvance.com / Admin@123')
  console.log('  Manager:  sarah@spurvance.com / Sarah@123')
  console.log('  Dev:      dev@spurvance.com   / Dev@12345')
  console.log('  Client:   client@spurvance.com / Client@123')
  console.log('  Viewer:   viewer@spurvance.com / Viewer@123')
  console.log(`\nProjects: ${project1.key} (${project1.name}), ${project2.key} (${project2.name}), ${project3.key} (${project3.name})`)
}

seed().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect())
