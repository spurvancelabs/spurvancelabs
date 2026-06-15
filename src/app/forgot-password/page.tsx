'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../global.css";
import LanguageSelector from '@/components/languageSelector';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-black">
       <div className="relative hidden md:block md:w-1/2 bg-white h-[700px] mb-2 mt-2 rounded-2xl  overflow-hidden">
         <div className="absolute bottom-[250px]  left-[-50px]  h-[800px] w-[800px] rounded-full bg-[#1F1FE0] opacity-100 blur-[70px]"  />
         <div className="absolute bottom-[450px]  left-[-50px] h-[800px] w-[800px] rounded-full bg-black opacity-100 blur-[40px]" />
       </div>

       <div className="relative z-10 flex w-full flex-col bg-black text-white md:w-1/2 md:min-h-screen">
         <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-5 md:px-8">
           <div className="text-center">
             <h1 className="text-2xl font-bold md:text-3xl">Forgot Password?</h1>
             <p className="mt-2 text-xs text-gray-300 md:text-sm">Enter your email and we will send you an OTP to reset your password.</p>
           </div>

           <form onSubmit={handleSubmit} className="flex w-full max-w-[280px] flex-col gap-4 md:max-w-[300px]">
             <div className="flex flex-col gap-1.5">
               <label className="text-xs font-medium md:text-sm">Email Address</label>
               <div className="relative">
                 <input
                   id="email"
                   type="email"
                   placeholder="you@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="h-10 w-full rounded-lg border-none bg-[#181818] pl-4 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-11 md:text-sm"
                   required
                 />
               </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 md:h-11 md:text-sm"
             >
               {loading ? 'Sending...' : 'Send OTP'}
             </button>
           </form>

           {error && (
             <div className="mt-4 w-full max-w-[280px] rounded-lg bg-red-500/10 p-3 text-center text-xs text-red-400 md:max-w-[300px] md:text-sm">
               {error}
             </div>
           )}

           <p className="text-center text-xs text-gray-300 md:text-sm">
             Remember your password?{' '}
             <a href="/login" className="font-semibold text-white underline hover:text-gray-300">
               Sign in
             </a>
           </p>
         </div>

         <div className="flex w-full items-center justify-between px-6 py-4 text-[10px] font-semibold text-gray-400 md:px-8 md:text-xs">
           <span>© 2026 Spurvancelab</span>
           <LanguageSelector />
         </div>
       </div>

    </div>
  );
}
