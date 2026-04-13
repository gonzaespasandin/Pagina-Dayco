import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('[api] VITE_API_URL no está definida. Configurá el archivo .env.');
}

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
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