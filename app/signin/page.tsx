'use client';

import React from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Flow = 'signIn' | 'signUp';

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<Flow>('signIn');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const signedIn = useQuery(api.users.isSignedIn);

  // Redirect automatically once auth state flips true
  React.useEffect(() => {
    if (signedIn) {
      router.replace('/dashboard');
    }
  }, [signedIn, router]);

  return (
    <main className="min-h-screen bg-[#0b1217] text-slate-200 flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#3ECF8E] hover:underline"
        >
          <span>{'< Back to Home'}</span>
        </a>
      </div>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800/70 ring-1 ring-slate-700">
              {/* Simple logo mark */}
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M12 3l7 5-7 5-7-5 7-5Zm0 8v10"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">
              {step === 'signIn' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {step === 'signIn'
                ? 'Sign in with your email and password'
                : 'Sign up with your email and a password'}
            </p>
          </div>

          {/* Form */}
          <form
            className="px-8 pb-8 pt-2 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setPending(true);
              setError(null);
              try {
                await signIn('password', formData);
                // Navigation handled by the signedIn effect above
              } catch (err: unknown) {
                if (err instanceof Error) {
                  setError(err.message);
                } else {
                  setError('Sign in failed');
                }
              } finally {
                setPending(false);
              }
            }}
          >
            <input name="flow" type="hidden" value={step} />

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={step === 'signIn' ? 'current-password' : 'new-password'}
                required
                className="block w-full rounded-md bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-white
                           bg-[#249F73] hover:bg-[#1E8761] disabled:opacity-70 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                {pending
                  ? step === 'signIn'
                    ? 'Signing in...'
                    : 'Creating account...'
                  : step === 'signIn'
                    ? 'Sign in'
                    : 'Sign up'}
              </button>

              <button
                type="button"
                onClick={() => setStep((s) => (s === 'signIn' ? 'signUp' : 'signIn'))}
                className="inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium
                           text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 focus:ring-offset-[#0b1217]"
              >
                {step === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400" role="alert">{error}</p>
            )}
          </form>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by industry-standard security. By continuing you agree to our terms.
        </p>
      </div>
    </main>
  );
}