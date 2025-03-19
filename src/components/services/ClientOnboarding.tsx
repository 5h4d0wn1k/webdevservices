import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaFileUpload, FaInfoCircle, FaRocket, FaLightbulb, FaCode, FaCog, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ConsultationBooking from '../ConsultationBooking';
import { API_ENDPOINTS } from '../../config/api';

interface FormData {
  projectType: string;
  businessInfo: {
    name: string;
    email: string;
    industry: string;
    size: string;
    website: string;
  };
  requirements: {
    features: string[];
    design: string;
    timeline: string;
    budget: string;
  };
  technical: {
    hosting: string;
    domain: string;
    technologies: string[];
  };
  consultation: {
    date: Date | null;
    time: string;
  };
}

const initialFormData: FormData = {
  projectType: '',
  businessInfo: {
    name: '',
    email: '',
    industry: '',
    size: '',
    website: ''
  },
  requirements: {
    features: [],
    design: '',
    timeline: '',
    budget: ''
  },
  technical: {
    hosting: '',
    domain: '',
    technologies: []
  },
  consultation: {
    date: null,
    time: ''
  }
};

const projectTypes = [
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
];

const featureOptions = [
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
];

const technologyOptions = [
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
];

export const ClientOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleProjectTypeSelect = (type: string) => {
    setFormData({ ...formData, projectType: type });
    setStep(2);
  };

  const handleBusinessInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleRequirementsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  const handleTechnicalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(5);
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(API_ENDPOINTS.submitProject, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setFormData(initialFormData);
        setStep(1);
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitProjectData = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(API_ENDPOINTS.submitProject, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setFormData(initialFormData);
        setStep(1);
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    const features = formData.requirements.features;
    const newFeatures = features.includes(feature)
      ? features.filter(f => f !== feature)
      : [...features, feature];
    setFormData({
      ...formData,
      requirements: { ...formData.requirements, features: newFeatures }
    });
  };

  const handleTechnologyToggle = (tech: string) => {
    const technologies = formData.technical.technologies;
    const newTechnologies = technologies.includes(tech)
      ? technologies.filter(t => t !== tech)
      : [...technologies, tech];
    setFormData({
      ...formData,
      technical: { ...formData.technical, technologies: newTechnologies }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
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
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/20 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-[800px] h-[800px] bg-accent/20 rounded-full filter blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent animate-gradient">
              Start Your Project
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Let's bring your vision to life. Follow these steps to get started with your web development project.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <React.Fragment key={num}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: num * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= num ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step > num ? <FaCheck /> : num}
                </motion.div>
                {num < 5 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 100 }}
                    transition={{ delay: num * 0.1 + 0.2 }}
                    className={`h-1 w-24 ${
                      step > num ? 'bg-primary' : 'bg-gray-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">
                What type of project are you looking to build?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProjectTypeSelect(type.id)}
                      className={`p-6 bg-gradient-to-br ${type.gradient} rounded-xl shadow-lg hover:shadow-xl transition-all text-left text-white`}
                    >
                      <Icon className="w-8 h-8 mb-4" />
                      <h4 className="text-xl font-semibold mb-2">{type.title}</h4>
                      <p className="text-white/80">{type.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Tell us about your business
              </h3>
              <form onSubmit={handleBusinessInfoSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Business Name</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.businessInfo.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessInfo: { ...formData.businessInfo, name: e.target.value }
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Industry</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.businessInfo.industry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessInfo: { ...formData.businessInfo, industry: e.target.value }
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Company Size</label>
                    <select
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.businessInfo.size}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessInfo: { ...formData.businessInfo, size: e.target.value }
                        })
                      }
                      required
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201+">201+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Current Website (if any)</label>
                    <input
                      type="url"
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.businessInfo.website}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessInfo: { ...formData.businessInfo, website: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  Next Step
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 3: Project Requirements */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Project Requirements
              </h3>
              <form onSubmit={handleRequirementsSubmit} className="space-y-8">
                <div>
                  <label className="block text-gray-300 mb-4">
                    Select Required Features
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {featureOptions.map((feature) => (
                      <motion.label
                        key={feature}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.requirements.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="form-checkbox h-5 w-5 text-primary rounded border-gray-600 bg-gray-700"
                        />
                        <span className="text-gray-300">{feature}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Design Preferences</label>
                  <textarea
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                    rows={4}
                    value={formData.requirements.design}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: { ...formData.requirements, design: e.target.value }
                      })
                    }
                    placeholder="Describe your design preferences, brand guidelines, or reference websites..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Timeline</label>
                    <select
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.requirements.timeline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: { ...formData.requirements, timeline: e.target.value }
                        })
                      }
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="1-2">1-2 months</option>
                      <option value="3-4">3-4 months</option>
                      <option value="5-6">5-6 months</option>
                      <option value="6+">6+ months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Budget Range</label>
                    <select
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.requirements.budget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: { ...formData.requirements, budget: e.target.value }
                        })
                      }
                      required
                    >
                      <option value="">Select budget</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  Next Step
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 4: Technical Requirements */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Technical Requirements
              </h3>
              <form onSubmit={handleTechnicalSubmit} className="space-y-8">
                <div>
                  <label className="block text-gray-300 mb-4">
                    Preferred Technologies
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {technologyOptions.map((tech) => (
                      <motion.label
                        key={tech}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.technical.technologies.includes(tech)}
                          onChange={() => handleTechnologyToggle(tech)}
                          className="form-checkbox h-5 w-5 text-primary rounded border-gray-600 bg-gray-700"
                        />
                        <span className="text-gray-300">{tech}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Hosting Preference</label>
                    <select
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.technical.hosting}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          technical: { ...formData.technical, hosting: e.target.value }
                        })
                      }
                      required
                    >
                      <option value="">Select hosting</option>
                      <option value="aws">AWS</option>
                      <option value="vercel">Vercel</option>
                      <option value="netlify">Netlify</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Domain Status</label>
                    <select
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      value={formData.technical.domain}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          technical: { ...formData.technical, domain: e.target.value }
                        })
                      }
                      required
                    >
                      <option value="">Select status</option>
                      <option value="have">I have a domain</option>
                      <option value="need">Need to purchase</option>
                      <option value="transfer">Need to transfer</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  Next Step
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 5: Consultation Booking */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Schedule a Consultation
              </h3>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <ConsultationBooking
                  onBookingComplete={(bookingData) => {
                    setFormData({
                      ...formData,
                      consultation: {
                        date: bookingData.date,
                        time: bookingData.time
                      }
                    });
                    
                    // Send the combined data to the backend
                    submitProjectData({
                      ...formData,
                      consultation: {
                        date: bookingData.date,
                        time: bookingData.time,
                        name: bookingData.name,
                        email: bookingData.email,
                        phone: bookingData.phone,
                        message: bookingData.message,
                        meetLink: bookingData.meetLink
                      }
                    });
                  }}
                  className="py-0"
                />
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
            >
              <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-300 mb-6">
                  Your project details have been submitted successfully. We'll be in touch shortly.
                </p>
                <button
                  onClick={() => {
                    setFormData(initialFormData);
                    setStep(1);
                    setSubmitStatus('idle');
                  }}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Start New Project
                </button>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
            >
              <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaInfoCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Oops!</h3>
                <p className="text-gray-300 mb-6">
                  There was an error submitting your project. Please try again.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 