"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { songStreamUrl } from "@/lib/api/songs.api";
import type { SongResponse, PlayerState } from "@/types";

interface PlayerContextValue extends PlayerState {
  play: (song: SongResponse, queue?: SongResponse[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (song: SongResponse) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    queue: [],
    queueIndex: 0,
    isPlaying: false,
    volume: 0.8,
    currentTime: 0,
    duration: 0,
    repeat: "none",
    shuffle: false,
  });

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = state.volume;
  }, [state.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () =>
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onDuration = () =>
      setState((s) => ({ ...s, duration: audio.duration || 0 }));
    const onEnded = () => handleEnded();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.repeat, state.shuffle, state.queue, state.queueIndex]);

  const handleEnded = useCallback(() => {
    setState((s) => {
      if (s.repeat === "one") {
        audioRef.current?.play();
        return s;
      }
      if (s.repeat === "all" || s.queueIndex < s.queue.length - 1) {
        const nextIdx = s.shuffle
          ? Math.floor(Math.random() * s.queue.length)
          : (s.queueIndex + 1) % s.queue.length;
        const nextSong = s.queue[nextIdx];
        if (audioRef.current) {
          audioRef.current.src = songStreamUrl(nextSong.id);
          audioRef.current.play();
        }
        return { ...s, currentSong: nextSong, queueIndex: nextIdx, isPlaying: true };
      }
      return { ...s, isPlaying: false };
    });
  }, []);

  const play = useCallback((song: SongResponse, queue?: SongResponse[]) => {
    const q = queue ?? [song];
    const idx = q.findIndex((s) => s.id === song.id);
    setState((s) => ({
      ...s,
      currentSong: song,
      queue: q,
      queueIndex: idx >= 0 ? idx : 0,
      isPlaying: true,
    }));
    if (audioRef.current) {
      audioRef.current.src = songStreamUrl(song.id);
      audioRef.current.play();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !state.currentSong) return;
    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, [state.isPlaying, state.currentSong]);

  const next = useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;
      const nextIdx = s.shuffle
        ? Math.floor(Math.random() * s.queue.length)
        : (s.queueIndex + 1) % s.queue.length;
      const nextSong = s.queue[nextIdx];
      if (audioRef.current) {
        audioRef.current.src = songStreamUrl(nextSong.id);
        audioRef.current.play();
      }
      return { ...s, currentSong: nextSong, queueIndex: nextIdx, isPlaying: true };
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;
      if (s.currentTime > 3) {
        audioRef.current!.currentTime = 0;
        return s;
      }
      const prevIdx =
        s.queueIndex === 0 ? s.queue.length - 1 : s.queueIndex - 1;
      const prevSong = s.queue[prevIdx];
      if (audioRef.current) {
        audioRef.current.src = songStreamUrl(prevSong.id);
        audioRef.current.play();
      }
      return { ...s, currentSong: prevSong, queueIndex: prevIdx, isPlaying: true };
    });
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((s) => ({ ...s, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    setState((s) => ({ ...s, volume: v }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState((s) => ({
      ...s,
      repeat:
        s.repeat === "none" ? "all" : s.repeat === "all" ? "one" : "none",
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((s) => ({ ...s, shuffle: !s.shuffle }));
  }, []);

  const addToQueue = useCallback((song: SongResponse) => {
    setState((s) => ({ ...s, queue: [...s.queue, song] }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        play,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        toggleRepeat,
        toggleShuffle,
        addToQueue,
        audioRef,
      }}
    >
      <audio ref={audioRef} preload="metadata" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
