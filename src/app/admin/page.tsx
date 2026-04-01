"use client";

import { useEffect, useState } from "react";
import { getUsersApi } from "@/lib/api/users.api";
import { getSongsApi, deleteSongApi } from "@/lib/api/songs.api";
import EditSongModal from "@/components/songs/EditSongModal";
import { getCategoriesApi, type CategoryResponse } from "@/lib/api/categories.api";
import type { UserResponse, SongResponse } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import UploadSongModal from "@/components/songs/UploadSongModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTabBar from "@/components/admin/AdminTabBar";
import AdminSongsTab from "@/components/admin/AdminSongsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminCategoriesTab from "@/components/admin/AdminCategoriesTab";
import { Upload, Users, Music2, Tag } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [tab, setTab] = useState<"songs" | "users" | "categories">("songs");
  const [showUpload, setShowUpload] = useState(false);
  const [editingSong, setEditingSong] = useState<SongResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") router.replace("/");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    Promise.all([getUsersApi(), getSongsApi(), getCategoriesApi()])
      .then(([u, s, c]) => {
        setUsers(u.data ?? []);
        setSongs(s.data ?? []);
        setCategories(c.data ?? []);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading || user?.role !== "ADMIN") return <LoadingSpinner />;

  const handleDelete = async (song: SongResponse) => {
    if (!confirm(`Delete "${song.title}"?`)) return;
    const res = await deleteSongApi(song.id);
    if (res.success) setSongs((s) => s.filter((x) => x.id !== song.id));
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-black font-semibold text-sm hover:bg-primary-dark"
        >
          <Upload size={16} />
          Upload song
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <AdminStatCard icon={Music2} count={songs.length} label="Songs" />
        <AdminStatCard icon={Users} count={users.length} label="Users" />
        <AdminStatCard icon={Tag} count={categories.length} label="Categories" />
      </div>

      <AdminTabBar active={tab} onChange={setTab} />

      {tab === "songs" && <AdminSongsTab songs={songs} onDelete={handleDelete} onEdit={setEditingSong} />}
      {tab === "users" && <AdminUsersTab users={users} />}
      {tab === "categories" && (
        <AdminCategoriesTab categories={categories} onChange={setCategories} />
      )}

      {editingSong && (
        <EditSongModal
          song={editingSong}
          onClose={() => setEditingSong(null)}
          onSuccess={async () => {
            setEditingSong(null);
            const res = await getSongsApi();
            setSongs(res.data ?? []);
          }}
        />
      )}

      {showUpload && (
        <UploadSongModal
          onClose={() => setShowUpload(false)}
          onSuccess={async () => {
            setShowUpload(false);
            const res = await getSongsApi();
            setSongs(res.data ?? []);
          }}
        />
      )}
    </div>
  );
}
