import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue, AnimatePresence } from 'framer-motion';
import { FaCode, FaLaptopCode, FaPalette, FaShoppingCart, FaMobileAlt, FaRocket } from 'react-icons/fa';

// Section interface for our scrollable content
interface ScrollSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  icon: React.ReactNode;
  features?: string[];
}

const sections: ScrollSection[] = [
  {
    id: 'responsive',
    title: 'Responsive Design',
    subtitle: 'Seamless across all devices',
    description: 'Beautiful experiences that adapt flawlessly to any screen size, from desktop to mobile.',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-blue-500 to-purple-600',
    icon: <FaLaptopCode />,
    features: ['Mobile-first approach', 'Fluid layouts', 'Adaptive imagery', 'Touch-friendly interfaces']
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    subtitle: 'Turn visitors into customers',
    description: 'Powerful online stores with intuitive shopping experiences and secure payment processing.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-green-500 to-teal-600',
    icon: <FaShoppingCart />,
    features: ['Secure checkout', 'Inventory management', 'Customer accounts', 'Multiple payment options']
  },
  {
    id: 'custom',
    title: 'Custom Development',
    subtitle: 'Tailored to your needs',
    description: 'Bespoke web solutions built from the ground up with cutting-edge technologies.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-purple-500 to-pink-600',
    icon: <FaCode />,
    features: ['Custom APIs', 'Scalable architecture', 'Third-party integrations', 'Ongoing support']
  },
  {
    id: 'design',
    title: 'UI/UX Design',
    subtitle: 'Intuitive & beautiful',
    description: 'Visually stunning interfaces that guide users through meaningful digital experiences.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1435&q=80',
    color: 'from-red-500 to-orange-600',
    icon: <FaPalette />,
    features: ['User research', 'Wireframing', 'Interactive prototypes', 'A/B testing']
  },
  {
    id: 'mobile',
    title: 'Mobile Applications',
    subtitle: 'Native & cross-platform',
    description: 'Engaging mobile experiences that keep your brand in your customers\' pockets.',
    image: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-cyan-500 to-blue-600',
    icon: <FaMobileAlt />,
    features: ['iOS & Android', 'Performance optimization', 'Push notifications', 'Offline capabilities']
  }
];

// Feature animation element
const FeatureItem: React.FC<{ feature: string; delay: number }> = ({ feature, delay }) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-2 mb-2"
    >
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-white"></span>
      </span>
      <span>{feature}</span>
    </motion.li>
  );
};

