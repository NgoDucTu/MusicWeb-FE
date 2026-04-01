"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function ProfilePage() {
  const { user, isLoading, refreshUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto pb-24">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <ProfileAvatar user={user} onUploaded={refreshUser} />

      <ChangePasswordForm />

      <button
        onClick={() => { logout(); router.push("/login"); }}
        className="mt-4 w-full py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
