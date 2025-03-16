import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "CEO",
    company: "TechVision",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    quote: "Shadownik transformed our outdated web presence into a modern, high-performance platform. Our conversions increased by 45% within the first month after launch. Their team was incredibly responsive and delivered exactly what we needed."
  },
  {
    id: 2,
    name: "Sarah Parker",
    role: "Marketing Director",
    company: "EcoGrow",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    quote: "I've worked with many development firms in the past, but Shadownik stands out for their attention to detail and commitment to quality. They not only built our e-commerce store but continued to optimize it for peak performance."
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Founder",
    company: "NexStream",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    quote: "The team at Shadownik delivered our SaaS platform ahead of schedule and under budget. Their technical expertise and project management skills are unmatched. We're already planning our next project with them."
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Product Manager",
    company: "Innovatech",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 4,
    quote: "Working with Shadownik was a game-changer for our startup. They took our concept and turned it into a polished, user-friendly application that our customers love. Their agile approach kept us involved throughout the process."
  },
  {
    id: 5,
    name: "David Wilson",
    role: "E-commerce Director",
    company: "StyleHouse",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    quote: "Our e-commerce sales increased by 75% after launching the new site built by Shadownik. Their understanding of UX/UI best practices and conversion optimization strategies made all the difference."
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; isActive: boolean }> = ({ testimonial, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.9 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className={`relative mx-auto max-w-3xl bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-10 shadow-xl border ${
        isActive ? 'border-primary/30' : 'border-white/10'
      } transition-all duration-300`}
    >
      <div className="absolute -top-5 -left-5 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
        <Quote size={18} className="text-white" />
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-14 h-14 rounded-full border-2 border-primary/30 object-cover"
          />
          <div className="ml-4">
            <h4 className="text-lg font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-gray-400">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'} 
            />
          ))}
        </div>
      </div>
      
      <blockquote className="text-gray-300 italic relative">
        "{testimonial.quote}"
      </blockquote>
    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrevious = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 bottom-0 w-96 h-96 bg-primary/20 rounded-full filter blur-[120px]" />
        <div className="absolute right-1/4 top-0 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4">
            <Star size={14} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Client Success</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Discover how we've helped businesses transform their digital presence
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Testimonial Carousel */}
          <div className="overflow-hidden pb-12">
            <AnimatePresence mode="wait">
              <TestimonialCard 
                key={testimonials[activeIndex].id} 
                testimonial={testimonials[activeIndex]} 
                isActive={true}
              />
            </AnimatePresence>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-colors"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-primary w-6' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-colors"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 