'use client';

import {
  PricePos,
  PricePosResponse,
  CreatePricePosRequest,
  BulkCreatePricePosRequest,
  BulkCreatePricePosResponse,
  UpdatePricePosRequest,
  PricePosStatsOverview,
  PricePosStatsByState,
  PricePosStatsByPromoter,
  PricePosStatsByPricelist,
  ApiError,
} from '../types';
import { getAuth, handleUnauthorized } from './auth';

function getAuthHeaders(): HeadersInit {
  const auth = getAuth();
  return {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
  };
}

/**
 * Check for 401 and auto-logout, then handle other API errors
 */
function checkUnauthorizedAndHandleError(response: Response, error: any, defaultMessage: string): never {
  // Auto logout on 401 Unauthorized (token expired)
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expired. Please log in again.');
  }

  handleApiError(error, defaultMessage);
}

function handleApiError(error: ApiError | { error?: string, detail?: string | Array<any>, errors?: Array<any> }, defaultMessage: string): never {
  // Log the full error for debugging
  console.error('Full API error response:', error);

  // Check if there's an errors array with detailed validation errors
  if ((error as any).errors && Array.isArray((error as any).errors) && (error as any).errors.length > 0) {
    const errors = (error as any).errors;
    const errorMessages = errors.map((err: any) => {
      if (err.msg) return err.msg;
      if (err.message) return err.message;
      return JSON.stringify(err);
    }).join(', ');
    throw new Error(errorMessages || defaultMessage);
  }

  // Check if detail is an array
  if (Array.isArray((error as ApiError).detail)) {
    const details = (error as ApiError).detail as Array<{ loc: (string | number)[]; msg: string; type: string; }>;
    throw new Error(details[0]?.msg || defaultMessage);
  }

  // Check if detail is a string
  if (typeof (error as ApiError).detail === 'string') {
    const detailMsg = (error as ApiError).detail as string;
    throw new Error(detailMsg);
  }

  // Check for error field
  if ((error as { error?: string }).error) {
    throw new Error((error as { error?: string }).error);
  }

  throw new Error(defaultMessage);
}

// ==================== CREATE ENDPOINTS ====================

