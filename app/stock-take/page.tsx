'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearAuth, getAuth } from '../lib/auth';
import { downloadStockVarianceReportAll, downloadStockVarianceReportByDateRange } from '../lib/stockTakeApi';
import { StockVarianceDownloadResponse } from '../types';

export default function StockTakePage() {
  const [mounted, setMounted] = useState(false);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Download state
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [mounted, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
    setDownloadError(null);
    setDownloadSuccess(null);
  };

  const handleDownload = async () => {
    // If one date is provided, both must be provided
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setDownloadError('Please provide both start and end dates, or leave both empty to download all data');
      return;
    }

    setDownloadLoading(true);
    setDownloadError(null);
    setDownloadSuccess(null);

    try {
      let data: StockVarianceDownloadResponse;

      if (startDate && endDate) {
        // Download by date range
        const formattedStartDate = `${startDate}T00:00:00`;
        const formattedEndDate = `${endDate}T23:59:59`;
        data = await downloadStockVarianceReportByDateRange(
          formattedStartDate,
          formattedEndDate
        );
      } else {
        // Download all data
        data = await downloadStockVarianceReportAll();
      }

      // Convert data to CSV
      const csvContent = convertToCSV(data);

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = startDate && endDate
        ? `stock_variance_${startDate}_to_${endDate}.csv`
        : `stock_variance_all_${dateStr}.csv`;

      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(`Downloaded ${data.total} records successfully`);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Failed to download data');
    } finally {
      setDownloadLoading(false);
    }
  };

  const convertToCSV = (data: StockVarianceDownloadResponse): string => {
    if (data.data.length === 0) return '';

    const headers = [
      'Store Name',
      'Start Date',
      'End Date',
      'Product',
      'Unit of Measure',
      'YKey',
      'Open Qty',
      'Close Qty',
      'Difference Qty',
      'POS Total Sale',
      'Variance'
    ];

    const rows = data.data.map(item => [
      `"${(item.store_name || '').replace(/"/g, '""')}"`,
      item.start_date,
      item.end_date,
      `"${(item.product || '').replace(/"/g, '""')}"`,
      item.unit_of_measure,
      item.ykey,
      item.open_qty,
      item.close_qty,
      item.difference_qty,
      item.pos_total_sale,
      item.variance
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              onClick={() => router.push('/dashboard')}
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
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
              className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 whitespace-nowrap"
            >
              Stock Take
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Stock Variance Report
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Download stock variance reports. Leave dates empty to download all data, or select a date range.
          </p>
        </div>

        {/* Download Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Download Stock Variance Data
          </h3>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
              <button
                onClick={handleDownload}
                disabled={downloadLoading}
                className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {downloadLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CSV
                  </>
                )}
              </button>
              <button
                onClick={handleClearDates}
                className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                Clear Dates
              </button>
            </div>
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {startDate && endDate
              ? `Will download data from ${startDate} to ${endDate}`
              : 'No date range selected - will download all available data'
            }
          </p>

          {/* Status Messages */}
          {downloadError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{downloadError}</p>
            </div>
          )}
          {downloadSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">{downloadSuccess}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
