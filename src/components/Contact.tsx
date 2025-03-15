import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    value: "hello@shadownik.com",
    link: "mailto:hello@shadownik.com"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Location",
    value: "San Francisco, CA",
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

const MotionButton = motion(forwardRef((props: any, ref) => (
  <button ref={ref} {...props} />
)));

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-primary uppercase tracking-wider text-sm font-medium">Get in Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent animate-gradient">
            Let's Create Something Amazing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Ready to transform your digital presence? We're here to help bring your vision to life.
          </p>
        </MotionDiv>

        <div className="grid lg:grid-cols-2 gap-16">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <MotionA
                    key={info.title}
                    href={info.link}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group border border-white/10"
                  >
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.title}</div>
                      <div className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {info.value}
                      </div>
                    </div>
                  </MotionA>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Project Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2 hover:from-primary-dark hover:to-accent-dark transition-all duration-300 shadow-lg shadow-primary/25 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MotionButton>
            </form>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Contact;