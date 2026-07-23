import axios from 'axios';

// 1. URL'ni aniqlash
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.uzautotrailer.uz/api';

// 2. Axios instance yaratish
const API = axios.create({
    // baseURL bo'sh bo'lib qolmasligi uchun aniq qiymat beramiz
    baseURL: BASE_URL.replace(/\/+$/, ''), 
    timeout: 30000, // Build vaqtida internet sekin bo'lishi mumkin, shunga vaqtni cho'zdik
    headers: {
        Accept: 'application/json',
    },
});

API.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;