// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import "../../global.css";
import LoginSignupSwitcher from "@/components/loginSignupSwitcher";
import LanguageSelector from "@/components/languageSelector";
import GradientImage from '@/components/GradientImage';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-black">
      {/* Left Section - Black */}
      <div className="relative z-10 flex w-full flex-col bg-black text-white md:w-1/2 md:min-h-screen">
        {/* Header */}
        <LoginSignupSwitcher />

        {/* Login Form */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-5 md:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Login to your account</h1>
            <p className="mt-2 text-xs text-gray-300 md:text-sm">Enter your detail to login</p>
          </div>

          <button className="cursor-pointer flex w-full max-w-[280px] items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] px-4 py-2.5 text-xs font-medium shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:from-[#333333] hover:to-[#222222] hover:shadow-[0_6px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all md:max-w-[300px] md:text-sm">
            <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex w-full max-w-[280px] items-center gap-4 md:max-w-[300px]">
            <hr className="flex-1 border-gray-600" />
            <span className="text-[10px] text-gray-400 md:text-xs">or</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-[280px] flex-col gap-4 md:max-w-[300px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium md:text-sm">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 md:h-5 md:w-5 drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]" />
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border-none bg-[#181818] pl-9 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-11 md:pl-10 md:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium md:text-sm">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 md:h-5 md:w-5 drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border-none bg-[#181818] pl-9 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-11 md:pl-10 md:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300 md:text-sm">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-[#181818] checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 md:h-4 md:w-4" />
                  <svg className="pointer-events-none absolute left-0.5 top-0.5 h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100 md:left-0.5 md:top-0.5 md:h-3 md:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Keep me logged in
              </label>
              <a href="/forgot-password" className="text-white underline hover:text-gray-300">Forget Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 md:h-11 md:text-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {message && (
            <div className="mt-4 w-full max-w-[280px] rounded-lg bg-red-500/10 p-3 text-center text-xs text-red-400 md:max-w-[300px] md:text-sm">
              {message}
            </div>
          )}

        </div>

        <div className="flex w-full items-center justify-between px-6 py-4 text-[10px] font-semibold text-gray-400 md:px-8 md:text-xs">
          <span>© 2026 Spurvancelab</span>
          <LanguageSelector />
        </div>
      </div>

      {/* Right Section - White with Gradients (FIXED) */}

        <GradientImage />

    </div>
  );
}