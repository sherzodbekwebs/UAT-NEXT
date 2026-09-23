import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',              // ← ENG MUHIM QATOR
  trailingSlash: true,
  images: {
    unoptimized: true,           // statik export uchun kerak
  },
  turbopack: {},
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router-dom': path.join(process.cwd(), 'src', 'router-shim.js'),
      'react-router': path.join(process.cwd(), 'src', 'router-shim.js'),
    };
    return config;
  },
};

export default nextConfig;