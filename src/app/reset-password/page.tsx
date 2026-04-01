"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordApi } from "@/lib/api/auth.api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError("Link không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu lại.");
  }, [token]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await resetPasswordApi(token, form.newPassword);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setError(res.message || "Link không hợp lệ hoặc đã hết hạn");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-primary">MusicApp</span>
          <p className="text-text-secondary text-sm mt-2">Đặt lại mật khẩu</p>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-text-primary font-medium">Đặt lại mật khẩu thành công!</p>
              <p className="text-text-secondary text-sm">Đang chuyển hướng về trang đăng nhập...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Mật khẩu mới</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full bg-surface-highlight px-4 py-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
                  required
                  autoFocus
                  disabled={!token}
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full bg-surface-highlight px-4 py-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={!token}
                />
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
              </button>

              <p className="text-center text-sm text-text-secondary">
                <Link href="/login" className="text-primary hover:underline">Quay lại đăng nhập</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
