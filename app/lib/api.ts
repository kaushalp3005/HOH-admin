import { Shop, ApiError, CreateShopRequest } from '../types';

export async function getShops(skip: number = 0, limit: number = 300): Promise<Shop[]> {
  try {
    // Use Next.js API route to proxy the request (allows using BACKEND_URL on server-side)
    const response = await fetch(`/api/shops/?skip=${skip}&limit=${limit}`, {
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
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to fetch shops: ${response.statusText}`);
    }

    const data: Shop[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
}

export async function createShop(shopData: CreateShopRequest): Promise<Shop> {
  try {
    const response = await fetch('/api/shops/', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shopData),
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json();
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to create shop: ${response.statusText}`);
    }

    const data: Shop = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
}

export async function updateShop(id: number, shopData: CreateShopRequest): Promise<Shop> {
  try {
    const response = await fetch(`/api/shops/${id}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shopData),
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json();
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to update shop: ${response.statusText}`);
    }

    const data: Shop = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating shop:', error);
    throw error;
  }
}

export async function deleteShop(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/shops/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error: ApiError | { error?: string } = await response.json().catch(() => ({}));
      const detail = (error as ApiError).detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : detail;
      throw new Error(errorMsg || (error as { error?: string }).error || `Failed to delete shop: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting shop:', error);
    throw error;
  }
}

