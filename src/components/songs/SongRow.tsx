"use client";

import Image from "next/image";
import { Play, Pause, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { songThumbnailUrl } from "@/lib/api/songs.api";
import { usePlayer } from "@/contexts/PlayerContext";
import type { SongResponse } from "@/types";
import { useDropdown } from "@/hooks/useDropdown";

interface Props {
  song: SongResponse;
  index?: number;
  queue?: SongResponse[];
  onAddToPlaylist?: (song: SongResponse) => void;
  onDelete?: (song: SongResponse) => void;
  showDelete?: boolean;
}

export default function SongRow({
  song,
  index,
  queue,
  onAddToPlaylist,
  onDelete,
  showDelete,
}: Props) {
  const { play, togglePlay, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;
  const { isOpen: menuOpen, toggle, close, ref: menuRef } = useDropdown();

  const handlePlay = () => {
    if (isActive) togglePlay();
    else play(song, queue);
  };

  const hasMenu = onAddToPlaylist || (showDelete && onDelete);

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-md hover:bg-surface-highlight group transition-colors">
      {/* Index / Play */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {isActive ? (
          <button onClick={handlePlay}>
            {isPlaying ? (
              <Pause size={16} className="text-primary" />
            ) : (
              <Play size={16} className="text-primary ml-0.5" />
            )}
          </button>
        ) : (
          <>
            <span className="text-text-muted text-sm group-hover:hidden">
              {index != null ? index + 1 : ""}
            </span>
            <button onClick={handlePlay} className="hidden group-hover:block">
              <Play size={16} className="text-text-primary ml-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded overflow-hidden bg-surface-highlight shrink-0">
        {song.thumbnailUrl ? (
          <Image
            src={songThumbnailUrl(song.id)}
            alt={song.title}
            width={40}
            height={40}
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-lg">
            ♪
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium line-clamp-1 ${isActive ? "text-primary" : "text-text-primary"}`}>
          {song.title}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1">{song.artist}</p>
      </div>

      {/* Genre */}
      <p className="text-xs text-text-muted hidden md:block w-24 text-right shrink-0">
        {song.genre}
      </p>

      {/* Context menu */}
      {hasMenu && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={toggle}
            className="p-1.5 rounded-full text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-8 bg-surface-highlight rounded-lg shadow-xl py-1 w-48 z-20">
              {onAddToPlaylist && (
                <button
                  onClick={() => { onAddToPlaylist(song); close(); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <PlusCircle size={15} />
                  Thêm vào playlist
                </button>
              )}
              {showDelete && onDelete && (
                <button
                  onClick={() => { onDelete(song); close(); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-surface-hover transition-colors"
                >
                  <Trash2 size={15} />
                  Xóa bài hát
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
