// src/axiosConfig.js
import axios from 'axios';

// Helper to extract CSRF token from cookie
function getCSRFToken() {
  const name = 'csrftoken=';
  const decoded = decodeURIComponent(document.cookie);
  const cookies = decoded.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.startsWith(name)) {
      return c.substring(name.length);
    }
  }
  return null;
}

// Create Axios instance with base config
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Adjust if backend URL changes
  withCredentials: true,           // Crucial for sending cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Automatically attach CSRF token on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
