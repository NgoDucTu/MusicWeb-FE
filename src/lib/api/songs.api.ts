import { deleteApiRequest, getApiRequest, postApiRequest } from '@/lib/make-api-request';
import { API_BASE_URL, API_VERSION } from '@/common/constant';
import { SongResponse } from '@/types';

export const getSongsApi = () =>
  getApiRequest<SongResponse[]>('/songs');

export const getSongApi = (id: string) =>
  getApiRequest<SongResponse>(`/songs/${id}`);

export const searchSongsApi = (q: string) =>
  getApiRequest<SongResponse[]>('/songs/search', {
    queryParams: { q },
    noCache: true,
  });

// categoryId is the UUID of the Category entity
export const getSongsByCategoryApi = (categoryId: string) =>
  getApiRequest<SongResponse[]>(`/songs/category/${categoryId}`);

export const uploadSongApi = (formData: FormData) =>
  postApiRequest<SongResponse>('/songs', {
    body: formData,
    noCache: true,
  });

export const editSongApi = (id: string, data: { title?: string; artist?: string; category?: string; description?: string }) =>
  postApiRequest<SongResponse>(`/songs/${id}`, {
    body: data,
    noCache: true,
  });

export const deleteSongApi = (id: string) =>
  deleteApiRequest<void>(`/songs/${id}`, { noCache: true });

// URL helpers (no fetch, just string)
export const songStreamUrl = (id: string) =>
  `${API_BASE_URL}${API_VERSION}/songs/${id}/stream`;

export const songThumbnailUrl = (id: string) =>
  `${API_BASE_URL}${API_VERSION}/songs/${id}/thumbnail`;
