import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaFileUpload, FaInfoCircle, FaRocket, FaLightbulb, FaCode, FaCog, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ConsultationBooking from '../ConsultationBooking';
import { API_ENDPOINTS } from '../../config/api';
import { clientOnboardingData } from '../../data/clientOnboardingData';

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
  const { sectionHeading, sectionDescription, stepTexts, step1, step2, step3, step4, step5, successMessage, errorMessage, nextButtonText } = clientOnboardingData;

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
              {sectionHeading}
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {sectionDescription}
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
                  {step > num ? <FaCheck /> : stepTexts[num - 1]}
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
                {step1.heading}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {step1.projectTypes.map((type) => {
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
                {step2.heading}
              </h3>
              <form onSubmit={handleBusinessInfoSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">{step2.formLabels.businessName}</label>
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
                    <label className="block text-gray-300 mb-2">{step2.formLabels.industry}</label>
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
                    <label className="block text-gray-300 mb-2">{step2.formLabels.companySize}</label>
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
                      {step2.companySizeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">{step2.formLabels.website}</label>
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
                  {nextButtonText}
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
                {step3.heading}
              </h3>
              <form onSubmit={handleRequirementsSubmit} className="space-y-8">
                <div>
                  <label className="block text-gray-300 mb-4">
                    {step3.labels.features}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {step3.featureOptions.map((feature) => (
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
                  <label className="block text-gray-300 mb-2">{step3.labels.design}</label>
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
                    placeholder={step3.designPlaceholder}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">{step3.labels.timeline}</label>
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
                      {step3.timelineOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">{step3.labels.budget}</label>
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
                      {step3.budgetOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  {nextButtonText}
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
                {step4.heading}
              </h3>
              <form onSubmit={handleTechnicalSubmit} className="space-y-8">
                <div>
                  <label className="block text-gray-300 mb-4">
                    {step4.labels.technologies}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {step4.technologyOptions.map((tech) => (
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
                    <label className="block text-gray-300 mb-2">{step4.labels.hosting}</label>
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
                      {step4.hostingOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">{step4.labels.domain}</label>
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
                      {step4.domainOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  {nextButtonText}
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
                {step5.heading}
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
                <h3 className="text-2xl font-bold mb-2">{successMessage.heading}</h3>
                <p className="text-gray-300 mb-6">
                  {successMessage.text}
                </p>
                <button
                  onClick={() => {
                    setFormData(initialFormData);
                    setStep(1);
                    setSubmitStatus('idle');
                  }}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {successMessage.buttonText}
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
                <h3 className="text-2xl font-bold mb-2">{errorMessage.heading}</h3>
                <p className="text-gray-300 mb-6">
                  {errorMessage.text}
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {errorMessage.buttonText}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 