// Apple-style sticky header component
const StickyHeader: React.FC<{
  progress: MotionValue<number>;
  section: ScrollSection;
  index: number;
}> = ({ progress, section, index }) => {
  const opacity = useTransform(
    progress,
    [
      index * 0.2, 
      index * 0.2 + 0.025, 
      (index + 0.8) * 0.2, 
      (index + 0.8) * 0.2 + 0.025
    ],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    progress,
    [
      index * 0.2, 
      index * 0.2 + 0.025, 
      (index + 0.8) * 0.2, 
      (index + 0.8) * 0.2 + 0.025
    ],
    [20, 0, 0, -20]
  );

  return (
    <motion.div 
      style={{ opacity, y }}
      className="fixed top-0 left-0 w-full z-40 px-4 py-6 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${section.color}`}>
            {section.icon}
          </div>
          <h3 className="text-xl font-medium text-white">{section.title}</h3>
        </div>
        <div className="hidden md:block">
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${section.color} text-white text-sm font-medium`}>
            {section.subtitle}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ParallaxSection: React.FC<{
  section: ScrollSection;
  scrollYProgress: MotionValue<number>;
  sectionProgress: MotionValue<number>;
  index: number;
}> = ({ section, scrollYProgress, sectionProgress, index }) => {
  // Create transformations based on section progress
  const progress = useTransform(
    sectionProgress,
    [0, 1],
    [0, 1]
  );
  
  // Text animations
  const y = useTransform(
    progress,
    [0, 0.5, 1],
    [100, 0, -100]
  );
  
  const opacity = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [0.9, 1, 1, 0.95]
  );
  
  // Image animations - Apple often uses different speeds for different elements
  const imageY = useTransform(
    progress,
    [0, 1],
    [100, -100]
  );
  
  const imageScale = useTransform(
    progress,
    [0, 0.5, 1],
    [0.8, 1.1, 0.9]
  );
  
  const imageOpacity = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  
  const rotation = useTransform(
    progress,
    [0, 0.5, 1],
    [5, 0, -5]
  );
  
  // Apple-style blur effects
  const textBlur = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [5, 0, 0, 5]
  );
  
  const imageBlur = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [10, 0, 0, 10]
  );
  
  // Staggered feature appearance
  const [featuresVisible, setFeaturesVisible] = useState(false);
  
  useEffect(() => {
    const unsubscribe = opacity.onChange(value => {
      if (value > 0.8) {
        setFeaturesVisible(true);
      } else {
        setFeaturesVisible(false);
      }
    });
    
    return () => unsubscribe();
  }, [opacity]);

  return (
    <div className="h-screen flex items-center justify-center px-4 overflow-hidden snap-center">
      <StickyHeader progress={scrollYProgress} section={section} index={index} />
      
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content with Parallax */}
        <motion.div 
          style={{ 
            y,
            opacity,
            scale,
            filter: `blur(${textBlur}px)`
          }} 
          className="z-10 text-white p-8"
        >
          <div className={`inline-flex items-center space-x-2 text-lg mb-4 px-4 py-2 rounded-full bg-gradient-to-r ${section.color} bg-opacity-20 backdrop-blur-md`}>
            <span className="w-6 h-6 flex items-center justify-center">{section.icon}</span>
            <span>{section.subtitle}</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {section.title}
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
            {section.description}
          </p>
          
          {section.features && featuresVisible && (
            <div className="mb-8">
              <h3 className="text-lg mb-4 uppercase tracking-wide opacity-70">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {section.features.map((feature, i) => (
                  <FeatureItem key={i} feature={feature} delay={i * 0.1} />
                ))}
              </ul>
            </div>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${section.color} px-8 py-4 rounded-full text-white text-lg flex items-center space-x-3 shadow-lg`}
          >
            <span>Learn More</span>
            <FaRocket className="ml-2" />
          </motion.button>
        </motion.div>
        
        {/* Image with Enhanced Parallax - Apple Product Page Style */}
        <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-3xl">
          <motion.div 
            style={{ 
              y: imageY,
              scale: imageScale,
              rotateZ: rotation,
              opacity: imageOpacity,
              filter: `blur(${imageBlur}px)`
            }} 
            className="w-full h-full perspective"
          >
            {/* Apple style multiple layers for depth */}
            <div 
              className="w-full h-full bg-cover bg-center rounded-3xl transform relative"
              style={{ 
                backgroundImage: `url(${section.image})`,
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)'
              }}
            />
            
            {/* Apple-style glossy overlay effect */}
            <div 
              className={`absolute inset-0 opacity-20 bg-gradient-to-br ${section.color} mix-blend-overlay rounded-3xl`}
            />
            
            {/* Subtle highlight on top edge - Apple's signature look */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px] bg-white opacity-20 rounded-t-3xl"
            />
          </motion.div>
          
          {/* Apple-style decorative elements */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white ring-opacity-10" />
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${section.color} filter blur-2xl opacity-20 rounded-3xl`} />
          
          {/* Apple's signature "floating particles" effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-20"
                style={{
                  x: Math.random() * 100 - 50 + '%',
                  y: Math.random() * 100 - 50 + '%',
                }}
                animate={{
                  x: [
                    Math.random() * 100 - 50 + '%',
                    Math.random() * 100 - 50 + '%',
                  ],
                  y: [
                    Math.random() * 100 - 50 + '%',
                    Math.random() * 100 - 50 + '%',
                  ],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScrollExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Setup scroll animations with Apple-style ultra-smooth physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Enhanced spring physics for ultra-smooth scrolling like Apple's website
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,  // Lower for more inertia - Apple signature feel
    damping: 15,    // Lower for more momentum/bounce - Apple signature feel
    restDelta: 0.0001  // Ultra small value for precision
  });
  
  // Create section progress values for each section
  const sectionProgressValues = sections.map((_, i) => {
    return useTransform(
      smoothProgress,
      // Map the overall progress to section progress (0-1) for each section
      [(i) / sections.length, (i + 1) / sections.length],
      [0, 1]
    );
  });
  
  // Calculate container height
  useEffect(() => {
    // Apple often uses longer scrolling experiences
    setContainerHeight(sections.length * 150); // vh units - extra tall for smooth transitions
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        html {
          scroll-behavior: smooth;
        }
        
        body {
          overscroll-behavior: none;
        }
        
        /* For Apple-style snapping */
        .snap-container > * {
          scroll-snap-align: start;
        }
        
        .perspective {
          perspective: 1000px;
        }
        
        /* Apple-style webkit scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}} />
    
      {/* Full-screen hero section with Apple-style fade-out */}
      <motion.div 
        className="h-screen flex flex-col items-center justify-center sticky top-0 z-30 px-6"
        style={{
          opacity: useTransform(smoothProgress, [0, 0.15], [1, 0]),
          scale: useTransform(smoothProgress, [0, 0.15], [1, 0.9])
        }}
      >
        {/* Background gradient animation - Apple style */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-black"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-neon-purple mb-8 max-w-5xl"
        >
          Experience Web Design Like Never Before
        </motion.h1>
        
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-center max-w-3xl text-gray-300 mb-12"
        >
          Scroll to discover our premium web development services with incredible attention to detail and craftsmanship
        </motion.p>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: [0, 10, 0], opacity: 1 }}
          transition={{ 
            y: { repeat: Infinity, duration: 1.5, repeatType: "reverse", ease: "easeInOut" },
            opacity: { duration: 0.8, delay: 0.4 }
          }}
          className="text-primary"
        >
          <svg className="w-12 h-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Apple-inspired ambient background effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs with smoother animations */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-primary/10 filter blur-[120px]"
          animate={{ 
            x: [0, 40, 0, -40, 0],
            y: [0, 40, 0, -40, 0],
            scale: [1, 1.3, 1, 0.7, 1],
            opacity: [0.3, 0.5, 0.3, 0.5, 0.3],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-accent/10 filter blur-[100px]"
          animate={{ 
            x: [0, -30, 0, 30, 0],
            y: [0, -30, 0, 30, 0],
            scale: [1, 0.7, 1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2, 0.4, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-[25vw] h-[25vw] rounded-full bg-neon-purple/5 filter blur-[80px]"
          animate={{ 
            x: [0, 20, 0, -20, 0],
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.2, 1, 0.8, 1],
            opacity: [0.1, 0.3, 0.1, 0.3, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 15 }}
        />
        
        {/* Apple-style fine grid overlay */}
        <div className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} 
        />
      </div>
      
      {/* Scrollable content with section snapping */}
      <div
        ref={containerRef}
        style={{ height: `${containerHeight}vh` }}
        className="relative z-10 snap-container"
      >
        {sections.map((section, i) => (
          <ParallaxSection
            key={section.id}
            section={section}
            scrollYProgress={smoothProgress}
            sectionProgress={sectionProgressValues[i]}
            index={i}
          />
        ))}
      </div>
      
      {/* Apple-style finale section with cross-fade */}
      <motion.div 
        className="h-screen flex flex-col items-center justify-center sticky top-0 z-20 px-6 overflow-hidden"
        style={{
          opacity: useTransform(smoothProgress, [0.85, 0.9], [0, 1]),
          scale: useTransform(smoothProgress, [0.85, 0.9], [0.9, 1])
        }}
      >
        {/* Dynamic background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-neon-purple/20 opacity-40 blur-3xl"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 3, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Apple-style card effect */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg p-12 rounded-3xl max-w-4xl w-full border border-white/10 relative shadow-2xl"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-20 rounded-3xl blur-sm" />
          
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
            Ready to Transform Your Digital Presence?
          </h2>
          
          <p className="text-xl text-center text-gray-300 mb-12">
            Our team of experts is ready to bring your vision to life with cutting-edge web development solutions tailored to your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -15px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-accent px-10 py-5 rounded-full text-white text-xl font-medium flex items-center justify-center gap-3 shadow-lg shadow-primary/30"
            >
              <span>Get Started</span>
              <FaRocket />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-full text-white text-xl font-medium border border-white/20 flex items-center justify-center gap-3 backdrop-blur-sm hover:bg-white/5 transition-colors"
            >
              <span>View Portfolio</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 