"use client";

import { usePlayer } from "@/contexts/PlayerContext";
import { songThumbnailUrl } from "@/lib/api/songs.api";
import {
  Play, Pause, SkipBack, SkipForward,
  Repeat, Repeat1, Shuffle, Volume2, VolumeX,
} from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    currentSong, isPlaying, currentTime, duration,
    volume, repeat, shuffle,
    togglePlay, next, prev, seek, setVolume, toggleRepeat, toggleShuffle,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-surface-elevated border-t border-surface-highlight flex items-center justify-center">
        <p className="text-text-muted text-sm">No song playing</p>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-surface-highlight px-4 h-[90px] flex items-center gap-4 z-50">
      {/* Song info */}
      <div className="flex items-center gap-3 w-64 shrink-0">
        <div className="w-14 h-14 rounded overflow-hidden bg-surface-highlight shrink-0">
          {currentSong.thumbnailUrl ? (
            <Image
              src={songThumbnailUrl(currentSong.id)}
              alt={currentSong.title}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">♪</div>
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-text-primary line-clamp-1">{currentSong.title}</p>
          <p className="text-xs text-text-secondary line-clamp-1">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 gap-2">
        <div className="flex items-center gap-5">
          <button onClick={toggleShuffle}
            className={clsx("transition-colors", shuffle ? "text-primary" : "text-text-secondary hover:text-text-primary")}>
            <Shuffle size={16} />
          </button>
          <button onClick={prev} className="text-text-secondary hover:text-text-primary transition-colors">
            <SkipBack size={20} />
          </button>
          <button onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
            {isPlaying
              ? <Pause size={18} className="text-black" />
              : <Play size={18} className="text-black ml-0.5" />}
          </button>
          <button onClick={next} className="text-text-secondary hover:text-text-primary transition-colors">
            <SkipForward size={20} />
          </button>
          <button onClick={toggleRepeat}
            className={clsx("transition-colors", repeat !== "none" ? "text-primary" : "text-text-secondary hover:text-text-primary")}>
            {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-xs text-text-muted w-8 text-right">{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 bg-surface-hover rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - rect.left) / rect.width) * duration);
            }}
          >
            <div
              className="h-full bg-text-secondary group-hover:bg-primary rounded-full transition-colors relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-text-muted w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-36 justify-end shrink-0">
        <button onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
          className="text-text-secondary hover:text-text-primary transition-colors">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input type="range" min={0} max={1} step={0.01} value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-primary" />
      </div>
    </div>
  );
}
