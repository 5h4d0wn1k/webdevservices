import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { privacyPolicyData } from '../data/privacyPolicyData';

const PrivacyPolicy = () => {
  const { title, lastUpdated, sections, contactInfo, backLinkText, backLinkHref } = privacyPolicyData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          <p className="text-gray-400 mb-4">Last updated: {lastUpdated}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {section.heading}
              </h2>
              {section.content.map((item, itemIndex) => (
                Array.isArray(item) ? (
                  <ul key={itemIndex} className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                    {item.map((listItem, listItemIndex) => (
                      <li key={listItemIndex}>{listItem}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={itemIndex} className="text-gray-300 mb-4">{item}</p>
                )
              ))}
              {section.heading === '5. Contact Us' && (
                <div className="mt-4">
                  <p className="text-gray-300">Email: {contactInfo.email}</p>
                  <p className="text-gray-300">Phone: {contactInfo.phone}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <a
            href={backLinkHref}
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLinkText}
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;