"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Music2,
  ListMusic,
  User,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/songs", label: "Songs", icon: Music2 },
  { href: "/playlists", label: "Playlists", icon: ListMusic },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-60 bg-black flex flex-col py-6 px-4 shrink-0">
      {/* Logo */}
      <div className="mb-8 px-2">
        <span className="text-2xl font-bold text-primary">MusicApp</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "text-text-primary bg-surface-highlight"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-highlight"
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}

        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mt-2",
              pathname.startsWith("/admin")
                ? "text-primary bg-surface-highlight"
                : "text-text-secondary hover:text-primary hover:bg-surface-highlight"
            )}
          >
            <ShieldCheck size={20} />
            Admin
          </Link>
        )}
      </nav>

      {/* User at bottom */}
      <div className="mt-auto">
        {user ? (
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-colors"
          >
            <User size={20} />
            <span className="truncate">{user.username}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary-dark transition-colors"
          >
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}
