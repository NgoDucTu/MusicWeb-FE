"use client";

import UserMenu from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-end px-6 py-3 bg-surface/80 backdrop-blur sticky top-0 z-10">
      {user ? (
        <UserMenu />
      ) : (
        <a
          href="/login"
          className="text-sm font-semibold px-4 py-1.5 rounded-full bg-white text-black hover:scale-105 transition-transform"
        >
          Log in
        </a>
      )}
    </header>
  );
}
