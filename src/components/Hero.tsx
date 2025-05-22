import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Star } from 'lucide-react';
import { Scene } from './3d/Scene';
import { Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';
import { heroData } from '../data/heroData';

const Hero = () => {
  const { spanText, headingTextPart1, headingTextPart2, descriptionText, exploreButtonText, exploreButtonHref, startButtonText, startButtonHref } = heroData;

  return (
    <div className="relative pt-20 min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/20 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-[800px] h-[800px] bg-accent/20 rounded-full filter blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-12"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 backdrop-blur-sm">
              <Star className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-primary uppercase tracking-wider text-sm font-medium">
                {spanText}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-8xl font-bold mb-12 leading-[1.1]"
          >
            <span className="block mb-4">{headingTextPart1}</span>
            <span className="bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent animate-gradient">
              {headingTextPart2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-xl sm:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10"
          >
            {descriptionText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <motion.a
              href={exploreButtonHref}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-full hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
            >
              <Rocket className="w-6 h-6 group-hover:animate-bounce" />
              Explore Our Work
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <Link
              to="/onboarding"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-white/5 to-white/10 text-white font-medium rounded-full hover:from-white/10 hover:to-white/15 transition-all duration-300 border border-white/10 backdrop-blur-sm"
            >
              <FaRocket className="w-6 h-6 text-primary group-hover:animate-pulse" />
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-[2px] h-24 bg-gradient-to-b from-transparent via-primary to-accent animate-pulse"></div>
      </motion.div>
    </div>
  );
};

export default Hero;