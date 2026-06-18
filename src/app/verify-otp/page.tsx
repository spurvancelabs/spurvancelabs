'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "../../global.css";
import GradientImage from '@/components/GradientImage';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { verifyOTP, forgotPassword } from '@/lib/api/auth';

const RESEND_COOLDOWN = 60;

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);


  
  const verifyMutation = useMutation({
  mutationFn: verifyOTP,

  onSuccess: (data) => {
    toast.success('OTP verified successfully');

    router.push(
      `/reset-password?token=${encodeURIComponent(data.resetToken)}`
    );
  },

  onError: (error: any) => {
    toast.error(error.error || 'Invalid OTP');

    if (error.status === 429) {
      setRateLimited(true);
    }

    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  },
});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetTimer = useCallback(() => {
    setCooldown(RESEND_COOLDOWN);
  }, []);

  // MOVE handleVerify HERE - before the useEffect that uses it
 const handleVerify = (otpCode: string) => {
  setError('');

  verifyMutation.mutate({
    email,
    otp: otpCode,
  });
};
const resendMutation = useMutation({
  mutationFn: forgotPassword,

  onSuccess: () => {
    toast.success('OTP resent successfully');
    resetTimer();
  },

  onError: (error: any) => {
    if (error.status === 429) {
      setRateLimited(true);
      return;
    }

    toast.error(error.error || 'Failed to resend OTP');
  },
});
  // Now this useEffect can access handleVerify
useEffect(() => {
  const otpString = otp.join('');

  if (otpString.length === 6 && !verifyMutation.isPending) {
    handleVerify(otpString);
  }
}, [otp]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty input or last filled
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

const handleResend = () => {
  if (
    cooldown > 0 ||
    resendMutation.isPending
  )
    return;

  setError('');

  resendMutation.mutate({
    email,
  });
};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-black">
      <GradientImage />

      <div className="relative z-10 flex w-full flex-col bg-black text-white md:w-1/2 md:min-h-screen">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-5 md:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Verify OTP</h1>
            <p className="mt-2 text-xs text-gray-300 md:text-sm">Enter the OTP sent to <strong>{email}</strong>.</p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`h-12 w-10 rounded-lg border-2 bg-[#181818] text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-14 md:w-12 md:text-xl ${
                  verifyMutation.isPending ? 'opacity-50' : ''
                } ${error ? 'border-red-500' : 'border-gray-700'}`}
                disabled={verifyMutation.isPending}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {verifyMutation.isPending && (
            <div className="mt-2 text-xs text-gray-400">Verifying...</div>
          )}

          {error && (
            <div className="mt-4 w-full max-w-[280px] rounded-lg bg-red-500/10 p-3 text-center text-xs text-red-400 md:max-w-[300px] md:text-sm">
              {error}
              {rateLimited && cooldown > 0 && (
                <p className="mt-1 text-yellow-400">Too many attempts. Wait {formatTime(cooldown)} before retrying.</p>
              )}
            </div>
          )}

      
       
          <div className="text-center">
            {cooldown > 0 ? (
              <p className="text-xs text-gray-300 md:text-sm">
                Resend OTP in <span className="font-mono font-semibold text-white">{formatTime(cooldown)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendMutation.isPending}
                className="text-xs font-semibold text-white underline hover:text-gray-300 disabled:opacity-50 md:text-sm"
              >
                {resendMutation.isPending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-4 text-[10px] font-semibold text-gray-400 md:px-8 md:text-xs">
          <span>© 2026 Spurvancelab</span>
        </div>
      </div>

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