import React from 'react';
import {
  Code2,
  Smartphone,
  ShoppingBag,
  Database,
  Palette,
  Gauge,
  Blocks,
  BrainCircuit,
  CheckCircle
} from 'lucide-react';

interface Service {
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
  features: string[];
  caseStudy: string;
}

interface Category {
  id: string;
  name: string;
  services?: string[];
}

interface ServicesDataType {
  spanText: string;
  services: Service[];
  categories: Category[];
}

export const servicesData: ServicesDataType = {
  spanText: "Our Expertise",
  services: [
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
  ],
  categories: [
    { id: "all", name: "All Services" },
    { id: "web", name: "Web", services: ["web-development", "performance", "cms-solutions"] },
    { id: "mobile", name: "Mobile", services: ["mobile-solutions"] },
    { id: "commerce", name: "Commerce", services: ["e-commerce"] },
    { id: "infrastructure", name: "Infrastructure", services: ["backend-systems", "performance"] },
    { id: "design", name: "Design", services: ["design-branding"] },
    { id: "innovation", name: "Innovation", services: ["ai-integrations"] }
  ]
}; 