import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, Settings } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Check if consent was already given on mount
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    setPreferences(allPreferences);
    saveCookiePreferences(allPreferences);
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    setPreferences(minimalPreferences);
    saveCookiePreferences(minimalPreferences);
    setIsVisible(false);
  };

  const saveCookiePreferences = (prefs: typeof preferences) => {
    // Save preferences to localStorage
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    
    // Here you would typically trigger your analytics/marketing/etc scripts
    // based on user preferences
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto bg-gray-900 rounded-xl border border-white/10 shadow-2xl backdrop-blur-lg overflow-hidden">
            {/* Main banner */}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/20 rounded-full mr-4">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Cookie Preferences</h3>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close cookie consent dialog"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies.
              </p>

              {/* Preference toggles - shown only when details are expanded */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 space-y-4"
                  >
                    {Object.entries(preferences).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{key}</div>
                          <div className="text-sm text-gray-400">
                            {key === 'necessary' 
                              ? 'Essential for the website to function properly.' 
                              : key === 'analytics' 
                                ? 'Helps us understand how visitors interact with our website.'
                                : key === 'marketing'
                                  ? 'Used to track visitors across websites for advertising purposes.'
                                  : 'Enables the website to remember your preferences.'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={value}
                            disabled={key === 'necessary'}
                            onChange={() => handleTogglePreference(key as keyof typeof preferences)}
                          />
                          <div className={`w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer 
                            ${value ? 'after:translate-x-full after:border-white bg-primary' : 'after:border-gray-300'} 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                            after:transition-all ${key === 'necessary' ? 'opacity-60' : ''}`}></div>
                        </label>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-3 justify-end items-center">
                <button
                  onClick={toggleDetails}
                  className="flex items-center px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings size={16} className="mr-2" />
                  {showDetails ? 'Hide Details' : 'Customize'}
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Reject All
                </button>
                
                {showDetails && (
                  <button
                    onClick={handleAcceptSelected}
                    className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Save Preferences
                  </button>
                )}
                
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-lg transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>

            {/* Privacy footer */}
            <div className="px-6 py-3 bg-black/30 flex flex-wrap items-center justify-between text-xs text-gray-400">
              <div className="flex items-center">
                <Shield size={14} className="mr-2" />
                <span>Your privacy is important to us</span>
              </div>
              <div className="flex space-x-4">
                <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent; 