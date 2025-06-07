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
  brandName: "Shadownik(SWNK)",
  description: "Crafting exceptional digital experiences through innovative design and cutting-edge technology.",
  socialLinks: [
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/Shadownik-official"
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://x.com/Shadownik_ofc",
      label: "Twitter"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/company/shadownik",
      label: "LinkedIn"
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com/people/Shadownik/61562599613319",
      label: "Facebook"
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com/Shadownik.official",
      label: "Instagram"
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      href: "https://www.youtube.com/@Shadownik.official",
      label: "YouTube"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      href: "https://t.me/shadownikofficial",
      label: "Telegram"
    },
    {
      icon: <MessagesSquare className="w-5 h-5" />,
      href: "https://www.whatsapp.com/channel/0029VakSdTtFXUuURqTLgF3A",
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
  copyrightLinkText: "Shadownik(SWNK)",
  copyrightLinkHref: "#",
  privacyPolicyLinkText: "Privacy Policy",
  privacyPolicyLinkHref: "/privacy-policy",
  termsOfServiceLinkText: "Terms of Service",
  termsOfServiceLinkHref: "/terms-of-service",
}; 