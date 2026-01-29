'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearAuth, getAuth } from '../lib/auth';
import { getShops, createShop, updateShop, deleteShop } from '../lib/api';
import { Shop, CreateShopRequest } from '../types';

export default function DashboardPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateShopRequest>({
    company: '',
    users: '',
    pos_shop_name: '',
    email: '',
    password: '',
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set mounted to true once component is on client
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only check authentication and fetch data after component is mounted
    if (!mounted) return;

    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Fetch shops
    fetchShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, router]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShops(0, 300);
      setShops(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);

    try {
      await createShop(formData);
      setIsModalOpen(false);
      setFormData({
        company: '',
        users: '',
        pos_shop_name: '',
        email: '',
        password: '',
      });
      // Refresh the shops list
      await fetchShops();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create shop');
      console.error('Error creating shop:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      company: shop.company,
      users: shop.users,
      pos_shop_name: shop.pos_shop_name,
      email: shop.email,
      password: '', // Password is not shown, user needs to enter new one
    });
    setIsUpdateModalOpen(true);
    setUpdateError(null);
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop) return;

    setUpdateError(null);
    setUpdateLoading(true);

    try {
      await updateShop(editingShop.id, formData);
      setIsUpdateModalOpen(false);
      setEditingShop(null);
      setFormData({
        company: '',
        users: '',
        pos_shop_name: '',
        email: '',
        password: '',
      });
      // Refresh the shops list
      await fetchShops();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update shop');
      console.error('Error updating shop:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId === null) return;

    setDeleteLoading(true);
    try {
      await deleteShop(deleteConfirmId);
      setDeleteConfirmId(null);
      // Refresh the shops list
      await fetchShops();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shop');
      setDeleteConfirmId(null);
      console.error('Error deleting shop:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication after mount
  if (!isAuthenticated()) {
    return null;
  }

  const auth = getAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
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
              className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 whitespace-nowrap"
            >
              User Management
            </button>
            <button
              onClick={() => router.push('/product-management')}
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
            >
              Product Management
            </button>
            <button
              onClick={() => router.push('/pos')}
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
            >
              POS
            </button>
            <button
              onClick={() => router.push('/stock-take')}
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
            >
              Stock Take
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* User Management Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            User Management
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Total Users: <span className="font-semibold text-gray-900 dark:text-white">{shops.length}</span>
            </p>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-initial px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
              >
                Create New
              </button>
              <button
                onClick={fetchShops}
                disabled={loading}
                className="flex-1 sm:flex-initial px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              All Users
            </h2>
          </div>

          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
          )}

          {error && (
            <div className="p-6 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={fetchShops}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && shops.length === 0 && (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              No users found
            </div>
          )}

          {!loading && !error && shops.length > 0 && (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Shop Name
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                          Email
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Users
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                          Created At
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {shops.map((shop) => (
                        <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {shop.id}
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-[100px] sm:max-w-none truncate">
                            {shop.company}
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-[100px] sm:max-w-none truncate">
                            {shop.pos_shop_name}
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-[150px] lg:max-w-none truncate">
                            {shop.email}
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {shop.users}
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                            {new Date(shop.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            <div className="flex gap-1.5 sm:gap-2">
                              <button
                                onClick={() => handleEditClick(shop)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1"
                                title="Edit"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(shop.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                                title="Delete"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Shop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Create New Shop
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCreateError(null);
                    setFormData({
                      company: '',
                      users: '',
                      pos_shop_name: '',
                      email: '',
                      password: '',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateShop} className="p-4 sm:p-6 space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="pos_shop_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  id="pos_shop_name"
                  name="pos_shop_name"
                  value={formData.pos_shop_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter shop name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label htmlFor="users" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Users *
                </label>
                <input
                  type="text"
                  id="users"
                  name="users"
                  value={formData.users}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter users"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter password"
                />
              </div>

              {createError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {createError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCreateError(null);
                    setFormData({
                      company: '',
                      users: '',
                      pos_shop_name: '',
                      email: '',
                      password: '',
                    });
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {createLoading ? 'Creating...' : 'Create Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Shop Modal */}
      {isUpdateModalOpen && editingShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Update Shop
                </h2>
                <button
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingShop(null);
                    setUpdateError(null);
                    setFormData({
                      company: '',
                      users: '',
                      pos_shop_name: '',
                      email: '',
                      password: '',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateShop} className="p-4 sm:p-6 space-y-4">
              <div>
                <label htmlFor="update-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  id="update-company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="update-pos_shop_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  id="update-pos_shop_name"
                  name="pos_shop_name"
                  value={formData.pos_shop_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter shop name"
                />
              </div>

              <div>
                <label htmlFor="update-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="update-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label htmlFor="update-users" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Users *
                </label>
                <input
                  type="text"
                  id="update-users"
                  name="users"
                  value={formData.users}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter users"
                />
              </div>

              <div>
                <label htmlFor="update-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="update-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter new password"
                />
              </div>

              {updateError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {updateError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setEditingShop(null);
                    setUpdateError(null);
                    setFormData({
                      company: '',
                      users: '',
                      pos_shop_name: '',
                      email: '',
                      password: '',
                    });
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {updateLoading ? 'Updating...' : 'Update Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Delete
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this shop? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

