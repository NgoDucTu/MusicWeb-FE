import { API_ACTION_URL, API_BASE_URL, API_VERSION } from '@/common/constant';
import type { ApiResponse } from '@/types';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: BodyInit | null | Record<string, unknown> | unknown[];
  queryParams?: Record<string, string>;
  timeout?: number;
  cache?: RequestCache;
  noCache?: boolean;
  next?: NextFetchRequestConfig;
  signal?: AbortSignal;
  action?: boolean;
}

export const makeApiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers = {}, body, queryParams, cache, noCache, action, timeout, signal: externalSignal } = options;
  let { next } = options;

  if (process.env.NODE_ENV !== 'development') {
    if (!cache && !next && !noCache) {
      next = { revalidate: 300 };
    }
  }

  const baseUrl = action ? API_ACTION_URL : API_BASE_URL;
  const url = new URL(`${API_VERSION}${endpoint}`, baseUrl);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const isFormData = body instanceof FormData;
  const defaultHeaders: Record<string, string> = { ...headers };

  // Attach JWT from localStorage on the client
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!isFormData && !defaultHeaders['Content-Type']) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  let abortController: AbortController | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  if (timeout && !externalSignal) {
    abortController = new AbortController();
    timeoutId = setTimeout(() => abortController!.abort(), timeout);
  }

  const fetchOptions: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
    credentials: 'include',
    cache,
    mode: 'cors',
    next,
    signal: externalSignal ?? abortController?.signal,
  };

  try {
    const response = await fetch(url.toString(), fetchOptions);
    if (timeoutId) clearTimeout(timeoutId);


    // Handle 401 — clear auth and redirect
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return { success: false, error: 401, message: 'Unauthorized' };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.errorCode ?? response.status,
        message: data.message || response.statusText || 'Something went wrong',
      };
    }

    // Backend: { errorCode, message, data }
    return {
      success: data.errorCode === 0,
      error: data.errorCode,
      data: data.data as T,
      message: data.message || 'Success',
    };
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error('FETCH_ERROR', url.toString(), error);
    return {
      success: false,
      error: -1,
      message: (error as Error).message || 'Network error',
    };
  }
};

export const getApiRequest = <T>(endpoint: string, options: ApiRequestOptions = {}) =>
  makeApiRequest<T>(endpoint, { ...options, method: 'GET' });

export const postApiRequest = <T>(endpoint: string, options: ApiRequestOptions = {}) =>
  makeApiRequest<T>(endpoint, { ...options, method: 'POST' });

export const putApiRequest = <T>(endpoint: string, options: ApiRequestOptions = {}) =>
  makeApiRequest<T>(endpoint, { ...options, method: 'PUT' });

export const deleteApiRequest = <T>(endpoint: string, options: ApiRequestOptions = {}) =>
  makeApiRequest<T>(endpoint, { ...options, method: 'DELETE' });
