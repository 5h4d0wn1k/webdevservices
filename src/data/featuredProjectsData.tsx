import { Code2, Layers, Cpu, Smartphone, Globe2, Trophy, Rocket } from 'lucide-react';
import React from 'react';

interface ProjectStats {
  [key: string]: string;
}

export interface FeaturedProject {
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  stats: ProjectStats;
  tags: string[];
  icon: JSX.Element;
}

interface FeaturedProjectsDataType {
  spanText: string;
  headingText: string;
  descriptionText: string;
  viewAllButtonText: string;
  projects: FeaturedProject[];
}

export const featuredProjectsData: FeaturedProjectsDataType = {
  spanText: "Featured Work",
  headingText: "Our Top Projects",
  descriptionText: "Transforming visions into digital masterpieces. Each project represents our commitment to excellence and innovation.",
  viewAllButtonText: "View All Projects",
  projects: [
  {
    title: "Sunrise Public School",
    category: "education",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
    description: "Official website for Sunrise Public School featuring admissions, curriculum, and student portal.",
    link: "#",
    stats: {},
    tags: [],
    icon: <Smartphone className="w-6 h-6" />
  },
  {
    title: "Cybersecurity Services",
    category: "web",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
    description: "Comprehensive cybersecurity services and product offerings for enterprises and SMBs.",
    link: "https://cybersecurity.shadownik.online",
    stats: {},
    tags: [],
    icon: <Code2 className="w-6 h-6" />
  },
  {
    title: "NGO Social Projects",
    category: "ngo",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
    description: "Platform for social impact initiatives and community engagement projects.",
    link: "https://ngo.shadownik.online",
    stats: {},
    tags: [],
    icon: <Globe2 className="w-6 h-6" />
  }
  ]
}; 