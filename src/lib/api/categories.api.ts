import { deleteApiRequest, getApiRequest, postApiRequest, putApiRequest } from '@/lib/make-api-request';

export interface CategoryResponse {
  id: string;
  name: string;
  displayName: string;
  sortOrder: number;
}

export interface CategoryRequest {
  name: string;
  displayName: string;
}

export const getCategoriesApi = () =>
  getApiRequest<CategoryResponse[]>('/categories');

export const getCategoryApi = (id: string) =>
  getApiRequest<CategoryResponse>(`/categories/${id}`);

export const createCategoryApi = (data: CategoryRequest) =>
  postApiRequest<CategoryResponse>('/categories', { body: data as unknown as Record<string, unknown>, noCache: true });

export const updateCategoryApi = (id: string, data: CategoryRequest) =>
  putApiRequest<CategoryResponse>(`/categories/${id}`, { body: data as unknown as Record<string, unknown>, noCache: true });

export const deleteCategoryApi = (id: string) =>
  deleteApiRequest<void>(`/categories/${id}`, { noCache: true });
