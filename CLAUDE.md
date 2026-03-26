# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Backend is expected at `http://localhost:8080` (configured via `NEXT_PUBLIC_API_URL` in `.env.local`).

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS

### State Management

Two global React Contexts in `src/contexts/`:

- **AuthContext** — user data, JWT token, stored in `localStorage`. Provides `setAuth()`, `logout()`, `refreshUser()`. 401 responses auto-redirect to `/login`.
- **PlayerContext** — audio playback state (current song, queue, repeat/shuffle/volume). Holds a ref to the `<audio>` element; manages auto-advance on song end.

Both are provided in `src/app/layout.tsx` and consumed via `useAuth()` / `usePlayer()` hooks.

### API Layer (Dual Implementation)

There are two coexisting API implementations — prefer the modern one for new code:

- **Modern** (`src/lib/make-api-request.ts`): fetch-based wrapper with `getApiRequest`, `postApiRequest`, `putApiRequest`, `deleteApiRequest`. Auto-injects JWT from `localStorage`. Returns `ApiResponse<T>`.
- **Legacy** (`src/lib/api.ts`): Axios client with request/response interceptors. Used in older parts.

API endpoint functions live in `src/lib/api/` (auth, songs, playlists, users).

### Routing

App Router pages under `src/app/`. Auth routes (`/login`, `/register`) render without the AppShell layout. All other routes render inside AppShell (Sidebar + Header + content area + MusicPlayer at bottom).

### Key Types

All shared types in `src/types/index.ts`: `ApiResponse<T>`, `SongResponse`, `PlaylistResponse`, `UserResponse`, `PlayerState`.

### Styling

Custom Tailwind theme in `tailwind.config.ts` with a Spotify-inspired dark palette — primary green `#1DB954`, surface grays `#121212` / `#1e1e1e` / `#282828`.

## Notes

- `reactStrictMode: false` and TypeScript `strict: false` are intentional project settings.
- Next.js image remote pattern is configured for `http://localhost:8080` (local backend only).
- Song streaming URLs come from the backend and are passed directly to the `<audio>` element.
