'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearAuth, getAuth } from '../lib/auth';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createPromoterAssignment,
  deletePromoterAssignment,
  updatePromoterAssignment,
  getPrices,
  createPrice,
  updatePrice,
  deletePrice,
  getProductStoresWithPromoters,
  getAvailableStores,
} from '../lib/productApi';
import {
  getStoreProducts,
  createStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
  getUniqueYkeys,
  getUniqueStores,
  getUniqueStates,
} from '../lib/storeProductApi';
import {
  getArticleCodes,
  createArticleCode,
  updateArticleCode,
  deleteArticleCode,
} from '../lib/articleCodeApi';
import {
  getPricePos,
  createPricePos,
  updatePricePos,
  deletePricePos,
  getUniqueStates as getPricePosUniqueStates,
  getUniquePos,
  getUniquePromoters,
  getUniquePricelists,
} from '../lib/pricePosApi';
import {
  getPriceConsolidated,
  createPriceConsolidated,
  updatePriceConsolidated,
  deletePriceConsolidated,
  bulkCreatePriceConsolidated,
  getUniquePricelists as getPriceConsolidatedPricelists,
  getUniqueProducts as getPriceConsolidatedProducts,
  getPriceConsolidatedStatsOverview,
} from '../lib/priceConsolidatedApi';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  PromoterAssignment,
  Price,
  CreatePriceRequest,
  ProductStoresWithPromotersResponse,
  AvailableStore,
  StoreProduct,
  CreateStoreProductRequest,
  UpdateStoreProductRequest,
  ArticleCode,
  CreateArticleCodeRequest,
  UpdateArticleCodeRequest,
  PricePos,
  CreatePricePosRequest,
  UpdatePricePosRequest,
  PriceConsolidated,
  CreatePriceConsolidatedRequest,
  UpdatePriceConsolidatedRequest,
  BulkCreatePriceConsolidatedRequest,
  PriceConsolidatedStatsOverview,
} from '../types';

type Tab = 'store-products' | 'article-codes' | 'price-pos' | 'price-consolidated';

