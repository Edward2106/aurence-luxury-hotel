// Centralized API Configuration for Aurence Luxury Hotel Frontend

const rawEnvUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

function getApiBaseUrl() {
  if (rawEnvUrl && typeof rawEnvUrl === 'string' && rawEnvUrl.trim()) {
    let cleanUrl = rawEnvUrl.trim().replace(/\/+$/, '');
    if (!cleanUrl.endsWith('/api')) {
      cleanUrl += '/api';
    }
    return cleanUrl;
  }

  // Production Safeguard: Never fall back to localhost in production
  if (import.meta.env.PROD || !import.meta.env.DEV) {
    console.error(
      '❌ CRITICAL API CONFIG ERROR: Neither VITE_API_URL nor VITE_API_BASE_URL is configured in Netlify production build!'
    );
    console.error('👉 Please set VITE_API_URL=https://your-railway-backend.up.railway.app in Netlify Site Settings.');
    return '';
  }

  // Development Fallback
  return 'http://localhost:5000/api';
}

export const API_BASE_URL = getApiBaseUrl();
export const SERVER_BASE_URL = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : '';
