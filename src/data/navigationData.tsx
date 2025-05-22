import React from 'react';

interface NavDropdownItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

interface NavigationDataType {
  brandName: string;
  navItems: NavItem[];
}

export const navigationData: NavigationDataType = {
  brandName: "Shadownik(Swnk)",
  navItems: [
    { name: 'About', href: '#about' },
    { 
      name: 'Services', 
      href: '#services',
      dropdown: [
        { name: 'Web Development', href: '#web-development' },
        { name: 'E-commerce', href: '#e-commerce' },
        { name: 'Web Applications', href: '#web-applications' },
        { name: 'Digital Marketing', href: '#digital-marketing' }
      ]
    },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ]
}; 