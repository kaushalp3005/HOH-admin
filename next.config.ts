import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Output configuration - use 'standalone' for optimized builds
  // For Netlify, we don't need standalone, default is fine

  // Environment variables
  env: {
    BACKEND_URL: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  },

  // Image optimization (optional, if you use Next.js Image component)
  images: {
    domains: [], // Add your image domains here if needed
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;
