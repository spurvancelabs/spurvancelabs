import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ROLES } from '@/lib/lms/roles'

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  const decoded = await verifyToken(token)
  if (!decoded?.userId) return null

  const user = await prisma.users.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, raw_user_meta_data: true },
  })

  if (!user) return null

  const publicUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, role: true },
  })

  return {
    id: user.id,
    email: user.email,
    name: publicUser?.name,
    role: publicUser?.role ?? ROLES.USER,
  }
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== ROLES.ADMIN) throw new Error('Forbidden')
  return user
}

export async function requireInstructor() {
  const user = await requireAuth()
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.INSTRUCTOR) throw new Error('Forbidden')
  return user
}

export async function requireStudent() {
  const user = await requireAuth()
  if (user.role !== ROLES.USER && user.role !== ROLES.ADMIN) throw new Error('Forbidden')
  return user
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
