import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Smartphone,
  ShoppingBag,
  Database,
  Palette,
  Gauge,
  Blocks,
  BrainCircuit,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    id: "web-development",
    icon: <Code2 className="w-8 h-8" />,
    title: "Web Development",
    description: "Crafting performant, scalable web applications with cutting-edge technologies and best practices.",
    features: ["Custom Development", "Progressive Web Apps", "API Integration", "Cloud Solutions"],
    caseStudy: "Transformed a legacy corporate website into a modern, responsive platform, resulting in 45% increase in user engagement and 2x conversion rate."
  },
  {
    id: "mobile-solutions",
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Solutions",
    description: "Building native and cross-platform mobile applications that deliver exceptional user experiences.",
    features: ["iOS Development", "Android Development", "React Native", "Flutter"],
    caseStudy: "Developed a cross-platform mobile app for a retail client that integrated with their existing systems, increasing mobile sales by 37%."
  },
  {
    id: "e-commerce",
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "E-Commerce",
    description: "Creating powerful online stores with seamless payment integration and inventory management.",
    features: ["Custom Platforms", "Payment Gateway", "Inventory Systems", "Analytics"],
    caseStudy: "Built a custom e-commerce solution for a boutique brand, resulting in 60% higher conversion rates compared to their previous platform."
  },
  {
    id: "backend-systems",
    icon: <Database className="w-8 h-8" />,
    title: "Backend Systems",
    description: "Developing robust backend infrastructure that scales with your business needs.",
    features: ["API Development", "Database Design", "Cloud Architecture", "Security"],
    caseStudy: "Redesigned the backend architecture for a SaaS platform, improving performance by 70% and reducing operating costs by 35%."
  },
  {
    id: "design-branding",
    icon: <Palette className="w-8 h-8" />,
    title: "Design & Branding",
    description: "Creating stunning visual identities and user interfaces that captivate and convert.",
    features: ["UI/UX Design", "Brand Strategy", "Visual Identity", "Motion Graphics"],
    caseStudy: "Rebranded a tech startup with comprehensive design system, resulting in consistent brand recognition and 40% improved user satisfaction."
  },
  {
    id: "performance",
    icon: <Gauge className="w-8 h-8" />,
    title: "Performance Optimization",
    description: "Supercharging your digital platforms for lightning-fast experiences.",
    features: ["Load Speed", "Core Web Vitals", "Resource Optimization", "Caching Strategies"],
    caseStudy: "Optimized an enterprise web application, reducing load times by 65% and increasing overall system performance by 40%."
  },
  {
    id: "cms-solutions",
    icon: <Blocks className="w-8 h-8" />,
    title: "CMS Solutions",
    description: "Implementing powerful content management systems tailored to your workflow.",
    features: ["WordPress", "Contentful", "Headless CMS", "Custom CMS"],
    caseStudy: "Developed a custom headless CMS for a media company, enabling them to publish across multiple platforms from a single interface."
  },
  {
    id: "ai-integrations",
    icon: <BrainCircuit className="w-8 h-8" />,
    title: "AI Integrations",
    description: "Leveraging artificial intelligence to enhance your digital experiences.",
    features: ["Chatbots", "Recommendation Engines", "NLP", "Predictive Analytics"],
    caseStudy: "Integrated AI-powered recommendation system for an e-learning platform, increasing course completion rates by 32%."
  }
];

// Enhanced ServiceCard component with hover effects and animations
const ServiceCard = ({ 
  service, 
  index, 
  isActive, 
  onClick 
}: { 
  service: typeof services[0], 
  index: number,
  isActive: boolean,
  onClick: () => void 
}) => {
  return (
    <motion.div
      id={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border ${
        isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/10 hover:border-white/30'
      } transition-all duration-300 cursor-pointer`}
      onClick={onClick}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 flex items-center justify-center rounded-lg mb-4 ${
          isActive ? 'bg-primary text-white' : 'bg-white/5 text-primary'
        } transition-colors duration-300`}>
          {service.icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
        <p className="text-gray-400 mb-4">{service.description}</p>
        <div className="space-y-2">
          {service.features.map((feature, idx) => (
            <div key={idx} className="flex items-center">
              <CheckCircle size={16} className="text-primary mr-2" />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
        
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-4 pt-4 border-t border-white/10"
          >
            <p className="text-sm italic text-gray-300">
              <span className="font-semibold text-primary">Case Study:</span> {service.caseStudy}
            </p>
          </motion.div>
        )}
        
        <motion.div 
          className={`absolute bottom-4 right-4 ${isActive ? 'opacity-100' : 'opacity-0'}`}
          animate={{ 
            x: isActive ? 0 : 10,
            opacity: isActive ? 1 : 0
          }}
        >
          <ArrowRight className="text-primary" />
        </motion.div>
      </div>
      
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isActive ? 'from-primary/20 to-transparent' : 'from-transparent to-transparent'
      } rounded-xl opacity-20 transition-opacity duration-300`} />
    </motion.div>
  );
};

const Services = () => {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", name: "All Services" },
    { id: "web", name: "Web", services: ["web-development", "performance", "cms-solutions"] },
    { id: "mobile", name: "Mobile", services: ["mobile-solutions"] },
    { id: "commerce", name: "Commerce", services: ["e-commerce"] },
    { id: "infrastructure", name: "Infrastructure", services: ["backend-systems", "performance"] },
    { id: "design", name: "Design", services: ["design-branding"] },
    { id: "innovation", name: "Innovation", services: ["ai-integrations"] }
  ];
  
  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => {
        const category = categories.find(c => c.id === selectedCategory);
        return category?.services?.includes(service.id);
      });

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-[120px]" />
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4">
            <Sparkles size={14} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Our Expertise</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Comprehensive Web Services</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            We offer a complete spectrum of digital services to transform your online presence
          </p>
        </motion.div>
        
        {/* Category filter tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <AnimatePresence mode="wait">
            {filteredServices.map((service, index) => (
              <ServiceCard 
                key={service.id}
                service={service} 
                index={index} 
                isActive={activeService === service.id}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Get Started with swnk
            <ArrowRight size={16} className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;