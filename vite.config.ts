import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Mock API for development
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle contact form submissions
          if (req.url === '/api/contact' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', () => {
              console.log('Contact form submission:', JSON.parse(body));
              
              // Simulate successful API response
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Message sent successfully (DEV MODE)' }));
            });
            
            return;
          }
          
          // Handle consultation bookings
          if (req.url === '/api/book-consultation' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', () => {
              console.log('Consultation booking:', JSON.parse(body));
              
              // Simulate successful API response with fake meet link
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                message: 'Consultation booked successfully (DEV MODE)',
                meetLink: 'https://meet.google.com/mock-link-for-dev'
              }));
            });
            
            return;
          }
          
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});
