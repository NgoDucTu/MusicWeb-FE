import { deleteApiRequest, getApiRequest, postApiRequest, putApiRequest } from '@/lib/make-api-request';
import { PlaylistResponse } from '@/types';

export const getPlaylistsApi = () =>
  getApiRequest<PlaylistResponse[]>('/playlists', { noCache: true });

export const getPlaylistApi = (id: string) =>
  getApiRequest<PlaylistResponse>(`/playlists/${id}`, { noCache: true });

export const createPlaylistApi = (name: string) =>
  postApiRequest<PlaylistResponse>('/playlists', {
    body: { name },
    noCache: true,
  });

export const deletePlaylistApi = (id: string) =>
  deleteApiRequest<void>(`/playlists/${id}`, { noCache: true });

export const addSongToPlaylistApi = (playlistId: string, songId: string) =>
  postApiRequest<PlaylistResponse>(`/playlists/${playlistId}/songs/${songId}`, {
    noCache: true,
  });

export const removeSongFromPlaylistApi = (playlistId: string, songId: string) =>
  deleteApiRequest<PlaylistResponse>(`/playlists/${playlistId}/songs/${songId}`, {
    noCache: true,
  });

export const reorderPlaylistSongsApi = (playlistId: string, songIds: string[]) =>
  putApiRequest<PlaylistResponse>(`/playlists/${playlistId}/songs/order`, {
    body: songIds,
    noCache: true,
  });
