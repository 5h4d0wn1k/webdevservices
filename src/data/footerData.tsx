import { Github, Twitter, Linkedin, Instagram, Youtube, MessageCircle, MessagesSquare, Facebook, ArrowUp, Sparkles } from 'lucide-react';
import React from 'react';

interface SocialLink {
  icon: JSX.Element;
  href: string;
  label?: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface FooterDataType {
  brandName: string;
  description: string;
  socialLinks: SocialLink[];
  servicesHeading: string;
  servicesLinks: string[];
  companyHeading: string;
  companyLinks: NavLink[];
  copyrightText: string;
  copyrightLinkText: string;
  copyrightLinkHref: string;
  privacyPolicyLinkText: string;
  privacyPolicyLinkHref: string;
  termsOfServiceLinkText: string;
  termsOfServiceLinkHref: string;
}

export const footerData: FooterDataType = {
  brandName: "Shadownik(Swnk)",
  description: "Crafting exceptional digital experiences through innovative design and cutting-edge technology.",
  socialLinks: [
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/Shadownik(Swnk)-official"
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://x.com/Shadownik(Swnk)_ofc",
      label: "Twitter"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/company/Shadownik(Swnk)",
      label: "LinkedIn"
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com/people/Shadownik(Swnk)/61562599613319",
      label: "Facebook"
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com/Shadownik(Swnk).official",
      label: "Instagram"
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      href: "https://www.youtube.com/@Shadownik(Swnk).official",
      label: "YouTube"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      href: "https://t.me/Shadownik(Swnk)official",
      label: "Telegram"
    },
    {
      icon: <MessagesSquare className="w-5 h-5" />,
      href: "https://www.whatsapp.com/channel/0029VakSdtTfXUuURqTLgF3A",
      label: "WhatsApp"
    }
  ],
  servicesHeading: "Services",
  servicesLinks: [
    "Web Development",
    "Mobile Solutions",
    "E-Commerce",
    "UI/UX Design",
    "Cloud Services"
  ],
  companyHeading: "Company",
  companyLinks: [
    { label: "About Us", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" }
  ],
  copyrightText: "A Web Development Service of",
  copyrightLinkText: "Shadownik(Swnk)",
  copyrightLinkHref: "#",
  privacyPolicyLinkText: "Privacy Policy",
  privacyPolicyLinkHref: "/privacy-policy",
  termsOfServiceLinkText: "Terms of Service",
  termsOfServiceLinkHref: "/terms-of-service",
}; 