export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
export const API_VERSION = '/api';
export const API_ACTION_URL = API_BASE_URL;

export const FEATURED_CATEGORIES = ['RELAXING', 'LOFI_CHILL', 'WORKOUT', 'FOCUS'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  RELAXING: 'Relaxing / Ambient',
  NATURE_SOUNDS: 'Nature Sounds',
  LOFI_CHILL: 'Lo-fi / Chill',
  WORKOUT: 'Workout / Energy',
  UPBEAT_POP: 'Upbeat / Pop',
  FOCUS: 'Focus / Study',
  CLASSICAL: 'Classical',
  JAZZ: 'Jazz',
  SAD: 'Sad / Emotional',
  ROMANTIC: 'Romantic',
  OTHER: 'Khác',
};

export const CATEGORY_COLORS: Record<string, string> = {
  RELAXING: 'bg-teal-700',
  NATURE_SOUNDS: 'bg-green-700',
  LOFI_CHILL: 'bg-indigo-600',
  WORKOUT: 'bg-orange-600',
  UPBEAT_POP: 'bg-pink-600',
  FOCUS: 'bg-blue-700',
  CLASSICAL: 'bg-purple-700',
  JAZZ: 'bg-yellow-700',
  SAD: 'bg-slate-600',
  ROMANTIC: 'bg-rose-600',
  OTHER: 'bg-zinc-600',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  USER: 'Người dùng',
  GHOST: 'Khách',
};
