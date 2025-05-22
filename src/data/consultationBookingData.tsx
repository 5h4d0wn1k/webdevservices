import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import React from 'react';

interface ConsultationBookingDataType {
  headingText: string;
  descriptionText: string;
  projectTypes: string[];
  budgetRanges: string[];
  timeSlots: string[];
  successMessage: string;
  errorMessage: string;
  unexpectedErrorMessage: string;
  inputLabels: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    projectType: string;
    budget: string;
    message: string;
  };
  selectPlaceholders: {
    service: string;
    time: string;
    projectType: string;
    budget: string;
  };
  buttonText: string;
}

export const consultationBookingData: ConsultationBookingDataType = {
  headingText: "Schedule a Free Consultation",
  descriptionText: "Book a 30-minute call with our experts to discuss your project and get a free quote",
  projectTypes: [
    "Custom Website",
    "E-commerce Store",
    "Web Application",
    "Mobile App",
    "UI/UX Design",
    "Digital Marketing",
    "SEO Services",
    "Cloud Solutions",
    "AI Integration",
    "Other"
  ],
  budgetRanges: [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+"
  ],
  timeSlots: [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ],
  successMessage: "Consultation booked successfully! We've sent you a confirmation email with all the details.",
  errorMessage: "There was an error booking your consultation.",
  unexpectedErrorMessage: "An unexpected error occurred",
  inputLabels: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Preferred Date",
    time: "Preferred Time",
    projectType: "Project Type",
    budget: "Budget",
    message: "Message",
  },
  selectPlaceholders: {
    service: "Select a service",
    time: "Select time slot",
    projectType: "Select project type",
    budget: "Select budget range",
  },
  buttonText: "Book Consultation",
}; 