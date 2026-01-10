'use client';

import {
  POSEntriesResponse,
  POSEntryDetail,
  CreatePOSEntryRequest,
  UpdatePOSEntryRequest,
  ApiError
} from '../types';

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
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json();
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to fetch POS entries: ${response.statusText}`);
    }

    const data: POSEntriesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching POS entries:', error);
    throw error;
  }
}

export async function getPOSEntry(id: string): Promise<POSEntryDetail> {
  try {
    const response = await fetch(`/api/pos-entries/${id}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json();
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to fetch POS entry: ${response.statusText}`);
    }

    const data: POSEntryDetail = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching POS entry:', error);
    throw error;
  }
}

export async function createPOSEntry(entryData: CreatePOSEntryRequest): Promise<POSEntryDetail> {
  try {
    const response = await fetch('/api/pos-entries', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json();
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to create POS entry: ${response.statusText}`);
    }

    const data: POSEntryDetail = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating POS entry:', error);
    throw error;
  }
}

export async function updatePOSEntry(id: string, entryData: UpdatePOSEntryRequest): Promise<POSEntryDetail> {
  try {
    const response = await fetch(`/api/pos-entries/${id}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json();
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to update POS entry: ${response.statusText}`);
    }

    const data: POSEntryDetail = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating POS entry:', error);
    throw error;
  }
}

export async function deletePOSEntry(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/pos-entries/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok && response.status !== 204) {
      const error: ApiError | { error?: string } = await response.json().catch(() => ({}));
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to delete POS entry: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting POS entry:', error);
    throw error;
  }
}
