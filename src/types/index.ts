export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: number;
  data?: T;
  message: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  role: "ADMIN" | "USER" | "GHOST";
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER" | "GHOST";
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface SongResponse {
  id: string;
  title: string;
  artist: string;
  category: string;
  description: string | null;
  thumbnailUrl: string | null;
  streamUrl: string;
  uploadedBy: string;
  createdAt: string;
  songIndex?: number | null;
}

export interface PlaylistResponse {
  id: string;
  name: string;
  owner: string;
  thumbnailUrl: string | null;
  songs: SongResponse[];
  createdAt: string;
}


export interface PlayerState {
  currentSong: SongResponse | null;
  queue: SongResponse[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeat: "none" | "one" | "all";
  shuffle: boolean;
}
