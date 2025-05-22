import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaMobile, FaShoppingCart, FaWordpress, FaTools } from 'react-icons/fa';
import { SiWebpack, SiNextdotjs, SiReact, SiTypescript } from 'react-icons/si';
import { webDevServicesData } from '../../data/webDevServicesData';

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

export const WebDevServices = () => {
  const { serviceCategoriesHeading, pricingTiersHeading, serviceTiers, serviceCategories } = webDevServicesData;

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Service Categories */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center mb-12">{serviceCategoriesHeading}</h2>
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
        <h2 className="text-4xl font-bold text-center mb-12">{pricingTiersHeading}</h2>
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