"use client";

import { useEffect, useState } from "react";
import { getSongsApi, deleteSongApi } from "@/lib/api/songs.api";
import type { SongResponse } from "@/types";
import SongRow from "@/components/songs/SongRow";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import UploadSongModal from "@/components/songs/UploadSongModal";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SongsPage() {
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<SongResponse | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const { user } = useAuth();

  const load = async () => {
    try {
      const res = await getSongsApi();
      setSongs(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (song: SongResponse) => {
    if (!confirm(`Xóa bài "${song.title}"?`)) return;
    const res = await deleteSongApi(song.id);
    if (res.success) setSongs((prev) => prev.filter((s) => s.id !== song.id));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tất cả bài hát</h1>
        {user?.role === "ADMIN" && (
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-black font-semibold text-sm hover:bg-primary-dark transition-colors">
            <Upload size={16} />
            Tải lên
          </button>
        )}
      </div>

      <div className="space-y-1">
        {songs.length === 0 ? (
          <p className="text-text-muted text-sm py-10 text-center">Chưa có bài hát nào</p>
        ) : (
          songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} queue={songs}
              onAddToPlaylist={(s) => setSelectedSong(s)}
              showDelete={user?.role === "ADMIN"}
              onDelete={handleDelete} />
          ))
        )}
      </div>

      {selectedSong && (
        <AddToPlaylistModal song={selectedSong} onClose={() => setSelectedSong(null)} />
      )}
      {showUpload && (
        <UploadSongModal onClose={() => setShowUpload(false)} onSuccess={() => { setShowUpload(false); load(); }} />
      )}
    </div>
  );
}
