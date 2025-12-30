import {
  ArticleCode,
  CreateArticleCodeRequest,
  UpdateArticleCodeRequest,
  ApiError,
} from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

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

// ==================== ARTICLE CODE ENDPOINTS ====================

export async function getArticleCodes(
  skip: number = 0,
  limit: number = 100,
  filters?: {
    search?: string;
    article_code?: number;
  }
): Promise<ArticleCode[]> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.article_code && { article_code: filters.article_code.toString() }),
    });

    const response = await fetch(`${BACKEND_URL}/api/article-codes?${params}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch article codes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching article codes:', error);
    throw error;
  }
}

export async function getArticleCodeById(articleCodeId: number): Promise<ArticleCode> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/article-codes/${articleCodeId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to fetch article code: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching article code:', error);
    throw error;
  }
}

export async function createArticleCode(data: CreateArticleCodeRequest): Promise<ArticleCode> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/article-codes`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to create article code: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article code:', error);
    throw error;
  }
}

export async function updateArticleCode(
  articleCodeId: number,
  data: UpdateArticleCodeRequest
): Promise<ArticleCode> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/article-codes/${articleCodeId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error, `Failed to update article code: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating article code:', error);
    throw error;
  }
}

export async function deleteArticleCode(articleCodeId: number): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/article-codes/${articleCodeId}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      handleApiError(error, `Failed to delete article code: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting article code:', error);
    throw error;
  }
}
