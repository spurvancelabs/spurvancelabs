import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { ROLES } from '@/lib/lms/roles';
import AdminSidebar from '@/components/lms/AdminSidebar';
import "@/global.css";

export const dynamic = 'force-dynamic';

export default async function LMSAdminLayout({ children }: { children: React.ReactNode }) {
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

  if (user?.role !== ROLES.ADMIN) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`.main-scroll::-webkit-scrollbar{width:6px}.main-scroll::-webkit-scrollbar-track{background:transparent}.main-scroll::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}.main-scroll::-webkit-scrollbar-thumb:hover{background:#2a2a2a}`}</style>
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen overflow-y-auto main-scroll">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
