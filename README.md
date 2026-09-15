# Spurvance Labs Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

A enterprise-grade unified platform built by **Spurvance Labs**. This repository houses the complete public agency web presence, client project management system (Kanban, velocity tracking, ticket assignments), complete Learning Management System (LMS) for course delivery and certification, dynamic recruitment/career portal, and admin management suite.

---

## 📋 Table of Contents

1. [Project Summary](#-project-summary)
2. [Core Functionality & Modules](#-core-functionality--modules)
3. [User Roles & Authorization Matrix](#-user-roles--authorization-matrix)
4. [Project Architecture & File Structure](#-project-architecture--file-structure)
5. [Complete Application Routes & Pages](#-complete-application-routes--pages)
6. [Database Schema Summary](#-database-schema-summary)
7. [Environment Variables Setup](#-environment-variables-setup)
8. [Local Development & Setup Guide](#-local-development--setup-guide)
9. [Production Deployment](#-production-deployment)

---

## 🚀 Project Summary

**Spurvance Labs Platform** serves as a dual-facing system:
- **Public & Client Facing:** Showcases corporate services, blog/insights, open career & internship opportunities, interactive applicant submission portals, client project management dashboards, and student LMS course access.
- **Internal / Administration Suite:** Provides centralized administration across global projects, tickets, hiring pipelines, user roles, notifications, and course/quiz construction.

Built using Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma ORM, and Supabase (PostgreSQL with Realtime capabilities and SSR Auth).

---

## ⚡ Core Functionality & Modules

### 1. 🏢 Public Agency Site & Careers Portal
- Responsive landing pages detailing services, portfolio, blog system, and dynamic forms.
- Job & Internship listings with rich multi-step application forms.
- Dynamic CV/Resume submission with internal reviewer tracking.

### 2. 📊 Agile Project Management System
- **Kanban Boards:** Drag-and-drop ticket workflows with `@dnd-kit`.
- **Sprint & Agile Analytics:** Burndown charts, velocity charts using Recharts & Nivo.
- **Ticket Tracking:** Priority management, estimated vs actual hours, tags, attachments, activity history, and comment threads.
- **Department & Access Management:** Project key generation, team memberships, and granular role assignments.

### 3. 🎓 LMS (Learning Management System)
- **Course Discovery & Player:** Student dashboard, enrolled courses, wishlist, video module viewer, progress calculation, and completion certification.
- **Instructor & Admin Builder:** Comprehensive course creation suite under `/lms/instructor/*` featuring interactive quiz building, module sequencing, file uploads, and global course oversight.

### 4. 🔔 Real-Time Notification & Audit Engine
- Integrated in-app notifications and preferences powered by Supabase Realtime & custom APIs.
- Comprehensive audit logging for system administrative activities.
- Automated email triggers via Resend / Nodemailer.

---

## 🔐 User Roles & Authorization Matrix

The application handles permissions via Supabase Auth + Prisma `admin_users` table mappings:

| Role Level | LMS Gate | Project Mgmt Gate | Admin Portal Access | Description / Responsibilities |
| :--- | :---: | :---: | :---: | :--- |
| **SUPER_ADMIN** | Full Access | Full Access | Full Access | Full global system control, role modifications, complete database control |
| **ADMIN** | Full Access | Project Admin | Full Access | System management, user control, job posting, application decisions |
| **EDITOR** | Full Access | Project Admin | Full Access | Content management, publishing LMS courses, managing recruitment |
| **NANO_EDITOR** | Full Access | Team Member | Full Access | Secondary content editing and LMS content updates |
| **VIEWER** | Full Access (Read) | Read Only | Limited Access | Internal auditor or reviewer privileges |
| **INSTRUCTOR** | Course Creator | Assigned Projects | LMS Only | Dedicated LMS instructor who creates and manages courses |
| **USER / CLIENT** | Student Access | Assigned Projects | No Access | Standard registered user, applicant, client, or LMS student |

*Note: In the LMS module, all administrative roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `NANO_EDITOR`, `VIEWER`) share global administrative access under `/lms/instructor/*`.*

---

## 📁 Project Architecture & File Structure

```
spurvancelabs/
├── prisma/
│   ├── schema.prisma              # Complete database schema definitions
│   └── migrations/                # Database migration history
├── public/                        # Static assets, branding, logos, and local uploads
├── src/
│   ├── app/                       # Next.js App Router (Pages & API routes)
│   │   ├── (auth)/                # Authentication routes (login, signup)
│   │   ├── (public)/              # Public website (home, blog, careers, services)
│   │   ├── admin/                 # Core Admin Suite (dashboard, jobs, applications)
│   │   ├── lms/                   # Learning Management System
│   │   │   ├── courses/           # Student course catalog & player
│   │   │   └── instructor/        # Single merged Admin/Instructor studio
│   │   ├── projects/              # Agile Project Management workspace
│   │   ├── api/                   # REST API API Endpoints
│   │   │   ├── admin/             # System & career administration APIs
│   │   │   ├── lms/               # LMS & course management endpoints
│   │   │   ├── projects/          # Kanban & ticket management endpoints
│   │   │   ├── notifications/     # Notification system APIs
│   │   │   └── applications/      # Job application submission APIs
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── globals.css            # Tailwind CSS v4 setup & root styles
│   ├── components/                # Modular React UI components
│   │   ├── admin/                 # Admin table components, stats, modals
│   │   ├── blog/                  # Blog cards, shell, and sidebar
│   │   ├── lms/                   # Quiz builder, module list, player
│   │   ├── projects/              # Kanban board, cards, velocity & burndown charts
│   │   └── Partials/              # Header, Footer, Language Selector
│   ├── hooks/                     # Custom React hooks (Realtime notifications, queries)
│   ├── lib/                       # Utilities & Business Logic
│   │   ├── api/                   # Client-side API fetch wrappers
│   │   ├── lms/                   # LMS access, roles, and upload handlers
│   │   ├── notification/          # Notification service & realtime triggers
│   │   ├── projects/              # Project permissions, calculations, keys
│   │   ├── supabase/              # Supabase server, client, admin, middleware setup
│   │   ├── auth.ts                # Next.js Session & Auth helpers
│   │   ├── email.ts               # Resend / Nodemailer transport configuration
│   │   ├── prisma.ts              # Global Prisma Client instance
│   │   └── rate-limit.ts          # API rate limiting helper
│   └── middleware.ts              # Route protection & auth session handling
├── .env.local                     # Local environment variables configuration
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.mjs             # PostCSS configuration for Tailwind
└── tsconfig.json                  # TypeScript compiler settings
```

---

## 🗺️ Complete Application Routes & Pages

### 🌐 Public Routes
- `/` - Corporate Landing Page (Services, Tech Stack, About)
- `/careers` - Job & Internship portal listing open positions
- `/careers/jobs/[id]` - Job details & submission form
- `/careers/internships/[id]` - Internship details & submission form
- `/blogs` - Tech & company blog list
- `/blogs/[slug]` - Blog detail post reader
- `/contact` - Inquiries & business contact form

### 🔒 Auth Routes
- `/login` - User, Client, & Admin authentication page
- `/signup` - New account registration page

### 📊 Project Management Workspace (`/projects`)
- `/projects` - Project overview grid & team dashboard
- `/projects/[id]` - Interactive Kanban board & sprint view
- `/projects/[id]/tickets/[ticketId]` - Detailed ticket view & activity stream
- `/projects/[id]/analytics` - Velocity & Burndown charts

### 🎓 LMS Module (`/lms`)
- `/lms/courses` - Course catalog & enrolled courses
- `/lms/courses/[id]` - Course overview & syllabus page
- `/lms/courses/[id]/learn` - Student video player & quiz interface
- `/lms/instructor` - Instructor / Admin overview dashboard
- `/lms/instructor/courses` - Global course management list
- `/lms/instructor/courses/new` - Course creation wizard
- `/lms/instructor/courses/[id]/edit` - Curriculum & quiz builder studio

### 🛡️ Admin Suite (`/admin`)
- `/admin/dashboard` - Executive metrics, global application counts, system health
- `/admin/jobs` - Job posting management (Create/Edit/Close)
- `/admin/internships` - Internship posting management
- `/admin/applications` - Job application reviewing pipeline & status updates
- `/admin/internship-applications` - Internship applicant tracker
- `/admin/users` - Global user & admin role assignment matrix

---

## 🗄️ Database Schema Summary

The database uses PostgreSQL with Prisma ORM and Supabase. Core model highlights:

```prisma
// Users & Admin Roles
User                    -> Stores auth identity, email, name, avatar
AdminUser               -> Maps User to admin roles (SUPER_ADMIN, ADMIN, EDITOR, NANO_EDITOR, VIEWER) & instructor flag

// Recruitment Portal
Job                     -> Title, department, salary ranges, skills array, status (ACTIVE/CLOSED)
Internship              -> Duration, stipend, department, skills, status
JobApplication          -> Applicant information, resume URL, stage status (PENDING, REVIEWING, INTERVIEW, OFFER, REJECTED), feedback
InternshipApplication   -> Student details, university, GPA, resume, interview stage

// Project Management System
Project                 -> Key, name, description, owner, state (ACTIVE, ARCHIVED)
ProjectMember           -> Maps User to Project with project-level roles (OWNER, ADMIN, MEMBER, VIEWER)
Ticket                  -> Title, priority, status (TODO, IN_PROGRESS, IN_REVIEW, DONE), estimate hours, assignee, reporter
TicketComment           -> Comment strings attached to tickets
TicketAttachment        -> File references attached to tickets
TicketActivity          -> Audit log of ticket movements & field changes
TimeLog                 -> Time spent records log per ticket

// LMS Module
LmsCourse               -> Course details, level, price, status (DRAFT, PUBLISHED, ARCHIVED)
LmsModule               -> Sequenced course modules
LmsLesson               -> Video lessons, content body, attachments
LmsQuiz                 -> Quiz configurations linked to modules
LmsQuizQuestion         -> Multiple choice / boolean questions with options & answers
LmsEnrollment           -> Student enrollment status & completion progress percentage
LmsLessonProgress       -> Tracks student lesson completion

// System Infrastructure
Notification            -> Realtime notifications with priority, link, sender info, read state
NotificationPreference  -> Email, push, in-app toggles per user
AuditLog                -> IP, User Agent, action recording for security
```

---

## 🔑 Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# -----------------------------------------------------------------------------
# DATABASE CONFIGURATION
# -----------------------------------------------------------------------------
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE_NAME]?schema=public"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE_NAME]?schema=public"

# -----------------------------------------------------------------------------
# SUPABASE CONFIGURATION
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_SUPABASE_PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# -----------------------------------------------------------------------------
# APPLICATION AUTH & SECRETS
# -----------------------------------------------------------------------------
NEXTAUTH_SECRET="your-super-secret-nextauth-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# -----------------------------------------------------------------------------
# EMAIL / MAILER CONFIGURATION
# -----------------------------------------------------------------------------
RESEND_API_KEY="re_123456789_your_resend_key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="notifications@yourdomain.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="Spurvance Labs <no-reply@yourdomain.com>"
```

---

## 💻 Local Development & Setup Guide

### Prerequisites
- **Node.js**: `>= 20.19.0`
- **Package Manager**: `pnpm` or `npm`
- **Database**: PostgreSQL (or Supabase Postgres instance)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/spurvancelabs/platform.git
cd spurvancelabs
pnpm install
```

### 2. Configure Database & Prisma
```bash
# Generate Prisma Client
pnpm run prisma:generate

# Push schema to database
pnpm run prisma:push
```

### 3. Run Development Server
```bash
pnpm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🚀 Production Deployment

### Deploying on Vercel

1. **Connect Repository:** Import the repository into your Vercel Dashboard.
2. **Environment Variables:** Configure all variables from `.env.local` in Vercel project settings.
3. **Build Command:** The project is configured with a prebuild step (`prisma generate`).
   - Build Command: `next build`
   - Install Command: `pnpm install`
4. **Deploy:** Click **Deploy**.

---

© 2026 **Spurvance Labs**. All rights reserved.
