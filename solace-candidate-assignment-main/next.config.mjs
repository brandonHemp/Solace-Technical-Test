/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Disable webpack cache to fix memory allocation errors
    config.cache = false;
    
    return config;
  },
};

export default nextConfig;