export async function createPricePos(data: CreatePricePosRequest): Promise<BulkCreatePricePosResponse> {
  try {
    // New endpoint accepts an array of entries
    const response = await fetch('/api/price-pos/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify([data]), // Wrap single entry in array
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to create price POS mapping: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating price POS mapping:', error);
    throw error;
  }
}

export async function bulkCreatePricePos(data: BulkCreatePricePosRequest): Promise<BulkCreatePricePosResponse> {
  try {
    console.log('bulkCreatePricePos - data.entries:', data.entries);
    console.log('bulkCreatePricePos - stringified:', JSON.stringify(data.entries));

    // Use the bulk endpoint which accepts { entries: [...] }
    const response = await fetch('/api/price-pos/bulk', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data), // Send full object with entries wrapper
    });

    console.log('bulkCreatePricePos - response status:', response.status);
    console.log('bulkCreatePricePos - response statusText:', response.statusText);

    if (!response.ok) {
      let error;
      const contentType = response.headers.get('content-type');
      console.log('bulkCreatePricePos - response content-type:', contentType);

      try {
        const responseText = await response.text();
        console.log('bulkCreatePricePos - response text:', responseText);

        if (responseText) {
          error = JSON.parse(responseText);
        } else {
          error = { detail: response.statusText };
        }
      } catch (e) {
        console.error('bulkCreatePricePos - failed to parse error response:', e);
        error = { detail: response.statusText };
      }

      console.log('bulkCreatePricePos - parsed error:', error);
      checkUnauthorizedAndHandleError(response, error, `Failed to bulk create price POS mappings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error bulk creating price POS mappings:', error);
    throw error;
  }
}

// ==================== READ/VIEW ENDPOINTS ====================

export async function getPricePos(
  skip: number = 0,
  limit: number = 20,
  filters?: {
    state?: string;
    point_of_sale?: string;
    promoter?: string;
    pricelist?: string;
    search?: string;
  }
): Promise<PricePosResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(filters?.state && { state: filters.state }),
      ...(filters?.point_of_sale && { point_of_sale: filters.point_of_sale }),
      ...(filters?.promoter && { promoter: filters.promoter }),
      ...(filters?.pricelist && { pricelist: filters.pricelist }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await fetch(`/api/price-pos/?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS mappings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS mappings:', error);
    throw error;
  }
}

export async function getPricePosById(entryId: number): Promise<PricePos> {
  try {
    const response = await fetch(`/api/price-pos/${entryId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS mapping: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS mapping:', error);
    throw error;
  }
}

export async function getPricePosByState(
  state: string,
  skip: number = 0,
  limit: number = 100
): Promise<PricePosResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/price-pos/by-state/${encodeURIComponent(state)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS mappings by state: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS mappings by state:', error);
    throw error;
  }
}

export async function getPricePosByPos(
  pointOfSale: string,
  skip: number = 0,
  limit: number = 100
): Promise<PricePosResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/price-pos/by-pos/${encodeURIComponent(pointOfSale)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS mappings by POS: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS mappings by POS:', error);
    throw error;
  }
}

export async function getPricePosByPromoter(
  promoter: string,
  skip: number = 0,
  limit: number = 100
): Promise<PricePosResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/price-pos/by-promoter/${encodeURIComponent(promoter)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS mappings by promoter: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS mappings by promoter:', error);
    throw error;
  }
}

export async function getPricePosByPricelist(
  pricelist: string,
  skip: number = 0,
  limit: number = 100
): Promise<PricePosResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/price-pos/by-pricelist/${encodeURIComponent(pricelist)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS mappings by pricelist: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS mappings by pricelist:', error);
    throw error;
  }
}

// ==================== UPDATE ENDPOINT ====================

export async function updatePricePos(
  entryId: number,
  data: UpdatePricePosRequest
): Promise<PricePos> {
  try {
    const response = await fetch(`/api/price-pos/${entryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to update price POS mapping: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating price POS mapping:', error);
    throw error;
  }
}

// ==================== DELETE ENDPOINTS ====================

export async function deletePricePos(entryId: number): Promise<void> {
  try {
    const response = await fetch(`/api/price-pos/${entryId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      checkUnauthorizedAndHandleError(response, error, `Failed to delete price POS mapping: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting price POS mapping:', error);
    throw error;
  }
}

export async function deletePricePosByPos(pointOfSale: string): Promise<void> {
  try {
    const response = await fetch(`/api/price-pos/by-pos/${encodeURIComponent(pointOfSale)}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      checkUnauthorizedAndHandleError(response, error, `Failed to delete price POS mappings by POS: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting price POS mappings by POS:', error);
    throw error;
  }
}

// ==================== STATISTICS & ANALYTICS ENDPOINTS ====================

export async function getPricePosStatsOverview(): Promise<PricePosStatsOverview> {
  try {
    const response = await fetch('/api/price-pos/stats/overview', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS stats overview: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS stats overview:', error);
    throw error;
  }
}

export async function getPricePosStatsByState(): Promise<PricePosStatsByState[]> {
  try {
    const response = await fetch('/api/price-pos/stats/by-state', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS stats by state: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS stats by state:', error);
    throw error;
  }
}

export async function getPricePosStatsByPromoter(): Promise<PricePosStatsByPromoter[]> {
  try {
    const response = await fetch('/api/price-pos/stats/by-promoter', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS stats by promoter: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS stats by promoter:', error);
    throw error;
  }
}

export async function getPricePosStatsByPricelist(): Promise<PricePosStatsByPricelist[]> {
  try {
    const response = await fetch('/api/price-pos/stats/by-pricelist', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch price POS stats by pricelist: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price POS stats by pricelist:', error);
    throw error;
  }
}

export async function getUniqueStates(): Promise<string[]> {
  try {
    const response = await fetch('/api/price-pos/lists/states', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch unique states: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique states:', error);
    throw error;
  }
}

export async function getUniquePos(): Promise<string[]> {
  try {
    const response = await fetch('/api/price-pos/lists/pos', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch unique POS: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique POS:', error);
    throw error;
  }
}

export async function getUniquePromoters(): Promise<string[]> {
  try {
    const response = await fetch('/api/price-pos/lists/promoters', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch unique promoters: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique promoters:', error);
    throw error;
  }
}

export async function getUniquePricelists(): Promise<string[]> {
  try {
    const response = await fetch('/api/price-pos/lists/pricelists', {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      checkUnauthorizedAndHandleError(response, error, `Failed to fetch unique pricelists: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique pricelists:', error);
    throw error;
  }
}
