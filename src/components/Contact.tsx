import React, { forwardRef, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  MessagesSquare
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    value: "info@shadownik.online",
    link: "mailto:info@shadownik.online"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    value: "+91 9165644843",
    link: "tel:+15551234567"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Location",
    value: "Remote, India",
    link: "#"
  }
];

// Create motion components with forwardRef
const MotionDiv = motion(forwardRef((props: any, ref) => (
  <div ref={ref} {...props} />
)));

const MotionA = motion(forwardRef((props: any, ref) => (
  <a ref={ref} {...props} />
)));

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (isTouched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIsTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'service':
        if (!value.trim()) error = 'Please select a service';
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required';
        break;
      default:
        break;
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    const fields = ['name', 'email', 'service', 'message'] as const;
    let isValid = true;
    
    // Set all fields as touched
    const touchedFields = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setIsTouched(touchedFields);
    
    // Validate all fields
    fields.forEach(field => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid response format');
      }

      if (!response.ok) {
        console.error('Server error response:', responseData);
        throw new Error(responseData.message || 'Failed to send message');
      }

      // Success - don't check for exact message text to make it more flexible
      setSubmitStatus('success');
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', email: '', service: '', message: '' });
        setIsTouched({});
        setSubmitStatus('idle');
        if (formRef.current) formRef.current.reset();
      }, 3000);
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    "Web Development",
    "Mobile App Development",
    "E-commerce Solutions",
    "UI/UX Design",
    "Custom Software",
    "Digital Marketing",
    "SEO Services",
    "Cloud Solutions",
    "AI Integration",
    "Other Services"
  ];

  return (
    <section id="contact" className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-1/2 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute right-1/4 bottom-1/3 w-96 h-96 bg-primary/20 rounded-full filter blur-[120px]" />
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4">
            <MessageSquare size={14} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Get in Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Digital Presence?</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Contact us today to discuss your project and discover how Shadownik can elevate your web presence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-lg">
                    {React.cloneElement(item.icon, { className: 'w-6 h-6 text-primary' })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <MotionA
                      href={item.link}
                      className="text-gray-400 hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      {item.value}
                    </MotionA>
                  </div>
                </motion.div>
              ))}

              {/* Social Media */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: <Github className="w-5 h-5" />, href: "https://github.com/Shadownik-official", label: "GitHub" },
                    { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/Shadownik_ofc", label: "Twitter" },
                    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/shadownik", label: "LinkedIn" },
                    { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/people/Shadownik/61562599613319", label: "Facebook" },
                    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/Shadownik.official", label: "Instagram" },
                    { icon: <Youtube className="w-5 h-5" />, href: "https://www.youtube.com/@Shadownik.official", label: "YouTube" },
                    { icon: <MessageCircle className="w-5 h-5" />, href: "https://t.me/shadownikofficial", label: "Telegram" },
                    { icon: <MessagesSquare className="w-5 h-5" />, href: "https://www.whatsapp.com/channel/0029VakSdtTfXUuURqTLgF3A", label: "WhatsApp" }
                  ].map((social, i) => (
                    <MotionA 
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-full border border-white/10 hover:border-primary/50 transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </MotionA>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-xl">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Success/Error Messages */}
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3"
                    >
                      <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                      <p className="text-green-100">Your message has been sent successfully! We'll get back to you soon.</p>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3"
                    >
                      <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                      <p className="text-red-100">There was an error sending your message. Please try again.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      formErrors.name && isTouched.name ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors`}
                    placeholder="Your name"
                  />
                  {formErrors.name && isTouched.name && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      formErrors.email && isTouched.email ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors`}
                    placeholder="Your email"
                  />
                  {formErrors.email && isTouched.email && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Service Selection */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1">Service Needed</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      formErrors.service && isTouched.service ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors`}
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {formErrors.service && isTouched.service && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.service}</p>
                  )}
                </div>
                
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      formErrors.message && isTouched.message ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors resize-none`}
                    placeholder="Tell us about your project..."
                  />
                  {formErrors.message && isTouched.message && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;