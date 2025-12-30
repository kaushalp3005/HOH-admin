import {
  StoreProduct,
  StoreProductsResponse,
  CreateStoreProductRequest,
  BulkCreateStoreProductRequest,
  BulkCreateStoreProductResponse,
  UpdateStoreProductRequest,
  StoreProductStatsOverview,
  StoreProductStatsByState,
  StoreProductStatsByStore,
  StoreProductStatsByYkey,
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

export async function createStoreProduct(data: CreateStoreProductRequest): Promise<StoreProduct> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to create store product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating store product:', error);
    throw error;
  }
}

export async function bulkCreateStoreProducts(data: BulkCreateStoreProductRequest): Promise<BulkCreateStoreProductResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to bulk create store products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error bulk creating store products:', error);
    throw error;
  }
}

// ==================== READ/VIEW ENDPOINTS ====================

export async function getStoreProducts(
  skip: number = 0,
  limit: number = 20,
  filters?: {
    ykey?: string;
    store?: string;
    state?: string;
    search?: string;
  }
): Promise<StoreProductsResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(filters?.ykey && { ykey: filters.ykey }),
      ...(filters?.store && { store: filters.store }),
      ...(filters?.state && { state: filters.state }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await fetch(`${BACKEND_URL}/api/store-product/?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }
}

export async function getStoreProductById(entryId: number): Promise<StoreProduct> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/${entryId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store product:', error);
    throw error;
  }
}

export async function getStoreProductsByYkey(
  ykey: string,
  skip: number = 0,
  limit: number = 100
): Promise<StoreProductsResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/store-product/by-ykey/${encodeURIComponent(ykey)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store products by YKEY: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store products by YKEY:', error);
    throw error;
  }
}

export async function getStoreProductsByStore(
  store: string,
  skip: number = 0,
  limit: number = 100
): Promise<StoreProductsResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/store-product/by-store/${encodeURIComponent(store)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store products by store: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store products by store:', error);
    throw error;
  }
}

export async function getStoreProductsByState(
  state: string,
  skip: number = 0,
  limit: number = 100
): Promise<StoreProductsResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/store-product/by-state/${encodeURIComponent(state)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store products by state: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store products by state:', error);
    throw error;
  }
}

export async function getProductsByStoreAndState(
  store: string,
  state: string
): Promise<{ ykey: string; article: string }[]> {
  try {
    const params = new URLSearchParams({
      store,
      state,
    });

    const response = await fetch(`${BACKEND_URL}/api/store-product/view/products?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch products by store and state: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by store and state:', error);
    throw error;
  }
}

// ==================== UPDATE ENDPOINT ====================

export async function updateStoreProduct(
  entryId: number,
  data: UpdateStoreProductRequest
): Promise<StoreProduct> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/${entryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update store product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating store product:', error);
    throw error;
  }
}

// ==================== DELETE ENDPOINTS ====================

export async function deleteStoreProduct(entryId: number): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/${entryId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete store product: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting store product:', error);
    throw error;
  }
}

export async function deleteStoreProductByYkeyAndStore(
  ykey: string,
  store: string
): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/by-ykey-store/${encodeURIComponent(ykey)}/${encodeURIComponent(store)}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete store product by YKEY and store: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting store product by YKEY and store:', error);
    throw error;
  }
}

// ==================== STATISTICS & ANALYTICS ENDPOINTS ====================

export async function getStoreProductStatsOverview(): Promise<StoreProductStatsOverview> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/stats/overview`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store product stats overview: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store product stats overview:', error);
    throw error;
  }
}

export async function getStoreProductStatsByState(): Promise<StoreProductStatsByState[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/stats/by-state`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store product stats by state: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store product stats by state:', error);
    throw error;
  }
}

export async function getStoreProductStatsByStore(): Promise<StoreProductStatsByStore[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/stats/by-store`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store product stats by store: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store product stats by store:', error);
    throw error;
  }
}

export async function getStoreProductStatsByYkey(): Promise<StoreProductStatsByYkey[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/stats/by-ykey`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store product stats by YKEY: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store product stats by YKEY:', error);
    throw error;
  }
}

export async function getUniqueYkeys(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/lists/ykeys`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch unique YKEYs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique YKEYs:', error);
    throw error;
  }
}

export async function getUniqueStores(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/lists/stores`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch unique stores: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique stores:', error);
    throw error;
  }
}

export async function getUniqueStates(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-product/lists/states`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch unique states: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unique states:', error);
    throw error;
  }
}
