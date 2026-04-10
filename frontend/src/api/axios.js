// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  // Uses REACT_APP_API_URL from .env or .env.production
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;