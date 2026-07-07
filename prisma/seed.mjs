import { config } from 'dotenv'
config()
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

function uid() { return crypto.randomUUID() }

const CATEGORIES = [
  { name: 'Web Development',       slug: 'web-development',       description: 'Build modern websites and web applications using HTML, CSS, JavaScript, and frameworks.' },
  { name: 'Data Science',          slug: 'data-science',          description: 'Analyze data, build models, and derive insights using Python, R, and statistical methods.' },
  { name: 'Mobile Apps',           slug: 'mobile-apps',           description: 'Create cross-platform and native mobile applications for iOS and Android.' },
  { name: 'DevOps',                slug: 'devops',                description: 'Automate infrastructure, manage deployments, and streamline development workflows.' },
  { name: 'AI / Machine Learning', slug: 'ai-machine-learning',   description: 'Develop intelligent systems using machine learning, deep learning, and neural networks.' },
  { name: 'Cybersecurity',         slug: 'cybersecurity',         description: 'Protect systems, networks, and data from cyber threats and vulnerabilities.' },
  { name: 'Cloud Computing',       slug: 'cloud-computing',       description: 'Design and manage scalable cloud infrastructure on AWS, Azure, and GCP.' },
  { name: 'Blockchain',            slug: 'blockchain',            description: 'Build decentralized applications, smart contracts, and blockchain-based solutions.' },
]

