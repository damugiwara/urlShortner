import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface UrlMapping {
  shortCode: string;
  originalUrl: string;
  customDomain?: string;
  createdAt: string;
  clicks: number;
  lastClickedAt?: string;
  expiresAt?: string;
}

export interface ShortenUrlRequest {
  originalUrl: string;
  customCode?: string;
  customDomain?: string;
  expiresIn?: number;
}

export interface ShortenUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
}

export interface UrlListResponse {
  urls: UrlMapping[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const urlApi = createApi({
  reducerPath: 'urlApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Url'],
  endpoints: (builder) => ({
    shortenUrl: builder.mutation<ShortenUrlResponse, ShortenUrlRequest>({
      query: (body) => ({
        url: '/shorten',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Url'],
    }),
    
    getUrls: builder.query<UrlListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/urls?page=${page}&limit=${limit}`,
      providesTags: ['Url'],
    }),
    
    getUrlByCode: builder.query<UrlMapping, string>({
      query: (shortCode) => `/urls/${shortCode}`,
      providesTags: (_result, _error, shortCode) => [{ type: 'Url', id: shortCode }],
    }),
    
    deleteUrl: builder.mutation<{ message: string }, string>({
      query: (shortCode) => ({
        url: `/urls/${shortCode}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Url'],
    }),
    
    getAnalytics: builder.query<UrlMapping, string>({
      query: (shortCode) => `/analytics/${shortCode}`,
    }),
  }),
});

export const {
  useShortenUrlMutation,
  useGetUrlsQuery,
  useGetUrlByCodeQuery,
  useDeleteUrlMutation,
  useGetAnalyticsQuery,
} = urlApi;