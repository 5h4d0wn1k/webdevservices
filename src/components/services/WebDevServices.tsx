import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaMobile, FaShoppingCart, FaWordpress, FaTools } from 'react-icons/fa';
import { SiWebpack, SiNextdotjs, SiReact, SiTypescript } from 'react-icons/si';

interface ServiceTier {
  name: string;
  price: string;
  features: string[];
  description: string;
  deliveryTime: string;
  recommended?: boolean;
}

interface ServiceCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  technologies: string[];
}

const serviceTiers: ServiceTier[] = [
  {
    name: "Basic Website Package",
    price: "Starting at $999",
    features: [
      "5-7 Pages Website",
      "Mobile Responsive Design",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Social Media Integration",
      "2 Rounds of Revisions",
      "1 Month Support"
    ],
    description: "Perfect for small businesses looking to establish their online presence",
    deliveryTime: "2-3 weeks"
  },
  {
    name: "Professional Business Solution",
    price: "Starting at $2,499",
    features: [
      "10-15 Pages Website",
      "Advanced Responsive Design",
      "Complete SEO Optimization",
      "Custom Forms & Features",
      "CMS Integration",
      "Analytics Setup",
      "Payment Gateway Integration",
      "3 Rounds of Revisions",
      "3 Months Support"
    ],
    description: "Ideal for growing businesses requiring advanced functionality",
    deliveryTime: "4-6 weeks",
    recommended: true
  },
  {
    name: "Enterprise E-commerce",
    price: "Starting at $4,999",
    features: [
      "Unlimited Pages",
      "Full E-commerce Functionality",
      "Custom Product Management",
      "Multiple Payment Gateways",
      "Inventory Management",
      "Order Tracking System",
      "Customer Portal",
      "Advanced Security Features",
      "6 Months Support"
    ],
    description: "Complete solution for businesses selling products online",
    deliveryTime: "8-12 weeks"
  }
];

const serviceCategories: ServiceCategory[] = [
  {
    title: "Custom Web Development",
    description: "Tailored web solutions built from scratch using modern technologies",
    icon: <FaCode className="text-4xl text-primary" />,
    features: [
      "Custom Frontend Development",
      "Backend API Development",
      "Database Design & Integration",
      "Third-party API Integration",
      "Performance Optimization"
    ],
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB"]
  },
  {
    title: "E-commerce Solutions",
    description: "Full-featured online stores with secure payment processing",
    icon: <FaShoppingCart className="text-4xl text-primary" />,
    features: [
      "Product Catalog Management",
      "Shopping Cart Implementation",
      "Payment Gateway Integration",
      "Order Management System",
      "Inventory Tracking"
    ],
    technologies: ["Shopify", "WooCommerce", "Stripe", "PayPal", "Square"]
  },
  {
    title: "CMS Development",
    description: "Content management systems for easy website updates",
    icon: <FaWordpress className="text-4xl text-primary" />,
    features: [
      "Custom Theme Development",
      "Plugin Development",
      "Content Migration",
      "Multi-language Support",
      "User Management"
    ],
    technologies: ["WordPress", "Drupal", "Contentful", "Strapi", "Ghost"]
  }
];

export const WebDevServices = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Service Categories */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Web Development Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {category.icon}
                <h3 className="text-2xl font-semibold ml-4">{category.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="mb-6 space-y-2">
                {category.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-white rounded-lg shadow-xl p-6 ${
                tier.recommended ? 'ring-2 ring-primary' : ''
              }`}
            >
              {tier.recommended && (
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Recommended
                </span>
              )}
              <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
              <p className="text-3xl font-bold text-primary mb-6">{tier.price}</p>
              <p className="text-gray-600 mb-6">{tier.description}</p>
              <ul className="mb-8 space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-gray-600 mb-6">
                <strong>Delivery Time:</strong> {tier.deliveryTime}
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}; 