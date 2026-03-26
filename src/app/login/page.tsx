"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginApi } from "@/lib/api/auth.api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(form.username, form.password);
      if (res.success && res.data) {
        await setAuth(res.data.token);
        router.push("/");
      } else {
        setError(res.message || "Đăng nhập thất bại");
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
          <p className="text-text-secondary text-sm mt-2">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-elevated rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Tên đăng nhập</label>
            <input type="text" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-surface-highlight px-4 py-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
              required autoFocus />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Mật khẩu</label>
            <input type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-surface-highlight px-4 py-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
              required />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p className="text-center text-sm text-text-secondary">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary hover:underline">Đăng ký</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
