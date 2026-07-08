import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { ROLES } from '@/lib/lms/roles';

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
    .select('role')
    .eq('id', decoded.userId)
    .single();

  if (user?.role !== ROLES.USER && user?.role !== ROLES.ADMIN) notFound();

  return <>{children}</>;
}
