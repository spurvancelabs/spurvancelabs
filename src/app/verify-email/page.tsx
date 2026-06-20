// app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { createBrowserClient } from '@/lib/supabase/client'; // Use named import
import "../../global.css"
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(); // Create new instance
  const [status, setStatus] = useState<'checking' | 'verified' | 'error'>('checking');
  const [message, setMessage] = useState('Waiting for email verification...');
  const [email, setEmail] = useState<string>('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Get email from URL if provided
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    const checkVerification = async () => {
      try {
        // Check if we have tokens in URL (user just clicked verification link)
        const hash = window.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.replace('#', ''));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const type = params.get('type');

          if (access_token && refresh_token && type === 'email_confirmation') {
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

              if (error) throw error;

              if (data.session?.user?.email_confirmed_at) {
                setStatus('verified');
                setMessage('Email verified successfully!');

                await fetch('/api/auth/session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ access_token, refresh_token }),
                });

                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 100);
                return;
              }
            } catch (error: any) {
              console.error('Verification error:', error);
              setStatus('error');
              setMessage(error.message || 'Verification failed');
              return;
            }
          }
        }

        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email_confirmed_at) {
          setStatus('verified');
          setMessage('Email already verified!');

          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }),
          });
          
          router.push('/dashboard');
          return;
        }

        // If no verification detected, show waiting state
        setStatus('checking');
        setMessage('Waiting for email verification...');
        
      } catch (error) {
        console.error('Check verification error:', error);
        setStatus('error');
        setMessage('Failed to check verification status');
      }
    };

    checkVerification();

    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (!hash) return;

      const params = new URLSearchParams(hash.replace('#', ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      if (access_token && refresh_token && type === 'email_confirmation') {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) throw error;

          if (data.session?.user?.email_confirmed_at) {
            setStatus('verified');
            setMessage('Email verified successfully!');

            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token, refresh_token }),
            });

            router.push('/dashboard');
          }
        } catch (error: any) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Verification failed');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user?.email_confirmed_at) {
        setStatus('verified');
        setMessage('Email verified successfully!');

        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        }).then(() => {
          window.location.href = '/dashboard';
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router, supabase, searchParams]);

  const handleResendVerification = async () => {
    try {
      const userEmail = email || searchParams.get('email');
      
      if (!userEmail) {
        alert('Email not found. Please try signing up again.');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) throw error;

      alert('Verification email resent! Check your inbox.');
      setMessage('A new verification email has been sent to your inbox.');
    } catch (error: any) {
      console.error('Resend error:', error);
      alert(error.message || 'Failed to resend verification');
    }
  };

  const handleRedirect = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <div className="w-full max-w-md text-center text-white p-8">
        {status === 'checking' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div>
              <h1 className="text-2xl font-bold">Verify Your Email</h1>
              <p className="mt-2 text-sm text-gray-400">{message}</p>
              {email && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400">Verification link sent to:</p>
                  <p className="text-sm font-medium text-blue-400">{email}</p>
                </div>
              )}
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-xs text-gray-500">📧 Check your inbox and spam folder</p>
                <p className="text-xs text-gray-500">⏱️ The link expires in 24 hours</p>
              </div>
              <button
                onClick={handleResendVerification}
                className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Resend verification email
              </button>
            </div>
          </div>
        )}

        {status === 'verified' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-400">✓ Verified!</h1>
              <p className="mt-2 text-sm text-gray-400">{message}</p>
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">
                  Redirecting to dashboard in 
                  <span className="text-blue-400 font-bold ml-1">{countdown}s</span>
                </p>
              </div>
              <button
                onClick={handleRedirect}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Go to dashboard now →
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircleIcon className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">Verification Failed</h1>
              <p className="mt-2 text-sm text-gray-400">{message}</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={handleResendVerification}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Resend Verification Email
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}