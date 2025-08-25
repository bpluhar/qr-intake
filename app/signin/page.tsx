"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [lastAction, setLastAction] = useState<"signIn" | "signUp">("signIn");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const signedIn = useQuery(api.functions.users.isSignedIn);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Redirect automatically once auth state flips true
  useEffect(() => {
    if (signedIn) {
      console.log("signedIn", signedIn);
      router.replace("/dashboard");
    }
  }, [signedIn, router]);

  return (
    <main className="min-h-screen bg-[#0b1217] text-slate-200 flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#3ECF8E] hover:underline"
        >
          <span>{"< Back to Home"}</span>
        </Link>
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
            <h1 className="text-xl font-semibold">Welcome</h1>
            <p className="mt-1 text-sm text-slate-400">Sign in or create an account</p>
          </div>

          {/* Form */}
          <form
            className="px-8 pb-8 pt-2 space-y-4"
            ref={formRef}
            onSubmit={async (event) => {
              event.preventDefault();
              if (!formRef.current) return;
              const formData = new FormData(formRef.current);
              formData.set("flow", "signIn");
              setLastAction("signIn");
              setPending(true);
              setError(null);
              try {
                await signIn("password", formData);
              } catch (err) {
                const code = extractAuthErrorCode(err);
                const raw = (err as Error)?.message ?? String(err);
                setError(code === "unknown" ? raw : (ERROR_TEXT[code] ?? raw));
              } finally {
                setPending(false);
              }
            }}
          >

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
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  onClick={() => setLastAction("signIn")}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-white
                             bg-[#249F73] hover:bg-[#1E8761] disabled:opacity-70 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
                >
                  {pending && lastAction === "signIn" ? "Signing in..." : "Sign in"}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={async () => {
                    if (!formRef.current) return;
                    const formData = new FormData(formRef.current);
                    formData.set("flow", "signUp");
                    setLastAction("signUp");
                    setPending(true);
                    setError(null);
                    try {
                      await signIn("password", formData);
                    } catch (err) {
                      const code = extractAuthErrorCode(err);
                      const raw = (err as Error)?.message ?? String(err);
                      setError(code === "unknown" ? raw : (ERROR_TEXT[code] ?? raw));
                    } finally {
                      setPending(false);
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium
                             text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 disabled:opacity-70 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 focus:ring-offset-[#0b1217]"
                >
                  {pending && lastAction === "signUp" ? "Creating account..." : "Sign up"}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-400" role="alert">{error}</p>
            )}
          </form>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by industry-standard security. By continuing you agree to
          our terms.
        </p>
      </div>
    </main>
  );
}

function extractAuthErrorCode(err: unknown) {
  const msg = (err as Error)?.message ?? String(err);
  if (/InvalidSecret/i.test(msg)) return "invalid_password";
  if (/CredentialsSignin/i.test(msg)) return "invalid_credentials";
  if (/already exists/i.test(msg)) return "account_exists";
  if (/Cannot read properties of null.*_id/i.test(msg)) return "orphan_account";
  if (/UserNotFound|No such user|UnknownAccount|InvalidAccountId/i.test(msg)) return "user_not_found";
  return "unknown";
}

const ERROR_TEXT: Record<string, string> = {
  invalid_password: "Incorrect password. Please try again.",
  invalid_credentials: "Invalid email or password.",
  account_exists: "An account with this email already exists. Please sign in instead or double check your password.",
  orphan_account: "Error in account settings. Please contact support.",
  user_not_found: "No account found for that email.",
  unknown: "Something went wrong. Please try again.",
};