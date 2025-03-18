// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5173'  // Development server
  : 'https://web.shadownik.online';  // Production server

export const API_ENDPOINTS = {
  contact: `${API_BASE_URL}/api/contact`,
  bookConsultation: `${API_BASE_URL}/api/book-consultation`,
}; 