import { getApiRequest, postApiRequest } from '@/lib/make-api-request';
import { API_BASE_URL, API_VERSION } from '@/common/constant';
import { UserResponse } from '@/types';

export const getMeApi = () =>
  getApiRequest<UserResponse>('/users/me', { noCache: true });

export const getUsersApi = () =>
  getApiRequest<UserResponse[]>('/users', { noCache: true });

export const uploadAvatarApi = (formData: FormData) =>
  postApiRequest<UserResponse>('/users/me/avatar', {
    body: formData,
    noCache: true,
  });

export const changePasswordApi = (currentPassword: string, newPassword: string) =>
  postApiRequest<void>('/users/me/password', {
    body: { currentPassword, newPassword },
    noCache: true,
  });

export const changeRoleApi = (userId: string, role: string) =>
  postApiRequest<void>(`/users/${userId}/role`, {
    queryParams: { role },
    noCache: true,
  });

// URL helper (no fetch, just string)
export const userAvatarUrl = (id: string) =>
  `${API_BASE_URL}${API_VERSION}/users/${id}/avatar`;
