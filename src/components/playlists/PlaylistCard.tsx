"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ListMusic } from "lucide-react";
import { songThumbnailUrl } from "@/lib/api/songs.api";
import { usePlayer } from "@/contexts/PlayerContext";
import type { PlaylistResponse } from "@/types";

interface Props {
  playlist: PlaylistResponse;
}

export default function PlaylistCard({ playlist }: Props) {
  const { play } = usePlayer();
  const firstSong = playlist.songs[0];

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (firstSong) play(firstSong, playlist.songs);
  };

  return (
    <Link href={`/playlists/${playlist.id}`}
      className="bg-surface-elevated hover:bg-surface-highlight rounded-lg p-4 transition-colors group block">
      <div className="relative mb-4 rounded overflow-hidden aspect-square bg-surface-highlight">
        {firstSong?.thumbnailUrl ? (
          <Image
            src={songThumbnailUrl(firstSong.id)}
            alt={playlist.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <ListMusic size={40} />
          </div>
        )}
        {firstSong && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
            <button onClick={handlePlay}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play size={18} className="text-black ml-0.5" />
            </button>
          </div>
        )}
      </div>
      <p className="font-semibold text-sm line-clamp-1 text-text-primary">{playlist.name}</p>
      <p className="text-xs text-text-secondary mt-1">{playlist.songs.length} songs</p>
    </Link>
  );
}