export default function ProductManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('store-products');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [mounted, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!mounted || !isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const auth = getAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Product Management
            </h1>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">
                User: {auth?.userId}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <nav className="flex gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
            >
              User Management
            </button>
            <button
              className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 whitespace-nowrap"
            >
              Product Management
            </button>
          </nav>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <nav className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('store-products')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'store-products'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Store Products
            </button>
            <button
              onClick={() => setActiveTab('article-codes')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'article-codes'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Article Codes
            </button>
            <button
              onClick={() => setActiveTab('price-pos')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'price-pos'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Price POS
            </button>
            <button
              onClick={() => setActiveTab('price-consolidated')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'price-consolidated'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Price Consolidated
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'store-products' && <StoreProductsTab />}
        {activeTab === 'article-codes' && <ArticleCodesTab />}
        {activeTab === 'price-pos' && <PricePosTab />}
        {activeTab === 'price-consolidated' && <PriceConsolidatedTab />}
      </main>
    </div>
  );
}

// ==================== STORE PRODUCTS TAB ====================
function StoreProductsTab() {
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ykeyFilter, setYkeyFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);

  const [formData, setFormData] = useState<CreateStoreProductRequest>({
    ykey: '',
    product_name: '',
    store: '',
    state: '',
  });

  const [updateFormData, setUpdateFormData] = useState<UpdateStoreProductRequest>({
    ykey: '',
    product_name: '',
    store: '',
    state: '',
  });

  const [uniqueYkeys, setUniqueYkeys] = useState<string[]>([]);
  const [uniqueStores, setUniqueStores] = useState<string[]>([]);
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);

  useEffect(() => {
    fetchStoreProducts();
    fetchDropdownData();
  }, [searchTerm, ykeyFilter, storeFilter, stateFilter, skip, limit]);

  const fetchDropdownData = async () => {
    try {
      const [ykeys, stores, states] = await Promise.all([
        getUniqueYkeys(),
        getUniqueStores(),
        getUniqueStates(),
      ]);
      setUniqueYkeys(ykeys);
      setUniqueStores(stores);
      setUniqueStates(states);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStoreProducts(skip, limit, {
        search: searchTerm || undefined,
        ykey: ykeyFilter || undefined,
        store: storeFilter || undefined,
        state: stateFilter || undefined,
      });
      setStoreProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStoreProduct(formData);
      setIsModalOpen(false);
      resetCreateForm();
      setSkip(0);
      await fetchStoreProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateStoreProduct(editingProduct.id, updateFormData);
      setIsUpdateModalOpen(false);
      setEditingProduct(null);
      await fetchStoreProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update store product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteStoreProduct(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchStoreProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete store product');
    }
  };

  const resetCreateForm = () => {
    setFormData({
      ykey: '',
      product_name: '',
      store: '',
      state: '',
    });
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div>
      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Store Products ({total})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            placeholder="Search product name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by YKEY..."
            value={ykeyFilter}
            onChange={(e) => {
              setYkeyFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by store..."
            value={storeFilter}
            onChange={(e) => {
              setStoreFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by state..."
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Store Product
          </button>
          <button
            onClick={() => {
              setSkip(0);
              fetchStoreProducts();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Store Products List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : storeProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">No store products found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">YKEY</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Store</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">State</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {storeProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {product.ykey}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {product.product_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {product.store}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {product.state}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setUpdateFormData({
                                ykey: product.ykey,
                                product_name: product.product_name,
                                store: product.store,
                                state: product.state,
                              });
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, skip - limit))}
                      disabled={skip === 0}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(skip + limit)}
                      disabled={skip + limit >= total}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Store Product</h2>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YKEY *</label>
                <input
                  type="text"
                  required
                  value={formData.ykey}
                  onChange={(e) => setFormData({ ...formData, ykey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Y0520"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Cashew W240 Without Skin Loose FG"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store *</label>
                <input
                  type="text"
                  required
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Food Square - Bandra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Maharashtra"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetCreateForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Create Store Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {isUpdateModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Store Product</h2>
            </div>
            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YKEY</label>
                <input
                  type="text"
                  value={updateFormData.ykey}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, ykey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                <input
                  type="text"
                  value={updateFormData.product_name}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, product_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store</label>
                <input
                  type="text"
                  value={updateFormData.store}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, store: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  value={updateFormData.state}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Update Store Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this store product entry?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ARTICLE CODES TAB ====================
function ArticleCodesTab() {
  const [articleCodes, setArticleCodes] = useState<ArticleCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingArticleCode, setEditingArticleCode] = useState<ArticleCode | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [articleCodeFilter, setArticleCodeFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);

  const [formData, setFormData] = useState<CreateArticleCodeRequest>({
    products: '',
    article_codes: 0,
    promoter: '',
  });

  const [updateFormData, setUpdateFormData] = useState<UpdateArticleCodeRequest>({
    products: '',
    article_codes: 0,
    promoter: '',
  });

  useEffect(() => {
    fetchArticleCodes();
  }, [searchTerm, articleCodeFilter, skip, limit]);

  const fetchArticleCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticleCodes(skip, limit, {
        search: searchTerm || undefined,
        article_code: articleCodeFilter ? parseInt(articleCodeFilter) : undefined,
      });
      setArticleCodes(data);
      setTotal(data.length); // API returns array, not paginated response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createArticleCode(formData);
      setIsModalOpen(false);
      resetCreateForm();
      setSkip(0);
      await fetchArticleCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article code');
    }
  };

  const handleUpdateArticleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticleCode) return;
    try {
      await updateArticleCode(editingArticleCode.id, updateFormData);
      setIsUpdateModalOpen(false);
      setEditingArticleCode(null);
      await fetchArticleCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article code');
    }
  };

  const handleDeleteArticleCode = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteArticleCode(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchArticleCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article code');
    }
  };

  const resetCreateForm = () => {
    setFormData({
      products: '',
      article_codes: 0,
      promoter: '',
    });
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div>
      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Article Codes ({total})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Search products or promoter..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by article code..."
            value={articleCodeFilter}
            onChange={(e) => {
              setArticleCodeFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Article Code
          </button>
          <button
            onClick={() => {
              setSkip(0);
              fetchArticleCodes();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Article Codes List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : articleCodes.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">No article codes found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Article Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Promoter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {articleCodes.map((articleCode) => (
                    <tr key={articleCode.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {articleCode.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-semibold">
                        {articleCode.article_codes}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {articleCode.products}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {articleCode.promoter}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingArticleCode(articleCode);
                              setUpdateFormData({
                                products: articleCode.products,
                                article_codes: articleCode.article_codes,
                                promoter: articleCode.promoter,
                              });
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(articleCode.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, skip - limit))}
                      disabled={skip === 0}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(skip + limit)}
                      disabled={skip + limit >= total}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Article Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Article Code</h2>
            </div>
            <form onSubmit={handleCreateArticleCode} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Article Code *</label>
                <input
                  type="number"
                  required
                  value={formData.article_codes || ''}
                  onChange={(e) => setFormData({ ...formData, article_codes: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="902979"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Cashew W240 Without Skin Loose FG"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Promoter *</label>
                <input
                  type="text"
                  required
                  value={formData.promoter}
                  onChange={(e) => setFormData({ ...formData, promoter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Food Square Barcode"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetCreateForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Create Article Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Article Code Modal */}
      {isUpdateModalOpen && editingArticleCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Article Code</h2>
            </div>
            <form onSubmit={handleUpdateArticleCode} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Article Code</label>
                <input
                  type="number"
                  value={updateFormData.article_codes || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, article_codes: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                <input
                  type="text"
                  value={updateFormData.products}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, products: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Promoter</label>
                <input
                  type="text"
                  value={updateFormData.promoter}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, promoter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingArticleCode(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Update Article Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this article code? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteArticleCode}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PRICE POS TAB ====================
function PricePosTab() {
  const [pricePosData, setPricePosData] = useState<PricePos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingPricePos, setEditingPricePos] = useState<PricePos | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [promoterFilter, setPromoterFilter] = useState('');
  const [pricelistFilter, setPricelistFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);

  const [formData, setFormData] = useState<CreatePricePosRequest>({
    state: '',
    point_of_sale: '',
    promoter: '',
    pricelist: '',
  });

  const [updateFormData, setUpdateFormData] = useState<UpdatePricePosRequest>({
    state: '',
    point_of_sale: '',
    promoter: '',
    pricelist: '',
  });

  useEffect(() => {
    fetchPricePos();
  }, [searchTerm, stateFilter, posFilter, promoterFilter, pricelistFilter, skip, limit]);

  const fetchPricePos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPricePos(skip, limit, {
        search: searchTerm || undefined,
        state: stateFilter || undefined,
        point_of_sale: posFilter || undefined,
        promoter: promoterFilter || undefined,
        pricelist: pricelistFilter || undefined,
      });
      setPricePosData(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price POS mappings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePricePos = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPricePos(formData);
      setIsModalOpen(false);
      resetCreateForm();
      setSkip(0);
      await fetchPricePos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create price POS mapping');
    }
  };

  const handleUpdatePricePos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricePos) return;
    try {
      await updatePricePos(editingPricePos.id, updateFormData);
      setIsUpdateModalOpen(false);
      setEditingPricePos(null);
      await fetchPricePos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update price POS mapping');
    }
  };

  const handleDeletePricePos = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePricePos(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchPricePos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete price POS mapping');
    }
  };

  const resetCreateForm = () => {
    setFormData({
      state: '',
      point_of_sale: '',
      promoter: '',
      pricelist: '',
    });
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div>
      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Price POS Mappings ({total})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
          <input
            type="text"
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by state..."
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by point of sale..."
            value={posFilter}
            onChange={(e) => {
              setPosFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by promoter..."
            value={promoterFilter}
            onChange={(e) => {
              setPromoterFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by pricelist..."
            value={pricelistFilter}
            onChange={(e) => {
              setPricelistFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Price POS
          </button>
          <button
            onClick={() => {
              setSkip(0);
              fetchPricePos();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Price POS List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : pricePosData.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">No price POS mappings found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">State</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Point of Sale</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Promoter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pricelist</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pricePosData.map((pricePos) => (
                    <tr key={pricePos.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {pricePos.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {pricePos.state}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {pricePos.point_of_sale}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {pricePos.promoter}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {pricePos.pricelist}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPricePos(pricePos);
                              setUpdateFormData({
                                state: pricePos.state,
                                point_of_sale: pricePos.point_of_sale,
                                promoter: pricePos.promoter,
                                pricelist: pricePos.pricelist,
                              });
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(pricePos.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, skip - limit))}
                      disabled={skip === 0}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(skip + limit)}
                      disabled={skip + limit >= total}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Price POS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Price POS Mapping</h2>
            </div>
            <form onSubmit={handleCreatePricePos} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Point of Sale *</label>
                <input
                  type="text"
                  required
                  value={formData.point_of_sale}
                  onChange={(e) => setFormData({ ...formData, point_of_sale: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Food Square - Bandra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Promoter *</label>
                <input
                  type="text"
                  required
                  value={formData.promoter}
                  onChange={(e) => setFormData({ ...formData, promoter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="PAPITHA AMAVASAI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricelist *</label>
                <input
                  type="text"
                  required
                  value={formData.pricelist}
                  onChange={(e) => setFormData({ ...formData, pricelist: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Food Square"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetCreateForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Create Price POS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Price POS Modal */}
      {isUpdateModalOpen && editingPricePos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Price POS Mapping</h2>
            </div>
            <form onSubmit={handleUpdatePricePos} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  value={updateFormData.state}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Point of Sale</label>
                <input
                  type="text"
                  value={updateFormData.point_of_sale}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, point_of_sale: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Promoter</label>
                <input
                  type="text"
                  value={updateFormData.promoter}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, promoter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricelist</label>
                <input
                  type="text"
                  value={updateFormData.pricelist}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, pricelist: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingPricePos(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Update Price POS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this price POS mapping? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePricePos}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PRODUCTS TAB ====================
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState<CreateProductRequest>({
    product_id: '',
    product_type: '',
    product_description: '',
    is_active: true,
    promoter_assignments: [],
    prices: [],
    store_ids: [],
    auto_create_article_codes: false,
    base_article_code: undefined,
  });

  const [updateFormData, setUpdateFormData] = useState<UpdateProductRequest>({
    product_type: '',
    product_description: '',
    is_active: true,
  });

  const [availableStores, setAvailableStores] = useState<AvailableStore[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, productTypeFilter, isActiveFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(0, 100, {
        search: searchTerm || undefined,
        product_type: productTypeFilter || undefined,
        is_active: isActiveFilter,
      });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      const data = await getAvailableStores();
      setAvailableStores(data.stores);
    } catch (err) {
      console.error('Error fetching stores:', err);
      // Don't show error to user, just log it
    } finally {
      setLoadingStores(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchStores();
    }
  }, [isModalOpen]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build request with only non-empty optional fields
      const requestData: CreateProductRequest = {
        product_id: formData.product_id,
        product_type: formData.product_type,
        product_description: formData.product_description,
        is_active: formData.is_active,
      };

      // Only include optional fields if they have data
      if (formData.promoter_assignments && formData.promoter_assignments.length > 0) {
        requestData.promoter_assignments = formData.promoter_assignments;
      }
      if (formData.prices && formData.prices.length > 0) {
        requestData.prices = formData.prices;
      }
      if (formData.store_ids && formData.store_ids.length > 0) {
        requestData.store_ids = formData.store_ids;
      }
      if (formData.auto_create_article_codes) {
        requestData.auto_create_article_codes = true;
        requestData.base_article_code = formData.base_article_code;
      }

      await createProduct(requestData);
      setIsModalOpen(false);
      resetCreateForm();
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.product_id, updateFormData);
      setIsUpdateModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const resetCreateForm = () => {
    setFormData({
      product_id: '',
      product_type: '',
      product_description: '',
      is_active: true,
      promoter_assignments: [],
      prices: [],
      store_ids: [],
      auto_create_article_codes: false,
      base_article_code: undefined,
    });
  };

  return (
    <div>
      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Products ({total})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by type..."
            value={productTypeFilter}
            onChange={(e) => setProductTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <select
            value={isActiveFilter === undefined ? '' : isActiveFilter.toString()}
            onChange={(e) => setIsActiveFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Product
          </button>
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Promoters</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Prices</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Stores</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {product.product_id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {product.product_type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {product.product_description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {product.promoter_assignments.length}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {product.prices.length}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {product.store_assignments.length}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setUpdateFormData({
                              product_type: product.product_type,
                              product_description: product.product_description,
                              is_active: product.is_active,
                            });
                            setIsUpdateModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.product_id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Product</h2>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section 1: Basic Product Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.product_id}
                      onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Y0520"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Type *</label>
                    <input
                      type="text"
                      required
                      value={formData.product_type}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Almond"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.product_description}
                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Product description"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
                </div>
              </div>

              {/* Section 2: Store Assignments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Store Assignments (Optional)</h3>
                {loadingStores ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading stores...
                  </div>
                ) : availableStores.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select stores where this product will be available:
                    </p>
                    <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
                      {availableStores.map((store) => (
                        <label
                          key={store.store_id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.store_ids?.includes(store.store_id) || false}
                            onChange={(e) => {
                              const currentStoreIds = formData.store_ids || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, store_ids: [...currentStoreIds, store.store_id] });
                              } else {
                                setFormData({ ...formData, store_ids: currentStoreIds.filter(id => id !== store.store_id) });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {store.store_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {store.store_id} | {store.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {formData.store_ids && formData.store_ids.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {formData.store_ids.length} store{formData.store_ids.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No stores available. Please ensure stores are configured in the system.</p>
                )}
              </div>

              {/* Section 3: Auto-Generate Article Codes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Auto-Generate Article Codes (Optional)</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.auto_create_article_codes || false}
                    onChange={(e) => setFormData({ ...formData, auto_create_article_codes: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-create article codes for store-promoter combinations</label>
                </div>
                {formData.auto_create_article_codes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base Article Code *</label>
                    <input
                      type="number"
                      required={formData.auto_create_article_codes}
                      value={formData.base_article_code || ''}
                      onChange={(e) => setFormData({ ...formData, base_article_code: parseInt(e.target.value) || undefined })}
                      className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="902985"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Starting article code for auto-generation</p>
                  </div>
                )}
              </div>

              {/* Section 4: Manual Promoter Assignments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Manual Promoter Assignments (Optional)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">You can add manual promoter assignments in addition to auto-generated ones.</p>
                {formData.promoter_assignments && formData.promoter_assignments.length > 0 ? (
                  <div className="space-y-2">
                    {formData.promoter_assignments.map((assignment, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={assignment.article_code}
                            onChange={(e) => {
                              const newAssignments = [...(formData.promoter_assignments || [])];
                              newAssignments[index] = { ...newAssignments[index], article_code: parseInt(e.target.value) || 0 };
                              setFormData({ ...formData, promoter_assignments: newAssignments });
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Article Code (e.g., 902979)"
                          />
                          <input
                            type="text"
                            value={assignment.promoter}
                            onChange={(e) => {
                              const newAssignments = [...(formData.promoter_assignments || [])];
                              newAssignments[index] = { ...newAssignments[index], promoter: e.target.value };
                              setFormData({ ...formData, promoter_assignments: newAssignments });
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Promoter Name"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newAssignments = formData.promoter_assignments?.filter((_, i) => i !== index) || [];
                            setFormData({ ...formData, promoter_assignments: newAssignments });
                          }}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No manual promoter assignments. Click "Add Promoter Assignment" to add one.</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, promoter_assignments: [...(formData.promoter_assignments || []), { article_code: 0, promoter: '' }] });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Add Promoter Assignment
                </button>
              </div>

              {/* Section 5: Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Pricing (Optional)</h3>
                {formData.prices && formData.prices.length > 0 ? (
                  <div className="space-y-2">
                    {formData.prices.map((price, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={price.pricelist}
                            onChange={(e) => {
                              const newPrices = [...(formData.prices || [])];
                              newPrices[index] = { ...newPrices[index], pricelist: e.target.value };
                              setFormData({ ...formData, prices: newPrices });
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Pricelist (e.g., Smart Bazaar)"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={price.price}
                            onChange={(e) => {
                              const newPrices = [...(formData.prices || [])];
                              newPrices[index] = { ...newPrices[index], price: parseFloat(e.target.value) || 0 };
                              setFormData({ ...formData, prices: newPrices });
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Price (e.g., 850.00)"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={price.gst}
                            onChange={(e) => {
                              const newPrices = [...(formData.prices || [])];
                              newPrices[index] = { ...newPrices[index], gst: parseFloat(e.target.value) || 0 };
                              setFormData({ ...formData, prices: newPrices });
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="GST (e.g., 0.05)"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newPrices = formData.prices?.filter((_, i) => i !== index) || [];
                            setFormData({ ...formData, prices: newPrices });
                          }}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No prices defined. Click "Add Price" to add pricing.</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, prices: [...(formData.prices || []), { pricelist: '', price: 0, gst: 0 }] });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Add Price
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetCreateForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {isUpdateModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Product</h2>
            </div>
            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Type</label>
                <input
                  type="text"
                  value={updateFormData.product_type}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, product_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={updateFormData.product_description}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, product_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={updateFormData.is_active}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete product {deleteConfirmId}? This will also delete all related data.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PROMOTERS TAB ====================
function PromotersTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ article_code: '', promoter: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(0, 100);
      setProducts(data.products);
      // Update selected product if it was previously selected
      if (selectedProduct) {
        const updatedProduct = data.products.find(p => p.product_id === selectedProduct.product_id);
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        } else {
          setSelectedProduct(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await createPromoterAssignment(selectedProduct.product_id, {
        article_code: Number(formData.article_code),
        promoter: formData.promoter,
      });
      setIsModalOpen(false);
      setFormData({ article_code: '', promoter: '' });
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!confirm('Are you sure you want to delete this promoter assignment?')) {
      return;
    }

    try {
      await deletePromoterAssignment(assignmentId);
      await fetchProducts();
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete assignment';
      setError(errorMsg);
      // Refresh data to show current state
      await fetchProducts();
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Promoter Assignments
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Product
          </label>
          <select
            value={selectedProduct?.product_id || ''}
            onChange={(e) => {
              const product = products.find(p => p.product_id === e.target.value);
              setSelectedProduct(product || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">-- Select a product --</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_id} - {product.product_description}
              </option>
            ))}
          </select>
        </div>
        {selectedProduct && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            Add Promoter Assignment
          </button>
        )}
      </div>

      {selectedProduct && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assignments for {selectedProduct.product_description}
            </h3>
          </div>
          {selectedProduct.promoter_assignments.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              No promoter assignments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Article Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Promoter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedProduct.promoter_assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {assignment.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {assignment.article_code}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {assignment.promoter}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Assignment Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Promoter Assignment
              </h2>
            </div>
            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Article Code *
                </label>
                <input
                  type="number"
                  required
                  value={formData.article_code}
                  onChange={(e) => setFormData({ ...formData, article_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="902979"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Promoter *
                </label>
                <input
                  type="text"
                  required
                  value={formData.promoter}
                  onChange={(e) => setFormData({ ...formData, promoter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Smart & Essentials Barcode"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ article_code: '', promoter: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

// ==================== PRICES TAB ====================
function PricesTab() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [pricelistFilter, setPricelistFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState<CreatePriceRequest>({
    pricelist: '',
    product: '',
    price: 0,
    gst: 0,
  });

  useEffect(() => {
    fetchPrices();
  }, [pricelistFilter, productFilter]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPrices(0, 500, {
        pricelist: pricelistFilter || undefined,
        product: productFilter || undefined,
      });
      setPrices(data.prices);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPrice(formData);
      setIsModalOpen(false);
      setFormData({ pricelist: '', product: '', price: 0, gst: 0 });
      await fetchPrices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create price');
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;
    try {
      await updatePrice(editingPrice.id, formData);
      setIsUpdateModalOpen(false);
      setEditingPrice(null);
      await fetchPrices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update price');
    }
  };

  const handleDeletePrice = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePrice(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchPrices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete price');
    }
  };

  return (
    <div>
      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Price Management ({total})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Filter by pricelist..."
            value={pricelistFilter}
            onChange={(e) => setPricelistFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by product..."
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            Create Price
          </button>
          <button
            onClick={fetchPrices}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Prices List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : prices.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">No prices found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pricelist</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">GST</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {prices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {price.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {price.pricelist}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {price.product}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      ₹{price.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {(price.gst * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPrice(price);
                            setFormData({
                              pricelist: price.pricelist,
                              product: price.product,
                              price: price.price,
                              gst: price.gst,
                            });
                            setIsUpdateModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(price.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Update Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Price</h2>
            </div>
            <form onSubmit={handleCreatePrice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricelist *</label>
                <input
                  type="text"
                  required
                  value={formData.pricelist}
                  onChange={(e) => setFormData({ ...formData, pricelist: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Smart Bazaar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product *</label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="850.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST (decimal) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.gst || ''}
                  onChange={(e) => setFormData({ ...formData, gst: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.05"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ pricelist: '', product: '', price: 0, gst: 0 });
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Create Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateModalOpen && editingPrice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Price</h2>
            </div>
            <form onSubmit={handleUpdatePrice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricelist</label>
                <input
                  type="text"
                  value={formData.pricelist}
                  onChange={(e) => setFormData({ ...formData, pricelist: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product</label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST (decimal)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gst || ''}
                  onChange={(e) => setFormData({ ...formData, gst: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingPrice(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Update Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this price entry?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePrice}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== STORES TAB ====================
function StoresTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [storeData, setStoreData] = useState<ProductStoresWithPromotersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(0, 100);
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    }
  };

  const fetchStoreData = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductStoresWithPromoters(productId);
      setStoreData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Store-Promoter Relationships
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Product
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              if (e.target.value) {
                fetchStoreData(e.target.value);
              } else {
                setStoreData(null);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">-- Select a product --</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_id} - {product.product_description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && storeData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stores for {storeData.product_description} ({storeData.total_stores})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {storeData.stores.map((store) => (
              <div
                key={store.store_id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      {store.store_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      State: {store.state} | Store ID: {store.store_id}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    store.is_available
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {store.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Promoters ({store.promoters.length}):
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {store.promoters.map((promoter) => (
                      <span
                        key={promoter.id}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium"
                      >
                        {promoter.promoter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PRICE CONSOLIDATED TAB ====================
function PriceConsolidatedTab() {
  const [priceEntries, setPriceEntries] = useState<PriceConsolidated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PriceConsolidated | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pricelistFilter, setPricelistFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);
  const [bulkData, setBulkData] = useState('');
  const [stats, setStats] = useState<PriceConsolidatedStatsOverview | null>(null);
  const [availablePricelists, setAvailablePricelists] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);

  const [formData, setFormData] = useState<CreatePriceConsolidatedRequest>({
    pricelist: '',
    product: '',
    price: 0,
    gst: null,
  });

  const [updateFormData, setUpdateFormData] = useState<UpdatePriceConsolidatedRequest>({
    pricelist: '',
    product: '',
    price: 0,
    gst: null,
  });

  useEffect(() => {
    fetchPriceEntries();
    fetchStats();
    fetchDropdownData();
  }, [searchTerm, pricelistFilter, productFilter, minPriceFilter, maxPriceFilter, skip, limit]);

  const fetchPriceEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPriceConsolidated(skip, limit, {
        search: searchTerm || undefined,
        pricelist: pricelistFilter || undefined,
        product: productFilter || undefined,
        min_price: minPriceFilter ? parseFloat(minPriceFilter) : undefined,
        max_price: maxPriceFilter ? parseFloat(maxPriceFilter) : undefined,
      });
      setPriceEntries(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getPriceConsolidatedStatsOverview();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [pricelists, products] = await Promise.all([
        getPriceConsolidatedPricelists(),
        getPriceConsolidatedProducts(),
      ]);
      setAvailablePricelists(pricelists);
      setAvailableProducts(products);
    } catch (err) {
      console.error('Failed to fetch dropdown data:', err);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPriceConsolidated(formData);
      setIsModalOpen(false);
      resetCreateForm();
      setSkip(0);
      await fetchPriceEntries();
      await fetchStats();
      await fetchDropdownData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create price entry');
    }
  };

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    try {
      await updatePriceConsolidated(editingEntry.id, updateFormData);
      setIsUpdateModalOpen(false);
      setEditingEntry(null);
      await fetchPriceEntries();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update price entry');
    }
  };

  const handleDeleteEntry = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePriceConsolidated(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchPriceEntries();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete price entry');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lines = bulkData.trim().split('\n');
      const entries: BulkCreatePriceConsolidatedRequest['entries'] = [];

      for (const line of lines) {
        const [pricelist, product, price, gst] = line.split(',').map(s => s.trim());
        if (pricelist && product && price) {
          entries.push({
            pricelist,
            product,
            price: parseFloat(price),
            gst: gst ? parseFloat(gst) : null,
          });
        }
      }

      if (entries.length === 0) {
        setError('No valid entries found in bulk data');
        return;
      }

      const result = await bulkCreatePriceConsolidated({ entries });
      setIsBulkModalOpen(false);
      setBulkData('');
      setSkip(0);
      await fetchPriceEntries();
      await fetchStats();
      await fetchDropdownData();
      setError(`Success: Created ${result.created_count}, Updated ${result.updated_count}, Failed ${result.failed_count}`);
      setTimeout(() => setError(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk upload');
    }
  };

  const resetCreateForm = () => {
    setFormData({
      pricelist: '',
      product: '',
      price: 0,
      gst: null,
    });
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div>
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total_entries}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Pricelists</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.unique_pricelists}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Products</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.unique_products}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Avg Price</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{Number(stats.avg_price).toFixed(2)}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Min Price</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{Number(stats.min_price).toFixed(2)}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Max Price</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{Number(stats.max_price).toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Price Consolidated ({total})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder="Search product or pricelist..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by pricelist..."
            value={pricelistFilter}
            onChange={(e) => {
              setPricelistFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="Filter by product..."
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="number"
            placeholder="Min price..."
            value={minPriceFilter}
            onChange={(e) => {
              setMinPriceFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="number"
            placeholder="Max price..."
            value={maxPriceFilter}
            onChange={(e) => {
              setMaxPriceFilter(e.target.value);
              setSkip(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Entry
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Bulk Upload
          </button>
          <button
            onClick={() => {
              setSkip(0);
              fetchPriceEntries();
              fetchStats();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Price Entries List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : priceEntries.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">No price entries found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pricelist</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">GST %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price + GST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {priceEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {entry.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {entry.pricelist}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {entry.product}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{Number(entry.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {entry.gst ? `${(Number(entry.gst) * 100).toFixed(0)}%` : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                        {entry.gst ? `₹${(Number(entry.price) * (1 + Number(entry.gst))).toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingEntry(entry);
                              setUpdateFormData({
                                pricelist: entry.pricelist,
                                product: entry.product,
                                price: entry.price,
                                gst: entry.gst,
                              });
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(entry.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, skip - limit))}
                      disabled={skip === 0}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(skip + limit)}
                      disabled={skip + limit >= total}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Price Entry</h2>
            </div>
            <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricelist *</label>
                <input
                  type="text"
                  required
                  value={formData.pricelist}
                  onChange={(e) => setFormData({ ...formData, pricelist: e.target.value })}
                  list="pricelists"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Food Square"
                />
                <datalist id="pricelists">
                  {availablePricelists.map(pl => <option key={pl} value={pl} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product *</label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  list="products"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Cashew W240 Without Skin Loose FG"
                />
                <datalist id="products">
                  {availableProducts.map(prod => <option key={prod} value={prod} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (without GST) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="850.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GST (0.05 for 5%, 0.18 for 18%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gst || ''}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.05"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetCreateForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Create Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Entry Modal */}
      {isUpdateModalOpen && editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Price Entry</h2>
            </div>
            <form onSubmit={handleUpdateEntry} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricelist</label>
                <input
                  type="text"
                  value={updateFormData.pricelist}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, pricelist: e.target.value })}
                  list="pricelists"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product</label>
                <input
                  type="text"
                  value={updateFormData.product}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, product: e.target.value })}
                  list="products"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (without GST)</label>
                <input
                  type="number"
                  step="0.01"
                  value={updateFormData.price || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GST (0.05 for 5%, 0.18 for 18%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={updateFormData.gst || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, gst: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingEntry(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bulk Upload Price Entries</h2>
            </div>
            <form onSubmit={handleBulkUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CSV Data (Format: pricelist, product, price, gst)
                </label>
                <textarea
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Food Square, Cashew W240 Without Skin Loose FG, 850.00, 0.05
Smart Bazaar, Cashew W320 With Skin, 825.00, 0.05"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Each line should have: pricelist, product, price, gst (optional)
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkModalOpen(false);
                    setBulkData('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Upload Entries
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this price entry? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEntry}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
