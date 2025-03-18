import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Smartphone,
  ShoppingBag,
  Globe2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'web', label: 'Web Development', icon: <Code2 className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'app', label: 'Web Apps', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'ngo', label: 'Non-Profit', icon: <Globe2 className="w-4 h-4" /> }
];

const projects = [
  {
    title: "Sunrise Public School",
    category: "education",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
    description: "Official website for Sunrise Public School featuring admissions, curriculum, and student portal.",
    link: "#"
  },
  {
    title: "Cybersecurity Services",
    category: "web",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
    description: "Comprehensive cybersecurity services and product offerings for enterprises and SMBs.",
    link: "https://cybersecurity.shadownik.online"
  },
  {
    title: "NGO Social Projects",
    category: "ngo",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
    description: "Platform for social impact initiatives and community engagement projects.",
    link: "https://ngo.shadownik.online"
  },
  {
    title: "Metatask App",
    category: "app",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1200",
    description: "Productivity and task management web application with enhanced collaboration features.",
    link: "https://metatask.shadownik.online"
  },
  {
    title: "Prize Payout Platform",
    category: "app",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=1200",
    description: "Secure platform for managing and distributing competition prizes and rewards.",
    link: "https://prizepayout.vercel.app/"
  },
  {
    title: "Portfolio - Nikhil Nagpure",
    category: "web",
    image: "https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&q=80&w=1200",
    description: "Professional portfolio showcasing the skills and projects of Nikhil Nagpure.",
    link: "https://portfolio.shadownik.tech"
  }
];

// Create motion components with forwardRef
const MotionDiv = motion(forwardRef((props: any, ref) => (
  <div ref={ref} {...props} />
)));

const MotionA = motion(forwardRef((props: any, ref) => (
  <a ref={ref} {...props} />
)));

// Wrap PortfolioCard with forwardRef
const PortfolioCard = forwardRef(({ project }: { project: typeof projects[0] }, ref: React.Ref<HTMLDivElement>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionDiv
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl aspect-w-16 aspect-h-9">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {project.title}
          </h3>
          <p className="text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.description}
          </p>
          
          <AnimatePresence>
            {isHovered && (
              <MotionA
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                href={project.link}
                className="inline-flex items-center text-sm bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:from-primary/30 hover:to-accent/30 transition-colors w-fit border border-white/10"
              >
                View Project <ExternalLink className="ml-2 text-primary" size={16} />
              </MotionA>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionDiv>
  );
});

// Add display name for the forwarded ref component
PortfolioCard.displayName = 'PortfolioCard';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = projects.filter(
    project => activeCategory === 'all' || project.category === activeCategory
  );

  return (
    <section id="portfolio" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-primary uppercase tracking-wider text-sm font-medium">Our Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
            Explore our collection of award-winning projects that showcase our expertise in creating exceptional digital experiences.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.label}
              </button>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <PortfolioCard key={project.title} project={project} />
            ))}
          </AnimatePresence>
        </MotionDiv>
      </div>
    </section>
  );
};

export default Portfolio;