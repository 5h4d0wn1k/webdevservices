import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  MessagesSquare,
  Facebook,
  ArrowUp,
  Sparkles
} from 'lucide-react';

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

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black border-t border-white/10">
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
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <MotionA
              href="/"
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold mb-6 inline-block bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent"
            >
              SHADOWNIK
            </MotionA>
            <p className="text-gray-400 mb-6 max-w-md">
              Crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Github className="w-5 h-5" />, href: "https://github.com/Shadownik-official" },
                { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/Shadownik_ofc", label: "Twitter" },
                { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/shadownik", label: "LinkedIn" },
                { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/people/Shadownik/61562599613319", label: "Facebook" },
                { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/Shadownik.official", label: "Instagram" },
                { icon: <Youtube className="w-5 h-5" />, href: "https://www.youtube.com/@Shadownik.official", label: "YouTube" },
                { icon: <MessageCircle className="w-5 h-5" />, href: "https://t.me/shadownikofficial", label: "Telegram" },
                { icon: <MessagesSquare className="w-5 h-5" />, href: "https://www.whatsapp.com/channel/0029VakSdtTfXUuURqTLgF3A", label: "WhatsApp" }
             
              ].map((social, index) => (
                <MotionA
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-white/10 group"
                >
                  {social.icon}
                </MotionA>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Services
            </h3>
            <ul className="space-y-4">
              {[
                "Web Development",
                "Mobile Solutions",
                "E-Commerce",
                "UI/UX Design",
                "Cloud Services"
              ].map((item) => (
                <li key={item}>
                  <MotionA
                    href="#"
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    {item}
                  </MotionA>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Company
            </h3>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "#about" },
                { label: "Portfolio", href: "#portfolio" },
                { label: "Careers", href: "#" },
                { label: "Blog", href: "#blog" },
                { label: "Contact", href: "#contact" }
              ].map((item) => (
                <li key={item.label}>
                  <MotionA
                    href={item.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    {item.label}
                  </MotionA>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Shadownik. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <MotionA
              href="/privacy-policy"
              whileHover={{ scale: 1.05 }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </MotionA>
            <MotionA
              href="/terms-of-service"
              whileHover={{ scale: 1.05 }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </MotionA>
            <MotionButton
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-white/10 group"
            >
              <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
            </MotionButton>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;