"use client";

import { useEffect, useState } from "react";
import { getPlaylistsApi, createPlaylistApi, deletePlaylistApi } from "@/lib/api/playlists.api";
import type { PlaylistResponse } from "@/types";
import PlaylistCard from "@/components/playlists/PlaylistCard";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const { user } = useAuth();

  const load = async () => {
    try {
      const res = await getPlaylistsApi();
      setPlaylists(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await createPlaylistApi(newName.trim());
    if (res.success && res.data) setPlaylists((p) => [res.data!, ...p]);
    setNewName("");
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa playlist này?")) return;
    const res = await deletePlaylistApi(id);
    if (res.success) setPlaylists((p) => p.filter((pl) => pl.id !== id));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Đăng nhập để xem danh sách phát</p>
          <a href="/login" className="px-6 py-2 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary-dark transition-colors">
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Danh sách phát</h1>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-black font-semibold text-sm hover:bg-primary-dark transition-colors">
          <PlusCircle size={16} />
          Tạo mới
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="flex items-center gap-3 mb-6 bg-surface-elevated rounded-lg p-4">
          <input autoFocus type="text" placeholder="Tên danh sách phát..."
            value={newName} onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-surface-highlight text-text-primary px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" className="px-4 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-primary-dark">Tạo</button>
          <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Hủy</button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="text-text-muted text-sm py-10 text-center">Bạn chưa có danh sách phát nào</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((pl) => (
            <div key={pl.id} className="relative group/card">
              <PlaylistCard playlist={pl} />
              <button onClick={() => handleDelete(pl.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-text-secondary hover:text-red-400 opacity-0 group-hover/card:opacity-100 transition-all z-10">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
