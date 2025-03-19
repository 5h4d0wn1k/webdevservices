// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Detect the port from window.location in browser environments
const getPort = () => {
  if (typeof window !== 'undefined') {
    return window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
  }
  return '5173'; // Fallback for SSR
};

// In development, use the current host and port
// In production, use the actual domain
export const API_BASE_URL = isDevelopment 
  ? `${window?.location?.protocol || 'http:'}//${window?.location?.hostname || 'localhost'}:${getPort()}`
  : 'https://web.shadownik.online';

export const API_ENDPOINTS = {
  contact: `/api/contact`,
  bookConsultation: `/api/book-consultation`,
  submitProject: `/api/submit-project`,
  newsletter: `/api/newsletter`,
}; 