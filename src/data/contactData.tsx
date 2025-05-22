import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import React from 'react';

interface ContactInfoItem {
  icon: JSX.Element;
  label?: string;
  title?: string;
  value: string;
  link: string;
}

interface ContactDataType {
  spanText: string;
  headingText: string;
  descriptionText: string;
  contactInfo: ContactInfoItem[];
  services: string[];
}

export const contactData: ContactDataType = {
  spanText: "Get in Touch",
  headingText: "Ready to Transform Your Digital Presence?",
  descriptionText: "Contact us today to discuss your project and discover how Shadownik(Swnk) can elevate your web presence",
  contactInfo: [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "info@shadownik.online",
      link: "mailto:info@shadownik.online"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+91 9165644843",
      link: "tel:+919165644843"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Remote, India",
      link: "#"
    }
  ],
  services: [
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
  ]
}; 