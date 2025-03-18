import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about' },
    { 
      name: 'Services', 
      href: '#services',
      dropdown: [
        { name: 'Web Development', href: '#web-development' },
        { name: 'E-commerce', href: '#e-commerce' },
        { name: 'Web Applications', href: '#web-applications' },
        { name: 'Digital Marketing', href: '#digital-marketing' }
      ]
    },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 flex items-center"
          >
            <a href="/" className="flex items-center gap-2">
              <Logo className="h-10 w-10" />
              <span className="text-transparent bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-2xl font-bold">
                SHADOWNIK
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <a 
                      href={item.href}
                      className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                      onClick={() => 'dropdown' in item ? handleDropdownToggle(item.name) : closeDropdowns()}
                    >
                      {item.name}
                    </a>
                    {'dropdown' in item && (
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                        onClick={() => handleDropdownToggle(item.name)}
                      />
                    )}
                  </motion.div>
                  
                  {/* Dropdown Menu */}
                  {'dropdown' in item && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black/90 backdrop-blur-lg border border-white/10 z-50"
                        >
                          <div className="py-1">
                            {item.dropdown?.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-primary transition-colors"
                                onClick={closeDropdowns}
                              >
                                {dropdownItem.name}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-primary p-2"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-lg rounded-b-2xl border-t border-white/10 mt-2 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between">
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-primary hover:bg-white/5 block px-3 py-2 rounded-lg text-base font-medium transition-colors w-full"
                        onClick={() => !('dropdown' in item) && setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                      {'dropdown' in item && (
                        <button 
                          onClick={() => handleDropdownToggle(item.name)}
                          className="p-2 text-gray-300"
                          aria-label={`Toggle ${item.name} dropdown`}
                        >
                          <ChevronDown size={18} className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Dropdown */}
                    {'dropdown' in item && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pl-4 pb-1"
                      >
                        {item.dropdown?.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="text-gray-400 hover:text-primary block px-3 py-2 rounded-lg text-sm transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {dropdownItem.name}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;