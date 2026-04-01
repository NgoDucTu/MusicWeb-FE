"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordApi } from "@/lib/api/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi(email.trim());
      setSent(true);
    } catch {
      setError("An error occurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-primary">MusicApp</span>
          <p className="text-text-secondary text-sm mt-2">Forgot password</p>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-primary font-medium">Check your inbox</p>
              <p className="text-text-secondary text-sm">
                If <span className="text-text-primary">{email}</span> exists, we have sent a password reset link. The link is valid for <strong>15 minutes</strong>.
              </p>
              <Link href="/login" className="block text-primary text-sm hover:underline mt-2">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-text-secondary text-sm">
                Enter your registered email and we will send you a password reset link.
              </p>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-highlight px-4 py-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
                  required
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-text-secondary">
                <Link href="/login" className="text-primary hover:underline">Back to login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
