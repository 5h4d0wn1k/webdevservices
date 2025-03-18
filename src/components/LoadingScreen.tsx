import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Logo from './Logo';

interface LoadingScreenProps {
  progress: number;
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${
        !isLoading ? 'pointer-events-none' : ''
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <Logo className="w-24 h-24" />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Shadownik
          </h2>
          <p className="text-gray-400 flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading Experience
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">{Math.round(progress)}%</p>

        {/* Loading Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-sm text-gray-500 max-w-sm">
            Crafting digital experiences that push boundaries...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 