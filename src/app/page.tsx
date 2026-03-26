"use client";

import { useEffect, useState } from "react";
import { getSongsApi } from "@/lib/api/songs.api";
import type { SongResponse } from "@/types";
import SongCard from "@/components/songs/SongCard";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function HomePage() {
  const [allSongs, setAllSongs] = useState<SongResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<SongResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const songsRes = await getSongsApi();
        setAllSongs(songsRes.data ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const recent = allSongs.slice(0, 6);

  return (
    <div className="pb-24 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Mới thêm gần đây</h2>
        {recent.length === 0 ? (
          <p className="text-text-muted text-sm">Chưa có bài hát nào</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recent.map((song) => (
              <SongCard key={song.id} song={song} queue={recent} />
            ))}
          </div>
        )}
      </section>

      {selectedSong && (
        <AddToPlaylistModal song={selectedSong} onClose={() => setSelectedSong(null)} />
      )}
    </div>
  );
}
