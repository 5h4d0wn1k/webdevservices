import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { API_ENDPOINTS } from '../config/api';
import { consultationBookingData } from '../data/consultationBookingData';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  projectType: string;
  budget: string;
  message: string;
}

interface ConsultationBookingProps {
  onBookingComplete?: (data: BookingData & { meetLink?: string }) => void;
  className?: string;
}

const ConsultationBooking: React.FC<ConsultationBookingProps> = ({ onBookingComplete, className }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    date: null,
    time: '',
    projectType: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { headingText, descriptionText, projectTypes, budgetRanges, timeSlots, successMessage, errorMessage: dataErrorMessage, unexpectedErrorMessage, inputLabels, selectPlaceholders, buttonText } = consultationBookingData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date) {
      setErrorMessage('Please select a date for your consultation');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Format the date to ISO string
      const formattedDate = bookingData.date.toISOString();
      
      // Ensure time is in correct format (e.g., "11:00 AM")
      const formattedTime = bookingData.time;

      const response = await fetch(API_ENDPOINTS.bookConsultation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          date: formattedDate,
          time: formattedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book consultation');
      }

      // Store the meet link in localStorage for later use if needed
      if (data.meetLink) {
        localStorage.setItem('lastConsultationMeetLink', data.meetLink);
      }

      setSubmitStatus('success');
      
      // Call the onBookingComplete callback if provided
      if (onBookingComplete) {
        onBookingComplete({
          ...bookingData,
          meetLink: data.meetLink
        });
      }
      
      // Reset form after success (with a delay for user feedback)
      setTimeout(() => {
        setBookingData({
          name: '',
          email: '',
          phone: '',
          date: null,
          time: '',
          projectType: '',
          budget: '',
          message: ''
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Consultation booking error:', error);
      setErrorMessage(error instanceof Error ? error.message : unexpectedErrorMessage);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-20 relative ${className || ''}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-1/2 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute right-1/4 bottom-1/3 w-96 h-96 bg-primary/20 rounded-full filter blur-[120px]" />
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{headingText}</h2>
          <p className="text-xl text-gray-400">
            {descriptionText}
          </p>
        </motion.div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3"
              >
                <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                <p className="text-green-100">{successMessage}</p>
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
                <div>
                  <p className="text-red-100">{dataErrorMessage}</p>
                  {errorMessage && <p className="text-red-200 text-sm mt-1">{errorMessage}</p>}
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <User className="w-4 h-4 inline mr-2" />
                    {inputLabels.name}
                  </label>
                  <input
                    type="text"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {inputLabels.email}
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <Phone className="w-4 h-4 inline mr-2" />
                    {inputLabels.phone}
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {inputLabels.date}
                  </label>
                  <DatePicker
                    selected={bookingData.date}
                    onChange={(date) => setBookingData({ ...bookingData, date })}
                    minDate={new Date()}
                    className={`w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors ${!bookingData.date && submitStatus === 'error' ? 'border-red-500' : ''}`}
                    placeholderText="Select a date"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <Clock className="w-4 h-4 inline mr-2" />
                    {inputLabels.time}
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  >
                    <option value="">{selectPlaceholders.time}</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    {inputLabels.projectType}
                  </label>
                  <select
                    value={bookingData.projectType}
                    onChange={(e) => setBookingData({ ...bookingData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  >
                    <option value="">{selectPlaceholders.projectType}</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <Loader2 className="w-4 h-4 inline mr-2" />
                    {inputLabels.budget}
                  </label>
                  <select
                    value={bookingData.budget}
                    onChange={(e) => setBookingData({ ...bookingData, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  >
                    <option value="">{selectPlaceholders.budget}</option>
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    {inputLabels.message}
                  </label>
                  <textarea
                    value={bookingData.message}
                    onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:from-accent hover:to-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Booking...' : buttonText}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsultationBooking; 