import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import "@/global.css";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const decoded = verifyToken(token);
  if (!decoded?.userId) {
    redirect('/login');
  }

  const supabase = getSupabaseAdminClient();
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', decoded.userId)
    .single();

  if (user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`.main-scroll::-webkit-scrollbar{width:6px}.main-scroll::-webkit-scrollbar-track{background:transparent}.main-scroll::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}.main-scroll::-webkit-scrollbar-thumb:hover{background:#2a2a2a}`}</style>
      <Suspense fallback={<div className="w-64 h-screen bg-zinc-950 border-r border-white/[0.06]" />}>
        <Sidebar />
      </Suspense>
      <main className="lg:ml-64 h-screen overflow-y-auto main-scroll">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
