import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import "@/global.css";
import Header from '@/components/Partials/Header';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Uncomment these when you want to enable auth
  // if (!token) {
  //   redirect('/login');
  // }

  // const decoded = verifyToken(token);
  // const userId = decoded?.userId ?? null;

  // if (!userId) {
  //   redirect('/login');
  // }

  return (
    <div className="min-h-screen bg-black">
      {/* Header is now fixed and glassmorphism */}
      <Header />
      
      {/* Add padding-top to account for fixed header */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6">
          <h2 className="text-xl font-semibold text-white">
            Welcome Back!
          </h2>

          <p className="text-gray-300 mt-2">
            You are successfully logged in.
          </p>
          
        </div>
      </div>
    </div>
  );
}