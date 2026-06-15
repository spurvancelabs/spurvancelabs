'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "../../global.css";
import GradientImage from '@/components/GradientImage';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-black">
      <div className="relative z-10 flex w-full flex-col bg-black text-white md:w-1/2 md:min-h-screen">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-5 md:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Verify OTP</h1>
            <p className="mt-2 text-xs text-gray-300 md:text-sm">Enter the OTP sent to <strong>{email}</strong>.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-[280px] flex-col gap-4 md:max-w-[300px]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-xs font-medium md:text-sm">OTP Code</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-10 w-full rounded-lg border-none bg-[#181818] pl-4 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-11 md:text-sm"
                required
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 md:h-11 md:text-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {error && (
            <div className="mt-4 w-full max-w-[280px] rounded-lg bg-red-500/10 p-3 text-center text-xs text-red-400 md:max-w-[300px] md:text-sm">
              {error}
            </div>
          )}

          <p className="text-center text-xs text-gray-300 md:text-sm">
            <a href="/forgot-password" className="font-semibold text-white underline hover:text-gray-300">Resend OTP</a>
          </p>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-4 text-[10px] font-semibold text-gray-400 md:px-8 md:text-xs">
          <span>© 2026 Spurvancelab</span>
        </div>
      </div>

      <GradientImage />
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full flex-col md:flex-row bg-black items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}