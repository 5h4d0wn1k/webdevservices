import React from 'react';
import { FaCode, FaLaptopCode, FaPalette, FaShoppingCart, FaMobileAlt } from 'react-icons/fa';

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

interface ScrollExperienceDataType {
  heroHeading: string;
  heroDescription: string;
  featuresSubheading: string;
  learnMoreButtonText: string;
  sections: ScrollSection[];
}

export const scrollExperienceData: ScrollExperienceDataType = {
  heroHeading: "Experience Web Design Like Never Before",
  heroDescription: "Scroll to discover our premium web development services with incredible attention to detail and craftsmanship",
  featuresSubheading: "Features",
  learnMoreButtonText: "Learn More",
  sections: [
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
  ]
}; 