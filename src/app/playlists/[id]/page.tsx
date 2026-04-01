"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPlaylistApi,
  removeSongFromPlaylistApi,
  reorderPlaylistSongsApi,
  renamePlaylistApi,
} from "@/lib/api/playlists.api";
import { songThumbnailUrl } from "@/lib/api/songs.api";
import type { PlaylistResponse, SongResponse } from "@/types";
import SongRow from "@/components/songs/SongRow";
import { usePlayer } from "@/contexts/PlayerContext";
import { Play, Pause, ListMusic, GripVertical, Pencil, Check, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<number | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const { play, togglePlay, currentSong, isPlaying } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    getPlaylistApi(id)
      .then((r) => setPlaylist(r.data ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  const isPlaylistPlaying =
    isPlaying && playlist?.songs.some((s) => s.id === currentSong?.id);

  const handlePlayAll = () => {
    if (!playlist?.songs.length) return;
    if (isPlaylistPlaying) togglePlay();
    else play(playlist.songs[0], playlist.songs);
  };

  const handleRemove = async (song: SongResponse) => {
    if (!playlist) return;
    const res = await removeSongFromPlaylistApi(playlist.id, song.id);
    if (res.success) {
      setPlaylist((p) =>
        p ? { ...p, songs: p.songs.filter((s) => s.id !== song.id) } : p
      );
    }
  };

  const handleRenameStart = () => {
    setRenameValue(playlist?.name ?? "");
    setRenaming(true);
  };

  const handleRenameSubmit = async () => {
    if (!playlist || !renameValue.trim()) return;
    const res = await renamePlaylistApi(playlist.id, renameValue.trim());
    if (res.success && res.data) {
      setPlaylist((p) => p ? { ...p, name: res.data!.name } : p);
    }
    setRenaming(false);
  };

  const handleDrop = async (dropIndex: number) => {
    if (dragging === null || dragging === dropIndex || !playlist) return;
    const songs = [...playlist.songs];
    const [moved] = songs.splice(dragging, 1);
    songs.splice(dropIndex, 0, moved);
    setPlaylist({ ...playlist, songs });
    setDragging(null);
    await reorderPlaylistSongsApi(playlist.id, songs.map((s) => s.id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!playlist) {
    return <p className="text-text-muted text-center py-20">Playlist not found</p>;
  }

  const firstSong = playlist.songs[0];

  return (
    <div className="pb-24">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-44 h-44 rounded-lg overflow-hidden bg-surface-highlight shrink-0">
          {firstSong?.thumbnailUrl ? (
            <Image src={songThumbnailUrl(firstSong.id)} alt={playlist.name}
              width={176} height={176} className="object-cover w-full h-full" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <ListMusic size={56} />
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Playlist</p>
          {renaming ? (
            <div className="flex items-center gap-2 mb-4">
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); if (e.key === "Escape") setRenaming(false); }}
                className="text-4xl font-black bg-transparent border-b-2 border-primary outline-none text-text-primary w-full"
              />
              <button onClick={handleRenameSubmit} className="text-primary hover:text-primary-dark shrink-0"><Check size={22} /></button>
              <button onClick={() => setRenaming(false)} className="text-text-muted hover:text-text-primary shrink-0"><X size={22} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4 group/title">
              <h1 className="text-4xl font-black">{playlist.name}</h1>
              <button onClick={handleRenameStart}
                className="opacity-0 group-hover/title:opacity-100 text-text-muted hover:text-text-primary transition-opacity">
                <Pencil size={18} />
              </button>
            </div>
          )}
          <p className="text-text-secondary text-sm">{playlist.songs.length} songs</p>
          <button onClick={handlePlayAll} disabled={!playlist.songs.length}
            className="mt-5 w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl">
            {isPlaylistPlaying
              ? <Pause size={24} className="text-black" />
              : <Play size={24} className="text-black ml-1" />}
          </button>
        </div>
      </div>

      {playlist.songs.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-10">
          Playlist is empty. Add songs from the Songs page.
        </p>
      ) : (
        <div className="space-y-1">
          {playlist.songs.map((song, i) => (
            <div key={song.id} draggable
              onDragStart={() => setDragging(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="flex items-center group">
              <GripVertical size={16}
                className="text-text-muted opacity-0 group-hover:opacity-100 cursor-grab shrink-0 mr-1" />
              <div className="flex-1">
                <SongRow song={song} index={i} queue={playlist.songs}
                  onDelete={user ? handleRemove : undefined}
                  showDelete={!!user} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
