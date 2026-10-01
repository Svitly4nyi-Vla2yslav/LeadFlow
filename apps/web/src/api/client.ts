import axios from 'axios';

/**
 * Створює спільний HTTP-клієнт для вебзастосунку.
 * У розробці запити йдуть на локальний сервер, а у production — на той самий origin;
 * cookies додаються до запитів через `withCredentials`.
 */
export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || ((import.meta as any).env.PROD ? '' : 'http://localhost:3001'),
  withCredentials: true
});

/**
 * Пропускає успішну відповідь без змін, а помилку повертає відхиленим Promise.
 * За відповіді 401 додатково сповіщає інтерфейс подією `leadflow:unauthorized`;
 * підписники можуть централізовано показати форму входу або завершити сесію.
 */
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && typeof window !== 'undefined') window.dispatchEvent(new Event('leadflow:unauthorized'));
  return Promise.reject(error);
});
