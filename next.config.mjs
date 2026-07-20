import path from 'path';

export default {
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
