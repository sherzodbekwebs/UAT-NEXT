import axios from 'axios';

// 1. URL'ni aniqlash va EXPORT qilish (Chunki boshqa komponentlar buni ishlatyapti)
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.uzautotrailer.uz').replace(/\/+$/, '');

// 2. Axios instance yaratish
const API = axios.create({
    baseURL: API_URL, // Endi bu: https://api.uzautotrailer.uz
    timeout: 30000,
    headers: { Accept: 'application/json' },
});

API.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;