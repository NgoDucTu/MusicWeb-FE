import { useState } from "react";
import { Lock } from "lucide-react";
import { changePasswordApi } from "@/lib/api/users.api";

const FIELDS = [
  { key: "current", placeholder: "Current password" },
  { key: "next", placeholder: "New password" },
  { key: "confirm", placeholder: "Confirm new password" },
] as const;

type FormKey = (typeof FIELDS)[number]["key"];

export default function ChangePasswordForm() {
  const [form, setForm] = useState<Record<FormKey, string>>({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (form.next !== form.confirm) {
      setError("New passwords do not match");
      return;
    }
    const res = await changePasswordApi(form.current, form.next);
    if (res.success) {
      setSuccess(true);
      setForm({ current: "", next: "", confirm: "" });
    } else {
      setError(res.message || "Current password is incorrect");
    }
  };

  return (
    <div className="bg-surface-elevated rounded-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Lock size={16} />
        Change password
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {FIELDS.map(({ key, placeholder }) => (
          <input
            key={key}
            type="password"
            placeholder={placeholder}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary text-text-primary"
            required
          />
        ))}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-primary text-xs">Password changed successfully!</p>}
        <button
          type="submit"
          className="w-full py-2.5 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
