"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerApi } from "@/lib/api/auth.api";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await registerApi(form.username, form.email, form.password);
      if (res.success && res.data) {
        await setAuth(res.data.token);
        router.push("/");
      } else {
        setError(res.message || "Đăng ký thất bại");
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
          <p className="text-text-secondary text-sm mt-2">Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-elevated rounded-2xl p-8 space-y-4">
          {[
            { label: "Tên đăng nhập", key: "username", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Mật khẩu", key: "password", type: "password" },
            { label: "Xác nhận mật khẩu", key: "confirm", type: "password" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm text-text-secondary mb-1.5">{label}</label>
              <input type={type} value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-surface-highlight px-4 py-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
                required />
            </div>
          ))}

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm">
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <p className="text-center text-sm text-text-secondary">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary hover:underline">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
