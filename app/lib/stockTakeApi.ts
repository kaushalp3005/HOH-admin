'use client';

import {
  StockVarianceDownloadResponse,
} from '../types';
import { getAuth, handleUnauthorized } from './auth';

function getAuthHeaders(): HeadersInit {
  const auth = getAuth();
  return {
    'accept': 'application/json',
    ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
  };
}

/**
 * Handle API response with auto-logout on 401
 */
async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  // Auto logout on 401 Unauthorized (token expired)
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = error.detail;
    const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(errorMsg || error.error || `${errorMessage}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Download all stock variance report data
 */
export async function downloadStockVarianceReportAll(): Promise<StockVarianceDownloadResponse> {
  try {
    const response = await fetch('/api/stock-takes/variance-report/download', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<StockVarianceDownloadResponse>(response, 'Failed to download stock variance report');
  } catch (error) {
    console.error('Error downloading stock variance report:', error);
    throw error;
  }
}

/**
 * Download stock variance report by date range
 */
export async function downloadStockVarianceReportByDateRange(
  startDate: string,
  endDate: string
): Promise<StockVarianceDownloadResponse> {
  try {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    const response = await fetch(`/api/stock-takes/variance-report/download/date-range?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<StockVarianceDownloadResponse>(response, 'Failed to download stock variance report by date range');
  } catch (error) {
    console.error('Error downloading stock variance report by date range:', error);
    throw error;
  }
}
