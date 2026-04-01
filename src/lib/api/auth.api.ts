import { postApiRequest } from '@/lib/make-api-request';
import { AuthResponse } from '@/types';

export const loginApi = (username: string, password: string) =>
  postApiRequest<AuthResponse>('/auth/login', {
    body: { username, password },
    noCache: true,
  });

export const registerApi = (username: string, email: string, password: string) =>
  postApiRequest<AuthResponse>('/auth/register', {
    body: { username, email, password },
    noCache: true,
  });

export const forgotPasswordApi = (email: string) =>
  postApiRequest<void>('/auth/forgot-password', {
    body: { email },
    noCache: true,
  });

export const resetPasswordApi = (token: string, newPassword: string) =>
  postApiRequest<void>('/auth/reset-password', {
    body: { token, newPassword },
    noCache: true,
  });
