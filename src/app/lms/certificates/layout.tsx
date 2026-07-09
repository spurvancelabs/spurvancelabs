import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { ROLES, hasMinRole } from '@/lib/lms/roles';

export const dynamic = 'force-dynamic';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) notFound();

  const decoded = await verifyToken(token);
  if (!decoded?.userId) notFound();

  const supabase = getSupabaseAdminClient();
  const { data: user } = await supabase
    .from('users')
    .select('type')
    .eq('id', decoded.userId)
    .single();

  if (!user) notFound();

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', decoded.userId)
    .single();

  const effectiveRole = adminUser?.role || user.type || ROLES.USER;

  if (effectiveRole !== ROLES.USER && effectiveRole !== ROLES.INSTRUCTOR && !hasMinRole(effectiveRole, ROLES.VIEWER)) {
    notFound();
  }

  return <>{children}</>;
}
