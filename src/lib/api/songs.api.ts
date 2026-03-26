import { deleteApiRequest, getApiRequest, postApiRequest } from '@/lib/make-api-request';
import { API_BASE_URL, API_VERSION } from '@/common/constant';
import { Category, SongResponse } from '@/types';

export const getSongsApi = () =>
  getApiRequest<SongResponse[]>('/songs');

export const getSongApi = (id: string) =>
  getApiRequest<SongResponse>(`/songs/${id}`);

export const searchSongsApi = (q: string) =>
  getApiRequest<SongResponse[]>('/songs/search', {
    queryParams: { q },
    noCache: true,
  });

export interface CategoryOption {
  value: Category;
  display: string;
}

export const getCategoriesApi = async () => {
  const res = await getApiRequest<CategoryOption[]>('/songs/categories');
  const values = (res.data ?? []).map((item) => item.value);
  return { ...res, data: values };
};

// Returns full {value, display} pairs — use for dropdowns/labels
export const getCategoryOptionsApi = () =>
  getApiRequest<CategoryOption[]>('/songs/categories');

export const getSongsByCategoryApi = (category: string) =>
  getApiRequest<SongResponse[]>(`/songs/category/${category}`);

export const uploadSongApi = (formData: FormData) =>
  postApiRequest<SongResponse>('/songs', {
    body: formData,
    noCache: true,
  });

export const deleteSongApi = (id: string) =>
  deleteApiRequest<void>(`/songs/${id}`, { noCache: true });

// URL helpers (no fetch, just string)
export const songStreamUrl = (id: string) =>
  `${API_BASE_URL}${API_VERSION}/songs/${id}/stream`;

export const songThumbnailUrl = (id: string) =>
  `${API_BASE_URL}${API_VERSION}/songs/${id}/thumbnail`;
