import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',       
    trailingSlash: true,    
    images: {
        unoptimized: true,   
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