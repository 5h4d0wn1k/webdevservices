// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Detect the port from window.location in browser environments
const getPort = () => {
  if (typeof window !== 'undefined') {
    return window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
  }
  return '5173'; // Fallback for SSR
};

// Base URL configuration
export const API_BASE_URL = isDevelopment 
  ? `${window?.location?.protocol || 'http:'}//${window?.location?.hostname || 'localhost'}:${getPort()}`
  : 'https://web.shadownik.online';

// API endpoints configuration
export const API_ENDPOINTS = {
  contact: `/api/contact`,
  bookConsultation: `/api/book-consultation`,
  submitProject: `/api/submit-project`,
  newsletter: `/api/newsletter`,
};

// API configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
};

// API error messages
export const API_ERROR_MESSAGES = {
  networkError: 'Network error. Please check your internet connection.',
  timeoutError: 'Request timed out. Please try again.',
  serverError: 'Server error. Please try again later.',
  unauthorized: 'Unauthorized access. Please login again.',
  forbidden: 'Access forbidden. Please check your permissions.',
  notFound: 'Resource not found.',
  validationError: 'Please check your input and try again.',
}; 