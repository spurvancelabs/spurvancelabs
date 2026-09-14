import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getAuthUser } from '@/lib/lms/utils';
import { canAccessProjects } from '@/lib/lms/permissions';

export type ProjectAccess =
  | { ok: true; userId: string; role: string }
  | { ok: false; status: 401 | 403 };

export async function getProjectAccess(): Promise<ProjectAccess> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { ok: false, status: 401 };
  const payload = await verifyToken(token);
  if (!payload?.userId) return { ok: false, status: 401 };

  const auth = await getAuthUser();
  if (!auth) return { ok: false, status: 401 };
  if (!canAccessProjects(auth.role)) return { ok: false, status: 403 };

  return { ok: true, userId: auth.id, role: auth.role };
}