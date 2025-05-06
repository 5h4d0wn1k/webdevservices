import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
            <Scale className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-400 mb-4">Last updated: March 15, 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-300 mb-4">
              By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              2. Use of Services
            </h2>
            <p className="text-gray-300 mb-4">
              Our services are provided "as is" and "as available." You agree to use our services only for lawful purposes and in accordance with these Terms.
            </p>
            <h3 className="text-xl font-semibold mb-3 text-white">2.1 Account Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Maintain accurate account information</li>
              <li>Keep your account credentials secure</li>
              <li>Notify us of any unauthorized access</li>
            </ul>
            <h3 className="text-xl font-semibold mb-3 text-white">2.2 Prohibited Activities</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Violating any applicable laws or regulations</li>
              <li>Impersonating others or providing false information</li>
              <li>Interfering with the proper functioning of the services</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              3. Intellectual Property
            </h2>
            <p className="text-gray-300 mb-4">
              All content, features, and functionality are owned by shadownik (swnk) and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>You may not copy, modify, or distribute our content</li>
              <li>All trademarks are the property of their respective owners</li>
              <li>Unauthorized use may violate applicable laws</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-300 mb-4">
              In no event shall shadownik (swnk) be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              5. Changes to Terms
            </h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify or replace these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified Terms.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              6. Contact Information
            </h2>
            <p className="text-gray-300">
              For any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4">
              <p className="text-gray-300">Email: legal@swnk.in</p>
              <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <a
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;