import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ROLES, hasMinRole, roleLevel } from '@/lib/lms/roles'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
  level: number
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  const decoded = await verifyToken(token)
  if (!decoded?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, type: true },
  })

  if (!user) return null

  let role = user.type ?? ROLES.USER

  const supabase = getSupabaseAdminClient()
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (adminUser?.role) {
    role = adminUser.role
  }

  return {
    id: user.id,
    email: user.email ?? '',
    name: user.name,
    role,
    level: roleLevel(role),
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireRole(minRole: string): Promise<AuthUser> {
  const user = await requireAuth()
  if (!hasMinRole(user.role, minRole)) throw new Error('Forbidden')
  return user
}

export async function requireSuperAdmin(): Promise<AuthUser> {
  return requireRole(ROLES.SUPER_ADMIN)
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole(ROLES.ADMIN)
}

export async function requireEditor(): Promise<AuthUser> {
  return requireRole(ROLES.EDITOR)
}

export async function requireNanoEditor(): Promise<AuthUser> {
  return requireRole(ROLES.NANO_EDITOR)
}

export async function requireViewer(): Promise<AuthUser> {
  return requireRole(ROLES.VIEWER)
}

export async function requireInstructor(): Promise<AuthUser> {
  const user = await requireAuth()
  if (!hasMinRole(user.role, ROLES.ADMIN) && user.role !== ROLES.INSTRUCTOR) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireStudent(): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== ROLES.USER && !hasMinRole(user.role, ROLES.VIEWER)) throw new Error('Forbidden')
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
