import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.newsletter, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to subscribe to newsletter');
      }
      
      // Handle success
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after some time
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/20 rounded-full filter blur-[100px]" />
        <div className="absolute left-0 top-0 w-64 h-64 bg-accent/20 rounded-full filter blur-[100px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4">
                <Mail size={14} className="text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Stay Updated</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-400 mb-6">
                Get the latest web development insights, trends, and Shadownik news delivered directly to your inbox.
              </p>
              <ul className="space-y-2">
                {['Early access to new content', 'Web development tips & tricks', 'Industry insights & trends', 'Exclusive offers & updates'].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle size={18} className="text-primary mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Form */}
            <div>
              <div className="bg-black/20 rounded-xl p-6 md:p-8 border border-white/5">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-16 h-16 bg-green-900/30 flex items-center justify-center rounded-full mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-400">
                      You've successfully subscribed to our newsletter.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Join Our Mailing List</h3>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-3 bg-black/30 border ${
                          error ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                        } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors`}
                      />
                      {error && (
                        <div className="mt-2 flex items-center text-sm text-red-400">
                          <AlertCircle size={14} className="mr-1" />
                          {error}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Subscribe
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 pt-2">
                      By subscribing, you agree to our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and consent to receive updates from Shadownik.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 