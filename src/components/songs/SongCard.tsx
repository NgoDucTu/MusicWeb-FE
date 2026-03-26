"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { songThumbnailUrl } from "@/lib/api/songs.api";
import { usePlayer } from "@/contexts/PlayerContext";
import type { SongResponse } from "@/types";

interface Props {
  song: SongResponse;
  queue?: SongResponse[];
}

export default function SongCard({ song, queue }: Props) {
  const { play, currentSong } = usePlayer();
  const isActive = currentSong?.id === song.id;

  return (
    <div
      className="bg-surface-elevated hover:bg-surface-highlight rounded-lg p-4 cursor-pointer transition-colors group"
      onClick={() => play(song, queue)}
    >
      <div className="relative mb-4 rounded overflow-hidden aspect-square bg-surface-highlight">
        {song.thumbnailUrl ? (
          <Image
            src={songThumbnailUrl(song.id)}
            alt={song.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-text-muted">
            ♪
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Play size={18} className="text-black ml-0.5" />
          </button>
        </div>
      </div>
      <p className={`font-semibold text-sm line-clamp-1 ${isActive ? "text-primary" : "text-text-primary"}`}>
        {song.title}
      </p>
      <p className="text-xs text-text-secondary mt-1 line-clamp-1">{song.artist}</p>
    </div>
  );
}