const COURSES_BY_CATEGORY = {
  'Web Development': [
    { title: 'HTML & CSS: Build Modern Responsive Websites',              level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'JavaScript: The Complete Guide',                            level: 'BEGINNER',    isFree: false, price: 49.99 },
    { title: 'React.js: Building Dynamic User Interfaces',                level: 'INTERMEDIATE',isFree: false, price: 69.99 },
    { title: 'Node.js and Express: Server-Side Development',              level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'Full-Stack Web Development with Next.js',                   level: 'INTERMEDIATE',isFree: false, price: 79.99 },
    { title: 'Vue.js: Progressive Web Applications',                      level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'TypeScript: Advanced Type Systems',                         level: 'ADVANCED',    isFree: false, price: 49.99 },
    { title: 'RESTful API Design and Development',                        level: 'INTERMEDIATE',isFree: false, price: 44.99 },
    { title: 'Web Performance Optimization',                              level: 'ADVANCED',    isFree: false, price: 39.99 },
    { title: 'Progressive Web Apps: From Zero to Production',             level: 'INTERMEDIATE',isFree: true,  price: null },
    { title: 'GraphQL: API Design with Apollo',                           level: 'ADVANCED',    isFree: false, price: 54.99 },
    { title: 'SASS and Modern CSS Architecture',                          level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Testing JavaScript Applications',                           level: 'INTERMEDIATE',isFree: false, price: 44.99 },
    { title: 'Web Accessibility: A Complete Guide',                       level: 'BEGINNER',    isFree: true,  price: null },
  ],
  'Data Science': [
    { title: 'Python for Data Science and Machine Learning',              level: 'BEGINNER',    isFree: false, price: 59.99 },
    { title: 'Data Analysis with Pandas and NumPy',                       level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'SQL for Data Analysis',                                     level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Data Visualization with Matplotlib and Seaborn',            level: 'INTERMEDIATE',isFree: false, price: 39.99 },
    { title: 'Statistical Methods for Data Science',                      level: 'INTERMEDIATE',isFree: false, price: 49.99 },
    { title: 'R Programming for Data Science',                            level: 'INTERMEDIATE',isFree: false, price: 44.99 },
    { title: 'Big Data Analytics with Apache Spark',                      level: 'ADVANCED',    isFree: false, price: 69.99 },
    { title: 'Time Series Analysis and Forecasting',                      level: 'ADVANCED',    isFree: false, price: 54.99 },
    { title: 'Data Wrangling and Cleaning Techniques',                    level: 'INTERMEDIATE',isFree: false, price: 39.99 },
    { title: 'A/B Testing and Experimentation',                           level: 'INTERMEDIATE',isFree: false, price: 44.99 },
    { title: 'Business Intelligence and Analytics',                       level: 'BEGINNER',    isFree: false, price: 49.99 },
    { title: 'Data Storytelling with Dashboards',                         level: 'INTERMEDIATE',isFree: true,  price: null },
    { title: 'Natural Language Processing for Data Science',              level: 'ADVANCED',    isFree: false, price: 64.99 },
  ],
  'Mobile Apps': [
    { title: 'React Native: Cross-Platform Mobile Development',           level: 'INTERMEDIATE',isFree: false, price: 69.99 },
    { title: 'Flutter: Building Beautiful Native Apps',                   level: 'BEGINNER',    isFree: false, price: 59.99 },
    { title: 'iOS Development with Swift',                                level: 'INTERMEDIATE',isFree: false, price: 74.99 },
    { title: 'Android Development with Kotlin',                           level: 'INTERMEDIATE',isFree: false, price: 74.99 },
    { title: 'Mobile UI/UX Design Principles',                            level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Building Mobile APIs with GraphQL',                         level: 'ADVANCED',    isFree: false, price: 54.99 },
    { title: 'React Native with Expo',                                    level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Mobile App Testing and Debugging',                          level: 'ADVANCED',    isFree: false, price: 44.99 },
    { title: 'Kotlin Multiplatform Mobile',                               level: 'ADVANCED',    isFree: false, price: 64.99 },
    { title: 'SwiftUI: Modern iOS Development',                           level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'Mobile App Security Best Practices',                        level: 'INTERMEDIATE',isFree: false, price: 49.99 },
    { title: 'Publishing and Monetizing Mobile Apps',                     level: 'BEGINNER',    isFree: true,  price: null },
  ],
  'DevOps': [
    { title: 'Docker: Containerization Fundamentals',                     level: 'BEGINNER',    isFree: false, price: 49.99 },
    { title: 'Kubernetes: Orchestration and Management',                  level: 'INTERMEDIATE',isFree: false, price: 69.99 },
    { title: 'CI/CD Pipelines with GitHub Actions',                       level: 'INTERMEDIATE',isFree: false, price: 44.99 },
    { title: 'Terraform: Infrastructure as Code',                         level: 'INTERMEDIATE',isFree: false, price: 54.99 },
    { title: 'Ansible: Automation and Configuration',                     level: 'INTERMEDIATE',isFree: false, price: 49.99 },
    { title: 'Monitoring and Observability with Prometheus',              level: 'ADVANCED',    isFree: false, price: 59.99 },
    { title: 'Jenkins: Continuous Integration Server',                    level: 'INTERMEDIATE',isFree: true,  price: null },
    { title: 'Linux Administration for DevOps',                           level: 'BEGINNER',    isFree: false, price: 39.99 },
    { title: 'Git: Version Control Mastery',                              level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Helm: Kubernetes Package Manager',                          level: 'ADVANCED',    isFree: false, price: 44.99 },
    { title: 'Site Reliability Engineering Fundamentals',                 level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'Cloud-Native Application Architecture',                     level: 'ADVANCED',    isFree: false, price: 64.99 },
  ],
  'AI / Machine Learning': [
    { title: 'Machine Learning Fundamentals',                             level: 'BEGINNER',    isFree: false, price: 59.99 },
    { title: 'Deep Learning with TensorFlow',                             level: 'INTERMEDIATE',isFree: false, price: 74.99 },
    { title: 'Natural Language Processing with Transformers',             level: 'ADVANCED',    isFree: false, price: 79.99 },
    { title: 'Computer Vision: Object Detection and Recognition',         level: 'ADVANCED',    isFree: false, price: 74.99 },
    { title: 'Reinforcement Learning: Theory and Practice',               level: 'ADVANCED',    isFree: false, price: 69.99 },
    { title: 'Neural Networks: Architecture and Design',                  level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'MLOps: Deploying Machine Learning Models',                  level: 'ADVANCED',    isFree: false, price: 64.99 },
    { title: 'Generative AI with Large Language Models',                  level: 'INTERMEDIATE',isFree: false, price: 84.99 },
    { title: 'Feature Engineering for Machine Learning',                  level: 'INTERMEDIATE',isFree: true,  price: null },
    { title: 'Model Evaluation and Hyperparameter Tuning',                level: 'ADVANCED',    isFree: false, price: 49.99 },
    { title: 'Time Series Forecasting with Machine Learning',             level: 'INTERMEDIATE',isFree: false, price: 54.99 },
    { title: 'Recommender Systems: Design and Implementation',            level: 'ADVANCED',    isFree: false, price: 59.99 },
    { title: 'AI Ethics and Responsible AI Development',                  level: 'BEGINNER',    isFree: true,  price: null },
  ],
  'Cybersecurity': [
    { title: 'Ethical Hacking and Penetration Testing',                   level: 'INTERMEDIATE',isFree: false, price: 79.99 },
    { title: 'Network Security Fundamentals',                             level: 'BEGINNER',    isFree: false, price: 49.99 },
    { title: 'Cryptography: Theory and Application',                      level: 'INTERMEDIATE',isFree: false, price: 54.99 },
    { title: 'Web Application Security',                                  level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'SOC Operations and Threat Intelligence',                    level: 'ADVANCED',    isFree: false, price: 69.99 },
    { title: 'Digital Forensics and Incident Response',                   level: 'INTERMEDIATE',isFree: false, price: 64.99 },
    { title: 'Cloud Security Architecture',                               level: 'ADVANCED',    isFree: false, price: 69.99 },
    { title: 'Identity and Access Management',                            level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Malware Analysis and Reverse Engineering',                  level: 'ADVANCED',    isFree: false, price: 74.99 },
    { title: 'Security Compliance and Governance',                        level: 'INTERMEDIATE',isFree: false, price: 49.99 },
    { title: 'Zero Trust Network Architecture',                           level: 'ADVANCED',    isFree: false, price: 59.99 },
    { title: 'DevSecOps: Integrating Security into DevOps',               level: 'INTERMEDIATE',isFree: false, price: 54.99 },
  ],
  'Cloud Computing': [
    { title: 'AWS Solutions Architecture',                                level: 'INTERMEDIATE',isFree: false, price: 79.99 },
    { title: 'Microsoft Azure: Cloud Services',                           level: 'INTERMEDIATE',isFree: false, price: 74.99 },
    { title: 'Google Cloud Platform Fundamentals',                        level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Serverless Computing with AWS Lambda',                      level: 'INTERMEDIATE',isFree: false, price: 54.99 },
    { title: 'Cloud Cost Optimization Strategies',                        level: 'ADVANCED',    isFree: false, price: 44.99 },
    { title: 'Multi-Cloud Architecture Design',                           level: 'ADVANCED',    isFree: false, price: 69.99 },
    { title: 'AWS DevOps: Deployment and Automation',                     level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'Cloud Security Best Practices',                             level: 'INTERMEDIATE',isFree: true,  price: null },
    { title: 'Google Cloud Data Engineering',                             level: 'ADVANCED',    isFree: false, price: 74.99 },
    { title: 'Azure DevOps and CI/CD',                                    level: 'INTERMEDIATE',isFree: false, price: 54.99 },
    { title: 'Cloud Migration Strategies',                                level: 'ADVANCED',    isFree: false, price: 59.99 },
    { title: 'Edge Computing: Architecture and Implementation',           level: 'ADVANCED',    isFree: false, price: 64.99 },
  ],
  'Blockchain': [
    { title: 'Blockchain Fundamentals',                                   level: 'BEGINNER',    isFree: true,  price: null },
    { title: 'Ethereum: Smart Contract Development',                      level: 'INTERMEDIATE',isFree: false, price: 69.99 },
    { title: 'Solidity: Programming for Blockchain',                      level: 'INTERMEDIATE',isFree: false, price: 59.99 },
    { title: 'Web3: Decentralized Applications',                          level: 'INTERMEDIATE',isFree: false, price: 64.99 },
    { title: 'NFTs: Creation and Marketplace Development',                level: 'INTERMEDIATE',isFree: false, price: 54.99 },
    { title: 'DeFi: Decentralized Finance Protocols',                     level: 'ADVANCED',    isFree: false, price: 69.99 },
    { title: 'Hyperledger: Enterprise Blockchain',                        level: 'ADVANCED',    isFree: false, price: 74.99 },
    { title: 'Crypto Trading and Market Analysis',                        level: 'INTERMEDIATE',isFree: false, price: 49.99 },
    { title: 'Blockchain Security and Auditing',                          level: 'ADVANCED',    isFree: false, price: 64.99 },
    { title: 'IPFS: Decentralized Storage',                               level: 'INTERMEDIATE',isFree: true,  price: null },
    { title: 'DAOs: Governance and Operations',                           level: 'INTERMEDIATE',isFree: false, price: 44.99 },
    { title: 'Cross-Chain Interoperability',                              level: 'ADVANCED',    isFree: false, price: 59.99 },
  ],
}

const MODULE_TITLES_BY_INDEX = [
  ['Introduction to {topic}', 'Core Concepts and Fundamentals', 'Advanced Techniques', 'Real-World Applications', 'Final Project'],
  ['Getting Started with {topic}', 'Essential Building Blocks', 'Intermediate Patterns', 'Expert-Level Topics', 'Capstone Project'],
  ['Foundations of {topic}', 'Working with Core Tools', 'Advanced Implementation', 'Best Practices and Optimization', 'Production Deployment'],
  ['Understanding {topic}', 'Hands-On Fundamentals', 'Deep Dive into Techniques', 'Scaling and Performance', 'Course Wrap-Up'],
]

const LESSON_TITLES_BY_MODULE = [
  ['What is {topic}? An Overview', 'Setting Up Your Development Environment', 'First Steps: Hello World Example', 'Understanding the Core Concepts', 'Key Terminology and Definitions', 'Why {topic} Matters in 2025'],
  ['Core Building Blocks Explained', 'Working with Data Structures', 'Control Flow and Logic', 'Error Handling and Debugging', 'Best Practices for Clean Code', 'Practical Exercise: Building a Foundation'],
  ['Advanced Patterns and Techniques', 'Performance Optimization Strategies', 'Security Considerations', 'Integration with Third-Party Services', 'Testing and Quality Assurance', 'Real-World Case Study'],
  ['Building a Complete Application', 'Deployment and CI/CD Pipeline', 'Monitoring and Observability', 'Scaling for Production Traffic', 'Maintaining and Updating Your Project'],
  ['Capstone Project Overview', 'Planning and Architecture Design', 'Implementation Phase', 'Testing and Refinement', 'Final Presentation and Review'],
]

const LESSON_TYPES = ['VIDEO', 'TEXT', 'VIDEO', 'TEXT', 'TEXT']

async function main() {
  console.log('Seeding LMS data...')
  console.time('seed')

  // ─── DELETE ─────────────────────────────────────────────────
  console.log('Deleting existing LMS data...')
  await prisma.wishlist.deleteMany()
  await prisma.review.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()
  await prisma.course.deleteMany()
  await prisma.category.deleteMany()
  console.log('Deleted existing LMS data.')

  // ─── USERS ──────────────────────────────────────────────────
  console.log('Fetching existing users...')
  const existingUsers = await prisma.users.findMany({ select: { id: true } })
  console.log(`Found ${existingUsers.length} existing user(s).`)

  const ids = existingUsers.map(u => u.id)
  while (ids.length < 4) {
    const uuid = uid()
    const email = `seed-${uuid.slice(0, 8)}@seed.example.com`
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, is_sso_user, is_anonymous) VALUES ($1, $2, $3, now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', false, false)`,
        uuid, email, JSON.stringify({ name: `Seed User ${ids.length + 1}`, role: 'USER' })
      )
      await prisma.user.create({ data: { id: uuid, email, name: `Seed User ${ids.length + 1}`, role: 'USER' } })
      ids.push(uuid)
    } catch { /* retry with next uuid */ }
  }

  const instructorIds = [...ids]
  const studentIds = [...ids]
  console.log(`Using ${instructorIds.length} instructors and ${studentIds.length} students.`)

  // ─── CATEGORIES ─────────────────────────────────────────────
  console.log('Creating categories...')
  await prisma.category.createMany({ data: CATEGORIES })
  const catRows = await prisma.category.findMany()
  const catMap = Object.fromEntries(catRows.map(c => [c.name, c]))
  console.log(`Created ${catRows.length} categories.`)

  // ─── COURSES ────────────────────────────────────────────────
  console.log('Creating courses...')
  const now = Date.now()
  const courseRows = []
  for (const [catName, defs] of Object.entries(COURSES_BY_CATEGORY)) {
    const cat = catMap[catName]
    if (!cat) continue
    for (const def of defs) {
      courseRows.push({
        id: uid(),
        title: def.title,
        slug: slugify(def.title),
        description: `Master ${def.title.toLowerCase()}. This course covers ${def.level.toLowerCase()} to advanced techniques in ${catName.toLowerCase()}.`,
        categoryId: cat.id,
        level: def.level,
        instructorId: pick(instructorIds),
        price: def.price,
        isFree: def.isFree,
        status: 'PUBLISHED',
        publishedAt: new Date(now - randomInt(1, 365) * 86400000),
        duration: randomInt(10, 80),
      })
    }
  }
  await prisma.course.createMany({ data: courseRows })
  console.log(`Created ${courseRows.length} courses.`)

  // ─── MODULES, LESSONS, QUIZZES ─────────────────────────────
  console.log('Creating modules, lessons, and quizzes...')

  const allModules = []
  const allLessons = []
  const allQuizzes = []
  const allQuestions = []

  const catIdToName = new Map(catRows.map(c => [c.id, c.name]))

  for (const course of courseRows) {
    const t = catIdToName.get(course.categoryId) || 'Technology'
    const numModules = randomInt(3, 5)
    const template = pick(MODULE_TITLES_BY_INDEX)

    for (let mi = 0; mi < numModules; mi++) {
      const modId = uid()
      const moduleTitle = (template[mi] || `Module ${mi + 1}`).replace(/\{topic\}/g, t)
      allModules.push({ id: modId, courseId: course.id, title: moduleTitle, sortOrder: mi + 1 })

      const numLessons = randomInt(3, 6)
      const lessonTemplates = LESSON_TITLES_BY_MODULE[mi] || LESSON_TITLES_BY_MODULE[0]

      for (let li = 0; li < numLessons; li++) {
        const lessonId = uid()
        const lessonTitle = lessonTemplates[li % lessonTemplates.length].replace(/\{topic\}/g, t) + ` — ${course.title.split(':')[0].trim()}`
        const lessonType = pick(LESSON_TYPES)
        const videoUrl = lessonType === 'VIDEO' ? `https://example.com/videos/${slugify(lessonTitle)}` : null

        allLessons.push({
          id: lessonId,
          moduleId: modId,
          title: lessonTitle,
          description: `Learn about ${lessonTitle.toLowerCase()} in this ${lessonType.toLowerCase()} lesson.`,
          type: lessonType,
          content: { body: `# ${lessonTitle}\n\nThis lesson covers essential concepts and provides practical examples.` },
          videoUrl,
          duration: randomInt(5, 45),
          sortOrder: li + 1,
          isPublished: true,
        })

        if ((li + 1) % 3 === 0) {
          const quizId = uid()
          const numQ = randomInt(3, 5)
          allQuizzes.push({
            id: quizId,
            lessonId,
            title: `${lessonTitle} — Quick Assessment`,
            description: `Test your understanding of ${lessonTitle.toLowerCase()}.`,
            passingScore: 70,
            timeLimit: 10,
            maxAttempts: 3,
            shuffleQuestions: true,
            showResults: true,
          })

          for (let qi = 0; qi < numQ; qi++) {
            const opts = [
              `Approach A for "${lessonTitle}" scenario ${qi + 1}`,
              `Approach B for "${lessonTitle}" scenario ${qi + 1}`,
              `Method C for "${lessonTitle}" case ${qi + 1}`,
              `Method D for "${lessonTitle}" case ${qi + 1}`,
            ]
            const correctIdx = randomInt(0, 3)
            allQuestions.push({
              id: uid(),
              quizId,
              type: 'MULTIPLE_CHOICE',
              question: `Which approach works best for ${lessonTitle.toLowerCase()}?`,
              options: opts,
              correctAnswer: opts[correctIdx],
              points: 1,
              sortOrder: qi + 1,
            })
          }
        }
      }
    }
  }

  console.log(`  Inserting ${allModules.length} modules...`)
  await prisma.module.createMany({ data: allModules })

  console.log(`  Inserting ${allLessons.length} lessons...`)
  await prisma.lesson.createMany({ data: allLessons })

  console.log(`  Inserting ${allQuizzes.length} quizzes...`)
  await prisma.quiz.createMany({ data: allQuizzes })

  console.log(`  Inserting ${allQuestions.length} questions...`)
  await prisma.question.createMany({ data: allQuestions })

  console.log(`Created ${allModules.length} modules, ${allLessons.length} lessons, ${allQuizzes.length} quizzes, ${allQuestions.length} questions.`)

  // ─── ENROLLMENTS & PROGRESS ─────────────────────────────────
  console.log('Creating enrollments and progress...')

  const shuffledCourses = shuffle(courseRows)
  let enrollmentCount = 0
  let progressCount = 0

  for (const studentId of studentIds) {
    const numEnrollments = randomInt(3, 10)
    const studentCourses = shuffledCourses.slice(0, numEnrollments)

    for (const course of studentCourses) {
      const isCompleted = Math.random() < 0.25
      const status = isCompleted ? 'COMPLETED' : 'ACTIVE'

      const courseModules = allModules.filter(m => m.courseId === course.id).sort((a, b) => a.sortOrder - b.sortOrder)
      const moduleIds = courseModules.map(m => m.id)
      const courseLessons = allLessons.filter(l => moduleIds.includes(l.moduleId)).sort((a, b) => a.sortOrder - b.sortOrder)

      let completedLessons
      if (isCompleted) {
        completedLessons = courseLessons
      } else {
        const numComplete = randomInt(1, Math.max(1, courseLessons.length - 1))
        completedLessons = courseLessons.slice(0, numComplete)
      }

      const enrolledAt = new Date(now - randomInt(30, 365) * 86400000)
      const completedAt = isCompleted ? new Date(enrolledAt.getTime() + randomInt(1, 60) * 86400000) : null

      await prisma.enrollment.create({
        data: {
          courseId: course.id,
          studentId,
          status,
          progress: courseLessons.length > 0 ? Math.round((completedLessons.length / courseLessons.length) * 100) : 0,
          enrolledAt,
          completedAt,
        },
      })
      enrollmentCount++

      if (completedLessons.length > 0) {
        const progressData = completedLessons.map(lesson => ({
          studentId,
          lessonId: lesson.id,
          completed: true,
          score: isCompleted ? randomInt(70, 100) : (Math.random() < 0.6 ? randomInt(60, 100) : null),
          completedAt: new Date(enrolledAt.getTime() + randomInt(1, 30) * 86400000),
        }))
        await prisma.progress.createMany({ data: progressData })
        progressCount += progressData.length
      }
    }
  }

  console.log(`Created ${enrollmentCount} enrollments, ${progressCount} progress records.`)

  console.log('Creating reviews...')
  const reviewComments = [
    'Excellent course! Very well structured and informative.',
    'Great content, learned a lot. Highly recommend.',
    'Good course but could use more practical examples.',
    'The instructor explains concepts very clearly.',
    'Decent introduction to the topic. Could be more in-depth.',
    'Perfect for beginners. Easy to follow and understand.',
    'One of the best courses I have taken on this subject.',
    'Well organized with good assignments and quizzes.',
    'The pacing is just right. Not too fast, not too slow.',
    'Very practical and hands-on. Loved the real-world examples.',
    'A bit basic for my level, but still valuable.',
    'Outstanding course material and excellent teaching style.',
    'Would love to see an advanced follow-up course.',
    'The video quality and production value are top notch.',
    'Some sections could use more detailed explanations.',
    'I finally understand this topic after struggling for months!',
    'Good foundation but needs more advanced topics.',
    'Engaging and well-paced. The quizzes were helpful.',
    'Highly recommend for anyone starting out in this field.',
    'The projects helped solidify the concepts. Great experience!',
  ]

  let reviewCount = 0
  const enrolledPairs = await prisma.enrollment.findMany({ select: { courseId: true, studentId: true } })
  const shuffledPairs = shuffle(enrolledPairs)
  for (const pair of shuffledPairs.slice(0, Math.min(80, shuffledPairs.length))) {
    const rating = randomInt(3, 5)
    const comment = reviewComments[reviewCount % reviewComments.length]
    try {
      await prisma.review.create({
        data: {
          courseId: pair.courseId,
          studentId: pair.studentId,
          rating,
          comment,
        },
      })
      reviewCount++
    } catch { /* skip duplicates */ }
  }
  console.log(`Created ${reviewCount} reviews.`)
  console.timeEnd('seed')
  console.log('Seed complete!')
}

main()
  .catch(e => { console.error('Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
