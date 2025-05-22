import React from 'react';

interface TermsSection {
  heading: string;
  content: (string | string[])[]; // Can be paragraphs or lists of strings
}

interface TermsOfServiceDataType {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
  contactInfo: {
    email: string;
    phone: string;
  };
  backLinkText: string;
  backLinkHref: string;
}

export const termsOfServiceData: TermsOfServiceDataType = {
  title: "Terms of Service",
  lastUpdated: "March 15, 2024",
  sections: [
    {
      heading: "1. Agreement to Terms",
      content: [
        "By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.",
      ]
    },
    {
      heading: "2. Use of Services",
      content: [
        "Our services are provided \"as is\" and \"as available.\" You agree to use our services only for lawful purposes and in accordance with these Terms.",
        "2.1 Account Responsibilities",
        [
          "Maintain accurate account information",
          "Keep your account credentials secure",
          "Notify us of any unauthorized access",
        ],
        "2.2 Prohibited Activities",
        [
          "Violating any applicable laws or regulations",
          "Impersonating others or providing false information",
          "Interfering with the proper functioning of the services",
        ]
      ]
    },
    {
      heading: "3. Intellectual Property",
      content: [
        "All content, features, and functionality are owned by Shadownik(Swnk), the web development services division of Shadownik, and are protected by international copyright, trademark, and other intellectual property laws.", // Updated text
        [
          "You may not copy, modify, or distribute our content",
          "All trademarks are the property of their respective owners",
          "Unauthorized use may violate applicable laws",
        ]
      ]
    },
    {
      heading: "4. Limitation of Liability",
      content: [
        "In no event shall Shadownik(Swnk), the web development services division of Shadownik, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.", // Updated text
      ]
    },
    {
      heading: "5. Changes to Terms",
      content: [
        "We reserve the right to modify or replace these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified Terms.",
      ]
    },
    {
      heading: "6. Contact Information",
      content: [
        "For any questions about these Terms, please contact us at:",
      ]
    }
  ],
  contactInfo: {
    email: "support@shadownik.online",
    phone: "+91 9165644843",
  },
  backLinkText: "Back to Home",
  backLinkHref: "/",
}; 