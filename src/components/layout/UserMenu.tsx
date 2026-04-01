"use client";

import { useRouter } from "next/navigation";
import { User, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDropdown } from "@/hooks/useDropdown";

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isOpen, toggle, close, ref } = useDropdown();

  if (!user) return null;

  const handleLogout = () => {
    close();
    logout();
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-elevated shadow-lg hover:bg-surface-highlight transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {user.username[0].toUpperCase()}
        </div>
        <span className="text-sm text-text-secondary max-w-[120px] truncate pr-1">
          {user.username}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-elevated rounded-lg shadow-xl py-1 border border-white/5">
          <button
            onClick={() => { close(); router.push("/profile"); }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-colors"
          >
            <User size={15} />
            Profile
          </button>

          {user.role === "ADMIN" && (
            <button
              onClick={() => { close(); router.push("/admin"); }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-surface-highlight transition-colors"
            >
              <ShieldCheck size={15} />
              Admin
            </button>
          )}

          <div className="border-t border-white/10 my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-surface-highlight transition-colors"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
