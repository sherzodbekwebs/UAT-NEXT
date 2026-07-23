import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',        // Statik HTML fayllar yaratish buyrug'i
    trailingSlash: false  ,     // Sahifalar oxiriga "/" qo'shadi, bu cPanel'da 404 xatosini oldini oladi
    images: {
        unoptimized: true,   // Statik exportda Next.js rasmlarni optimizatsiya qila olmaydi
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