'use client';

import React from 'react';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "../../global.css"
import GradientImage from '@/components/GradientImage';
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        if (data.error === 'Validation failed' && data.issues) {
          const mapped: Record<string, string> = {};
          for (const [field, messages] of Object.entries(data.issues)) {
            mapped[field] = (messages as string[] | undefined)?.[0] || String(messages);
          }
          setErrors(mapped);
        } else {
          setMessage(data.error);
        }
      }
    } catch (err) {
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row bg-black">
      <GradientImage />
        <div className="relative z-10 flex w-full flex-col bg-black text-white md:w-1/2 md:min-h-screen">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-5 md:px-8">
            <div className="text-center max-w-[280px] md:max-w-[300px]">
              <h1 className="text-2xl font-bold md:text-3xl">Invalid Link</h1>
              <p className="mt-2 text-xs text-gray-300 md:text-sm">No reset token found. Please request a new password reset.</p>
              <a href="/forgot-password" className="inline-block mt-4 text-blue-600 hover:text-blue-500 underline">Request new link</a>
            </div>
          </div>
          <div className="flex w-full items-center justify-center px-6 py-4 text-[10px] font-semibold text-gray-400 md:px-8 md:text-xs">
            <span>© 2026 Spurvancelab</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-black">
          <GradientImage />

      <div className="relative z-10 flex w-full flex-col bg-black text-white md:w-1/2 md:min-h-screen">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-5 md:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Reset Password</h1>
            <p className="mt-2 text-xs text-gray-300 md:text-sm">Enter your new password below.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-[280px] flex-col gap-4 md:max-w-[300px]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium md:text-sm">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Min 8 chars, uppercase, number, symbol"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className="h-10 w-full rounded-lg border-none bg-[#181818] pl-4 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-11 md:text-sm"
                required
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-medium md:text-sm">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 w-full rounded-lg border-none bg-[#181818] pl-4 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-11 md:text-sm"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 md:h-11 md:text-sm"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 w-full max-w-[280px] rounded-lg p-3 text-center text-xs md:max-w-[300px] md:text-sm ${message.includes('Something went wrong') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {message}
            </div>
          )}

          <p className="text-center text-xs text-gray-300 md:text-sm">
            <a href="/login" className="font-semibold text-white underline hover:text-gray-300">Back to login</a>
          </p>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-4 text-[10px] font-semibold text-gray-400 md:px-8 md:text-xs">
          <span>© 2026 Spurvancelab</span>
        </div>
      </div>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full flex-col md:flex-row bg-black items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
