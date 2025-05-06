import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

type PageTransitionProps = {
  children: React.ReactNode;
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Variants for loading screen
  const loadingVariants = {
    initial: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };
  
  // Logo animation for loading screen
  const logoVariants = {
    initial: {
      opacity: 0,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const progressVariants = {
    initial: {
      width: "0%"
    },
    animate: {
      width: "100%",
      transition: {
        duration: 1.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={loadingVariants}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          <motion.div 
            variants={logoVariants}
            className="mb-12"
          >
            <Logo className="w-32 h-32" />
          </motion.div>
          
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              variants={progressVariants}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-2xl font-light text-white"
          >
            swnk
          </motion.h2>
        </motion.div>
      ) : (
        <motion.div
          key="page"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition; 