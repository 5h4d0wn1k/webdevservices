import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Smartphone,
  ShoppingBag,
  Globe2,
  ExternalLink,
  Sparkles,
  Trophy,
  Rocket
} from 'lucide-react';
import { featuredProjectsData, FeaturedProject } from '../data/featuredProjectsData';

// Create motion components with forwardRef
const MotionDiv = motion(forwardRef((props: any, ref) => (
  <div ref={ref} {...props} />
)));

const MotionA = motion(forwardRef((props: any, ref) => (
  <a ref={ref} {...props} />
)));

// Wrap PortfolioCard with forwardRef
const ProjectCard = forwardRef(({ project, index }: { project: FeaturedProject, index: number }, ref: React.Ref<HTMLDivElement>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionDiv
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-lg border border-white/10">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 transition-opacity duration-500" />
          
          {/* Glowing orb effect */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg backdrop-blur-sm border border-white/10">
              {project.icon}
            </div>
            <span className="text-sm font-medium text-gray-300">
              {project.category}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-3 leading-tight bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
            {project.title}
          </h3>

          <AnimatePresence>
            {isHovered && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                      <div className="text-white font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {value as string}
                      </div>
                      <div className="text-gray-400 text-xs capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/20 to-accent/20 rounded-full text-white/80 border border-white/10 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <MotionA
                  href={project.link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-primary to-accent rounded-lg px-4 py-2 hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  View Case Study <ExternalLink className="ml-2" size={16} />
                </MotionA>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionDiv>
  );
});

// Add display name for the forwarded ref component
ProjectCard.displayName = 'PortfolioCard';

const FeaturedProjects = () => {
  const { spanText, headingText, descriptionText, viewAllButtonText, projects } = featuredProjectsData;

  return (
    <section className="py-24 px-4 relative overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-primary uppercase tracking-wider text-sm font-medium">{spanText}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent animate-gradient">
            {headingText}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {descriptionText}
          </p>
        </MotionDiv>

        <MotionDiv
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project: FeaturedProject, index: number) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </AnimatePresence>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <MotionA
            href="#portfolio"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-3 rounded-full hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-white/10 backdrop-blur-sm group"
          >
            <Rocket className="w-5 h-5 group-hover:animate-pulse" />
            <span>{viewAllButtonText}</span>
          </MotionA>
        </MotionDiv>
      </div>
    </section>
  );
};

export default FeaturedProjects;