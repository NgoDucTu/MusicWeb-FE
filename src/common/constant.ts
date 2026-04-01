export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
export const API_VERSION = '/api';
export const API_ACTION_URL = API_BASE_URL;


export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  USER: 'User',
  GHOST: 'Guest',
};
