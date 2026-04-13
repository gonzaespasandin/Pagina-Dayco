import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const esLoginEndpoint = error.config?.url?.includes('/auth/login');
        if (!esLoginEndpoint && (error.response?.status === 401 || error.response?.status === 403)) {
            localStorage.removeItem('token');
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);

export default api;