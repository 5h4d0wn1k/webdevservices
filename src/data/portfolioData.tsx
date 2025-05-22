import { Code2, Smartphone, ShoppingBag, Globe2 } from 'lucide-react';
import React from 'react';

interface Category {
  id: string;
  label: string;
  icon?: JSX.Element;
}

interface Project {
  title: string;
  category: string;
  image: string;
  description: string;
  link: string;
}

interface PortfolioDataType {
  spanText: string;
  headingText: string;
  descriptionText: string;
  viewProjectButtonText: string;
  categories: Category[];
  projects: Project[];
}

export const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'web', label: 'Web Development', icon: <Code2 className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'app', label: 'Web Apps', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'ngo', label: 'Non-Profit', icon: <Globe2 className="w-4 h-4" /> }
];

export const projects = [
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

export const portfolioData: PortfolioDataType = {
  spanText: "Our Work",
  headingText: "Featured Projects",
  descriptionText: "Explore our collection of award-winning projects that showcase our expertise in creating exceptional digital experiences.",
  viewProjectButtonText: "View Project",
  categories: categories,
  projects: projects
}; 