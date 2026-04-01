"use client";

import { useEffect, useState } from "react";
import { getPlaylistsApi, addSongToPlaylistApi, createPlaylistApi } from "@/lib/api/playlists.api";
import type { PlaylistResponse, SongResponse } from "@/types";
import { X, PlusCircle, ListMusic } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  song: SongResponse;
  onClose: () => void;
}

export default function AddToPlaylistModal({ song, onClose }: Props) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      getPlaylistsApi().then((r) => setPlaylists(r.data ?? []));
    }
  }, [user]);

  const handleAdd = async (playlistId: string) => {
    const res = await addSongToPlaylistApi(playlistId, song.id);
    if (res.success) {
      setMessage("Added to playlist!");
    } else {
      setMessage(res.message || "Could not add (may already exist)");
    }
    setTimeout(onClose, 1200);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await createPlaylistApi(newName.trim());
    if (res.success && res.data) {
      await addSongToPlaylistApi(res.data.id, song.id);
      setMessage("Playlist created and song added!");
      setTimeout(onClose, 1200);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface-elevated rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Add to playlist</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-text-secondary mb-4 line-clamp-1">
          {song.title} — {song.artist}
        </p>

        {message ? (
          <p className="text-primary text-sm text-center py-4">{message}</p>
        ) : !user ? (
          <p className="text-text-muted text-sm text-center py-4">
            Log in to add to a playlist
          </p>
        ) : (
          <>
            <div className="space-y-1 max-h-52 overflow-y-auto mb-4">
              {playlists.length === 0 ? (
                <p className="text-text-muted text-xs text-center py-3">No playlists yet</p>
              ) : (
                playlists.map((pl) => (
                  <button key={pl.id} onClick={() => handleAdd(pl.id)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-surface-highlight text-left transition-colors">
                    <ListMusic size={16} className="text-text-muted shrink-0" />
                    <span className="text-sm line-clamp-1">{pl.name}</span>
                    <span className="text-xs text-text-muted ml-auto shrink-0">{pl.songs.length} songs</span>
                  </button>
                ))
              )}
            </div>

            {creating ? (
              <form onSubmit={handleCreate} className="flex gap-2">
                <input autoFocus type="text" placeholder="New playlist name..."
                  value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-surface-highlight px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary text-text-primary" />
                <button type="submit"
                  className="px-3 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-primary-dark">
                  Create
                </button>
              </form>
            ) : (
              <button onClick={() => setCreating(true)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-primary text-sm hover:bg-surface-highlight transition-colors">
                <PlusCircle size={16} />
                New playlist
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
