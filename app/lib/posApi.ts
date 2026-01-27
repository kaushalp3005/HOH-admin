'use client';

import {
  POSEntriesResponse,
  POSEntryDetail,
  CreatePOSEntryRequest,
  UpdatePOSEntryRequest,
  POSRetrievalDownloadResponse,
  POSRetrievalPaginatedResponse,
  POSRetrievalStoresResponse,
} from '../types';
import { getAuth, handleUnauthorized } from './auth';

function getAuthHeaders(): HeadersInit {
  const auth = getAuth();
  return {
    'accept': 'application/json',
    ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
  };
}

function getAuthHeadersWithContentType(): HeadersInit {
  const auth = getAuth();
  return {
    'accept': 'application/json',
    'Content-Type': 'application/json',
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
 * Handle void response (for DELETE) with auto-logout on 401
 */
async function handleVoidResponse(response: Response, errorMessage: string): Promise<void> {
  // Auto logout on 401 Unauthorized (token expired)
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}));
    const detail = error.detail;
    const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(errorMsg || error.error || `${errorMessage}: ${response.statusText}`);
  }
}

export async function getPOSEntries(
  page: number = 1,
  pageSize: number = 10,
  storeName?: string,
  promoterName?: string
): Promise<POSEntriesResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (storeName) params.append('store_name', storeName);
    if (promoterName) params.append('promoter_name', promoterName);

    const response = await fetch(`/api/pos-entries?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSEntriesResponse>(response, 'Failed to fetch POS entries');
  } catch (error) {
    console.error('Error fetching POS entries:', error);
    throw error;
  }
}

export async function getPOSEntry(id: string): Promise<POSEntryDetail> {
  try {
    const response = await fetch(`/api/pos-entries/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSEntryDetail>(response, 'Failed to fetch POS entry');
  } catch (error) {
    console.error('Error fetching POS entry:', error);
    throw error;
  }
}

export async function createPOSEntry(entryData: CreatePOSEntryRequest): Promise<POSEntryDetail> {
  try {
    const response = await fetch('/api/pos-entries', {
      method: 'POST',
      headers: getAuthHeadersWithContentType(),
      body: JSON.stringify(entryData),
    });

    return handleResponse<POSEntryDetail>(response, 'Failed to create POS entry');
  } catch (error) {
    console.error('Error creating POS entry:', error);
    throw error;
  }
}

export async function updatePOSEntry(id: string, entryData: UpdatePOSEntryRequest): Promise<POSEntryDetail> {
  try {
    const response = await fetch(`/api/pos-entries/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersWithContentType(),
      body: JSON.stringify(entryData),
    });

    return handleResponse<POSEntryDetail>(response, 'Failed to update POS entry');
  } catch (error) {
    console.error('Error updating POS entry:', error);
    throw error;
  }
}

export async function deletePOSEntry(id: string): Promise<void> {
  try {
    const auth = getAuth();
    const response = await fetch(`/api/pos-entries/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
      },
    });

    return handleVoidResponse(response, 'Failed to delete POS entry');
  } catch (error) {
    console.error('Error deleting POS entry:', error);
    throw error;
  }
}

// POS Retrieval / Download functions

/**
 * Get paginated POS data for display
 * Default page_size: 20 (max 100)
 */
export async function getPOSRetrievalData(
  page: number = 1,
  pageSize: number = 20,
  storeName?: string
): Promise<POSRetrievalPaginatedResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (storeName) params.append('store_name', storeName);

    const response = await fetch(`/api/pos-retrieval?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSRetrievalPaginatedResponse>(response, 'Failed to fetch POS retrieval data');
  } catch (error) {
    console.error('Error fetching POS retrieval data:', error);
    throw error;
  }
}

/**
 * Download POS data with pagination
 * Default page_size: 10000
 */
export async function downloadPOSData(
  page: number = 1,
  pageSize: number = 10000,
  storeName?: string
): Promise<POSRetrievalDownloadResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (storeName) params.append('store_name', storeName);

    const response = await fetch(`/api/pos-retrieval/download?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSRetrievalDownloadResponse>(response, 'Failed to download POS data');
  } catch (error) {
    console.error('Error downloading POS data:', error);
    throw error;
  }
}

/**
 * Download all POS data (no pagination)
 */
export async function downloadAllPOSData(
  storeName?: string
): Promise<POSRetrievalDownloadResponse> {
  try {
    const params = new URLSearchParams();

    if (storeName) params.append('store_name', storeName);

    const url = params.toString()
      ? `/api/pos-retrieval/download/all?${params.toString()}`
      : '/api/pos-retrieval/download/all';

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSRetrievalDownloadResponse>(response, 'Failed to download all POS data');
  } catch (error) {
    console.error('Error downloading all POS data:', error);
    throw error;
  }
}

export async function downloadPOSDataByDate(
  date: string,
  storeName?: string
): Promise<POSRetrievalDownloadResponse> {
  try {
    const params = new URLSearchParams({
      date,
    });

    if (storeName) params.append('store_name', storeName);

    const response = await fetch(`/api/pos-retrieval/download/by-date?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSRetrievalDownloadResponse>(response, 'Failed to download POS data by date');
  } catch (error) {
    console.error('Error downloading POS data by date:', error);
    throw error;
  }
}

export async function downloadPOSDataByDateRange(
  startDate: string,
  endDate: string,
  storeName?: string
): Promise<POSRetrievalDownloadResponse> {
  try {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    if (storeName) params.append('store_name', storeName);

    const response = await fetch(`/api/pos-retrieval/download/date-range?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSRetrievalDownloadResponse>(response, 'Failed to download POS data by date range');
  } catch (error) {
    console.error('Error downloading POS data by date range:', error);
    throw error;
  }
}

/**
 * Get list of available stores
 */
export async function getPOSRetrievalStores(): Promise<POSRetrievalStoresResponse> {
  try {
    const response = await fetch('/api/pos-retrieval/stores', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    return handleResponse<POSRetrievalStoresResponse>(response, 'Failed to fetch stores');
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
}
