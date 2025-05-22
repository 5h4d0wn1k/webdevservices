import React from 'react';
import { FaRocket, FaCode, FaCog, FaLightbulb } from 'react-icons/fa';

interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>; // Using ComponentType for icons
  gradient: string;
}

interface ClientOnboardingDataType {
  sectionHeading: string;
  sectionDescription: string;
  stepTexts: string[]; // Array for step numbers/indicators
  step1: {
    heading: string;
    projectTypes: ProjectType[];
  };
  step2: {
    heading: string;
    formLabels: {
      businessName: string;
      industry: string;
      companySize: string;
      website: string;
    };
    companySizeOptions: { value: string; label: string }[];
  };
  step3: {
    heading: string;
    labels: {
      features: string;
      design: string;
      timeline: string;
      budget: string;
    };
    featureOptions: string[];
    timelineOptions: { value: string; label: string }[];
    budgetOptions: { value: string; label: string }[];
    designPlaceholder: string;
  };
  step4: {
    heading: string;
    labels: {
      technologies: string;
      hosting: string;
      domain: string;
    };
    technologyOptions: string[];
    hostingOptions: { value: string; label: string }[];
    domainOptions: { value: string; label: string }[];
  };
  step5: {
    heading: string;
  };
  successMessage: {
    heading: string;
    text: string;
    buttonText: string;
  };
  errorMessage: {
    heading: string;
    text: string;
    buttonText: string;
  };
  nextButtonText: string;
}

export const clientOnboardingData: ClientOnboardingDataType = {
  sectionHeading: "Start Your Project",
  sectionDescription: "Let's bring your vision to life. Follow these steps to get started with your web development project.",
  stepTexts: ["1", "2", "3", "4", "5"],
  step1: {
    heading: "What type of project are you looking to build?",
    projectTypes: [
      {
        id: 'website',
        title: 'Business Website',
        description: 'Professional website to showcase your business',
        icon: FaRocket,
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'ecommerce',
        title: 'E-commerce Store',
        description: 'Online store with product management and payments',
        icon: FaCode,
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 'webapp',
        title: 'Web Application',
        description: 'Custom web application with specific functionality',
        icon: FaCog,
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 'portal',
        title: 'Client Portal',
        description: 'Secure portal for client/customer access',
        icon: FaLightbulb,
        gradient: 'from-green-500 to-emerald-500'
      }
    ]
  },
  step2: {
    heading: "Tell us about your business",
    formLabels: {
      businessName: "Business Name",
      industry: "Industry",
      companySize: "Company Size",
      website: "Current Website (if any)",
    },
    companySizeOptions: [
      { value: "", label: "Select size" },
      { value: "1-10", label: "1-10 employees" },
      { value: "11-50", label: "11-50 employees" },
      { value: "51-200", label: "51-200 employees" },
      { value: "201+", label: "201+ employees" },
    ]
  },
  step3: {
    heading: "Project Requirements",
    labels: {
      features: "Select Required Features",
      design: "Design Preferences",
      timeline: "Timeline",
      budget: "Budget Range",
    },
    featureOptions: [
      'Responsive Design',
      'Content Management System',
      'User Authentication',
      'Payment Integration',
      'Blog/News Section',
      'Contact Forms',
      'Search Functionality',
      'Analytics Integration',
      'Social Media Integration',
      'Multi-language Support'
    ],
    timelineOptions: [
      { value: "", label: "Select timeline" },
      { value: "1-2", label: "1-2 months" },
      { value: "3-4", label: "3-4 months" },
      { value: "5-6", label: "5-6 months" },
      { value: "6+", label: "6+ months" },
    ],
    budgetOptions: [
      { value: "", label: "Select budget" },
      { value: "5k-10k", label: "$5,000 - $10,000" },
      { value: "10k-25k", label: "$10,000 - $25,000" },
      { value: "25k-50k", label: "$25,000 - $50,000" },
      { value: "50k+", label: "$50,000+" },
    ],
    designPlaceholder: "Describe your design preferences, brand guidelines, or reference websites...",
  },
  step4: {
    heading: "Technical Requirements",
    labels: {
      technologies: "Preferred Technologies",
      hosting: "Hosting Preference",
      domain: "Domain Status",
    },
    technologyOptions: [
      'React',
      'Next.js',
      'Node.js',
      'WordPress',
      'Shopify',
      'MongoDB',
      'PostgreSQL',
      'AWS',
      'Vercel',
      'Netlify'
    ],
    hostingOptions: [
      { value: "", label: "Select hosting" },
      { value: "aws", label: "AWS" },
      { value: "vercel", label: "Vercel" },
      { value: "netlify", label: "Netlify" },
      { value: "other", label: "Other" },
    ],
    domainOptions: [
      { value: "", label: "Select status" },
      { value: "have", label: "I have a domain" },
      { value: "need", label: "Need to purchase" },
      { value: "transfer", label: "Need to transfer" },
    ],
  },
  step5: {
    heading: "Schedule a Consultation",
  },
  successMessage: {
    heading: "Thank You!",
    text: "Your project details have been submitted successfully. We'll be in touch shortly.",
    buttonText: "Start New Project",
  },
  errorMessage: {
    heading: "Oops!",
    text: "There was an error submitting your project. Please try again.",
    buttonText: "Try Again",
  },
  nextButtonText: "Next Step",
}; 