import React from 'react';
import { User } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
}

interface TestimonialsDataType {
  spanText: string;
  headingText: string;
  descriptionText: string;
  autoplayInterval: number;
  prevButtonAriaLabel: string;
  nextButtonAriaLabel: string;
  testimonials: Testimonial[];
}

export const testimonialsData: TestimonialsDataType = {
  spanText: "Client Success",
  headingText: "What Our Clients Say",
  descriptionText: "Discover how we've helped businesses transform their digital presence",
  autoplayInterval: 5000,
  prevButtonAriaLabel: "Previous testimonial",
  nextButtonAriaLabel: "Next testimonial",
  testimonials: [
    {
      id: 1,
      name: "Nikhil Nagpure",
      role: "Founder & CEO",
      company: "Shadownik(Swnk)", // Updated company name
      avatar: "",
      rating: 5,
      quote: "As the founder of Shadownik(Swnk), the web development services division of Shadownik, I'm proud to lead a team that's revolutionizing web development. Our commitment to excellence and innovation drives us to deliver exceptional results for every client. We combine technical expertise with creative solutions to create digital experiences that make a difference."
    },
    {
      id: 2,
      name: "Vishwakarma",
      role: "Principal",
      company: "Sunrise Public School",
      avatar: "",
      rating: 5,
      quote: "Leading both Shadownik(Swnk) and Sunrise Public School has given me unique insights into the importance of digital transformation in education. Our team's ability to create engaging educational platforms while maintaining high standards of excellence is truly remarkable."
    },
    {
      id: 3,
      name: "Manish Nagpure",
      role: "Network Engineer",
      company: "Shadownik(Swnk)", // Updated company name
      avatar: "",
      rating: 5,
      quote: "Our technical infrastructure and network solutions are built on cutting-edge technology. We ensure robust, secure, and scalable systems that support our clients' growing needs. The combination of technical expertise and client-focused approach sets us apart in the industry."
    },
    {
      id: 4,
      name: "Dinesh Nagpure",
      role: "Chemistry Teacher",
      company: "Govt. High School",
      avatar: "",
      rating: 5,
      quote: "The integration of technology in education through Shadownik(Swnk)'s solutions has transformed how we teach and learn. Our digital platforms make complex concepts more accessible and engaging for students, while providing teachers with powerful tools for effective instruction."
    }
  ]
}; 