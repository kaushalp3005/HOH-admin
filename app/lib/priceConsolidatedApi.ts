import {
  PriceConsolidated,
  PriceConsolidatedResponse,
  CreatePriceConsolidatedRequest,
  BulkCreatePriceConsolidatedRequest,
  BulkCreatePriceConsolidatedResponse,
  UpdatePriceConsolidatedRequest,
  PriceConsolidatedStatsOverview,
  PriceConsolidatedStatsByPricelist,
  PriceConsolidatedStatsByProduct,
  PriceLookupRequest,
  PriceLookupResponse,
  ApiError,
} from '../types';
import { getAuth } from './auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  const auth = getAuth();
  return {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
  };
}

function handleApiError(error: ApiError | { error?: string, detail?: string | Array<any> }, defaultMessage: string): never {
  if (typeof (error as ApiError).detail === 'string') {
    const detailMsg = (error as ApiError).detail as string;
    throw new Error(detailMsg);
  } else if (Array.isArray((error as ApiError).detail)) {
    const details = (error as ApiError).detail as Array<{ loc: (string | number)[]; msg: string; type: string; }>;
    throw new Error(details[0]?.msg || defaultMessage);
  } else if ((error as { error?: string }).error) {
    throw new Error((error as { error?: string }).error);
  }
  throw new Error(defaultMessage);
}

// ==================== CREATE ENDPOINTS ====================

export async function createPriceConsolidated(data: CreatePriceConsolidatedRequest): Promise<PriceConsolidated> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to create price entry: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating price entry:', error);
    throw error;
  }
}

export async function bulkCreatePriceConsolidated(data: BulkCreatePriceConsolidatedRequest): Promise<BulkCreatePriceConsolidatedResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to bulk create price entries: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error bulk creating price entries:', error);
    throw error;
  }
}

// ==================== READ/VIEW ENDPOINTS ====================

export async function getPriceConsolidated(
  skip: number = 0,
  limit: number = 20,
  filters?: {
    pricelist?: string;
    product?: string;
    min_price?: number;
    max_price?: number;
    has_gst?: boolean;
    search?: string;
  }
): Promise<PriceConsolidatedResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(filters?.pricelist && { pricelist: filters.pricelist }),
      ...(filters?.product && { product: filters.product }),
      ...(filters?.min_price !== undefined && { min_price: filters.min_price.toString() }),
      ...(filters?.max_price !== undefined && { max_price: filters.max_price.toString() }),
      ...(filters?.has_gst !== undefined && { has_gst: filters.has_gst.toString() }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price entries: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price entries:', error);
    throw error;
  }
}

export async function getPriceConsolidatedById(entryId: number): Promise<PriceConsolidated> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/${entryId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price entry: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price entry:', error);
    throw error;
  }
}

export async function getPriceConsolidatedByPricelist(
  pricelist: string,
  skip: number = 0,
  limit: number = 100
): Promise<PriceConsolidatedResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/by-pricelist/${encodeURIComponent(pricelist)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price entries by pricelist: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price entries by pricelist:', error);
    throw error;
  }
}

export async function getPriceConsolidatedByProduct(
  product: string,
  skip: number = 0,
  limit: number = 100
): Promise<PriceConsolidatedResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/by-product/${encodeURIComponent(product)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price entries by product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price entries by product:', error);
    throw error;
  }
}

export async function getPriceConsolidatedByPriceRange(
  minPrice: number,
  maxPrice: number,
  skip: number = 0,
  limit: number = 100
): Promise<PriceConsolidatedResponse> {
  try {
    const params = new URLSearchParams({
      min_price: minPrice.toString(),
      max_price: maxPrice.toString(),
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/by-price-range/?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price entries by price range: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price entries by price range:', error);
    throw error;
  }
}

export async function lookupPrice(data: PriceLookupRequest): Promise<PriceLookupResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/lookup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to lookup price: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error looking up price:', error);
    throw error;
  }
}

// ==================== UPDATE ENDPOINT ====================

export async function updatePriceConsolidated(
  entryId: number,
  data: UpdatePriceConsolidatedRequest
): Promise<PriceConsolidated> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/${entryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update price entry: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating price entry:', error);
    throw error;
  }
}

// ==================== DELETE ENDPOINTS ====================

export async function deletePriceConsolidated(entryId: number): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/${entryId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete price entry: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting price entry:', error);
    throw error;
  }
}

export async function deletePriceConsolidatedByPricelist(pricelist: string): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/by-pricelist/${encodeURIComponent(pricelist)}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete price entries by pricelist: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting price entries by pricelist:', error);
    throw error;
  }
}

export async function deletePriceConsolidatedByProduct(product: string): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/by-product/${encodeURIComponent(product)}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete price entries by product: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting price entries by product:', error);
    throw error;
  }
}

// ==================== STATISTICS & ANALYTICS ENDPOINTS ====================

export async function getPriceConsolidatedStatsOverview(): Promise<PriceConsolidatedStatsOverview> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/stats/overview`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price stats overview: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price stats overview:', error);
    throw error;
  }
}

export async function getPriceConsolidatedStatsByPricelist(): Promise<PriceConsolidatedStatsByPricelist[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/stats/by-pricelist`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price stats by pricelist: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price stats by pricelist:', error);
    throw error;
  }
}

export async function getPriceConsolidatedStatsByProduct(): Promise<PriceConsolidatedStatsByProduct[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/stats/by-product`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price stats by product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price stats by product:', error);
    throw error;
  }
}

export async function getUniquePricelists(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/lists/pricelists`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch unique pricelists: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique pricelists:', error);
    throw error;
  }
}

export async function getUniqueProducts(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/lists/products`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch unique products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique products:', error);
    throw error;
  }
}

// ==================== CSV BULK UPLOAD ENDPOINTS ====================

export async function uploadPriceConsolidatedCsv(file: File): Promise<{
  success: boolean;
  total_rows: number;
  created_count: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  errors: Array<{ row: number; error: string; data: any }>;
  warnings: string[];
  processing_time_seconds: number;
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const auth = getAuth();
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/upload-csv`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to upload CSV: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
}

export async function updatePriceConsolidatedCsv(file: File): Promise<{
  success: boolean;
  total_rows: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  not_found_count: number;
  matched_by_pricelist_product: number;
  errors: Array<{ row: number; error: string; data: any }>;
  warnings: string[];
  processing_time_seconds: number;
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const auth = getAuth();
    const response = await fetch(`${BACKEND_URL}/api/price-consolidated/update-csv`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        ...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update CSV: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating CSV:', error);
    throw error;
  }
}
