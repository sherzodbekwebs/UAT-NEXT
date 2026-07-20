import axios from 'axios';

const getEnvApiUrl = () => {
    const value = process.env.NEXT_PUBLIC_API_URL || '';
    return value.replace(/\/+$/, '');
};

// 🚀 Next.js va Vite muhit o'zgaruvchilari uchun umumiy manzil
export const API_URL = getEnvApiUrl();

const API = axios.create({
    baseURL: API_URL || undefined,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
});

API.interceptors.request.use((config) => {
    const safeConfig = config || {};
    const safeHeaders = safeConfig.headers || {};
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
        safeHeaders.Authorization = `Bearer ${token}`;
        safeConfig.headers = safeHeaders;
    }

    return safeConfig;
});

export default API;