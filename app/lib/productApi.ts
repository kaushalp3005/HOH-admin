import {
  Product,
  ProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  PromoterAssignment,
  CreatePromoterAssignmentRequest,
  UpdatePromoterAssignmentRequest,
  Price,
  PricesResponse,
  CreatePriceRequest,
  UpdatePriceRequest,
  StorePromotersResponse,
  ProductStoresWithPromotersResponse,
  AvailableStoresResponse,
  ApiError,
} from '../types';
import { getAuth } from './auth';

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

    // Provide helpful message for Pydantic validation errors
    if (detailMsg.includes('validation error') && detailMsg.includes('article_code')) {
      throw new Error('Backend data error: Some promoter assignments have missing article codes. Please check your database.');
    }

    // Provide helpful message for backend code errors
    if (detailMsg.includes('is not defined')) {
      throw new Error(`Backend code error: ${detailMsg}. Please check your backend imports.`);
    }

    throw new Error(detailMsg);
  } else if (Array.isArray((error as ApiError).detail)) {
    const details = (error as ApiError).detail as Array<{ loc: (string | number)[]; msg: string; type: string; }>;
    throw new Error(details[0]?.msg || defaultMessage);
  } else if ((error as { error?: string }).error) {
    throw new Error((error as { error?: string }).error);
  }
  throw new Error(defaultMessage);
}

// ==================== PRODUCT ENDPOINTS ====================

export async function getProducts(
  skip: number = 0,
  limit: number = 20,
  filters?: {
    product_type?: string;
    search?: string;
    is_active?: boolean;
    promoter?: string;
  }
): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(filters?.product_type && { product_type: filters.product_type }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.is_active !== undefined && { is_active: filters.is_active.toString() }),
      ...(filters?.promoter && { promoter: filters.promoter }),
    });

    const response = await fetch(`/api/product-management/products?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createProduct(productData: CreateProductRequest): Promise<Product> {
  try {
    const response = await fetch(`/api/product-management/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to create product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, productData: UpdateProductRequest): Promise<Product> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete product: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// ==================== PROMOTER ASSIGNMENT ENDPOINTS ====================

export async function getPromoterAssignments(productId: string): Promise<PromoterAssignment[]> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productId)}/promoter-assignments`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch promoter assignments: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching promoter assignments:', error);
    throw error;
  }
}

export async function createPromoterAssignment(productId: string, assignmentData: CreatePromoterAssignmentRequest): Promise<PromoterAssignment> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productId)}/promoter-assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to create promoter assignment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating promoter assignment:', error);
    throw error;
  }
}

export async function updatePromoterAssignment(assignmentId: number, assignmentData: UpdatePromoterAssignmentRequest): Promise<PromoterAssignment> {
  try {
    const response = await fetch(`/api/product-management/promoter-assignments/${assignmentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update promoter assignment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating promoter assignment:', error);
    throw error;
  }
}

export async function deletePromoterAssignment(assignmentId: number): Promise<void> {
  try {
    const response = await fetch(`/api/product-management/promoter-assignments/${assignmentId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete promoter assignment: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting promoter assignment:', error);
    throw error;
  }
}

// ==================== PRICE MANAGEMENT ENDPOINTS ====================

export async function getPrices(
  skip: number = 0,
  limit: number = 100,
  filters?: {
    pricelist?: string;
    product?: string;
  }
): Promise<PricesResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(filters?.pricelist && { pricelist: filters.pricelist }),
      ...(filters?.product && { product: filters.product }),
    });

    const response = await fetch(`/api/product-management/prices?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch prices: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

export async function getPriceById(priceId: number): Promise<Price> {
  try {
    const response = await fetch(`/api/product-management/prices/${priceId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch price: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price:', error);
    throw error;
  }
}

export async function getPricesByProduct(productName: string): Promise<Price[]> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productName)}/prices`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch prices for product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching prices for product:', error);
    throw error;
  }
}

export async function createPrice(priceData: CreatePriceRequest): Promise<Price> {
  try {
    const response = await fetch(`/api/product-management/prices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(priceData),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to create price: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating price:', error);
    throw error;
  }
}

export async function updatePrice(priceId: number, priceData: UpdatePriceRequest): Promise<Price> {
  try {
    const response = await fetch(`/api/product-management/prices/${priceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(priceData),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update price: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating price:', error);
    throw error;
  }
}

export async function deletePrice(priceId: number): Promise<void> {
  try {
    const response = await fetch(`/api/product-management/prices/${priceId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete price: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting price:', error);
    throw error;
  }
}

// ==================== STORE-PROMOTER RELATIONSHIP ENDPOINTS ====================

export async function getStorePromoters(storeId: number): Promise<StorePromotersResponse> {
  try {
    const response = await fetch(`/api/product-management/stores/${storeId}/promoters`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch store promoters: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store promoters:', error);
    throw error;
  }
}

export async function getProductStoresWithPromoters(productId: string): Promise<ProductStoresWithPromotersResponse> {
  try {
    const response = await fetch(`/api/product-management/products/${encodeURIComponent(productId)}/stores-with-promoters`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch product stores with promoters: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product stores with promoters:', error);
    throw error;
  }
}

// ==================== AVAILABLE STORES ENDPOINT ====================

export async function getAvailableStores(): Promise<AvailableStoresResponse> {
  try {
    const response = await fetch(`/api/products/stores/`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch available stores: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching available stores:', error);
    throw error;
  }
}
