import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || ((import.meta as any).env.PROD ? '' : 'http://localhost:3001'),
  withCredentials: true
});

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && typeof window !== 'undefined') window.dispatchEvent(new Event('leadflow:unauthorized'));
  return Promise.reject(error);
});
